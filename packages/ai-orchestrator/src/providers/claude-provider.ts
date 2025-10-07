import Anthropic from '@anthropic-ai/sdk'
import { BaseAIProvider } from './base-provider'
import {
    AITask,
    AIContext,
    AITaskResult,
    AIProviderConfig,
    AIRole,
    AITaskResultMetadata
} from '../types/types'

export class ClaudeProvider extends BaseAIProvider {
    private client: Anthropic | null = null

    constructor(config: AIProviderConfig) {
        super({
            ...config,
            model: config.model || 'claude-3-opus-20240229'  // Default model
        })
    }

    async connect(): Promise<void> {
        this.client = new Anthropic({
            apiKey: this.config.apiKey,
            baseURL: this.config.apiEndpoint,
        })
        this._isConnected = true
    }

    async executeTask(task: AITask, context: AIContext): Promise<AITaskResult> {
        this.validateTask(task)

        if (!this.client) throw new Error('Anthropic client not initialized. Call connect() first.')

        let content = ''
        let err: Error | undefined
        let success = false
        const metadata: AITaskResultMetadata = {
            startTime: Date.now(),
            endTime: 0, // to be replaced
        }

        try {
            // Format messages for Claude's API
            const messages = [
                // System message if provided
                ...task.input.systemPrompt
                    ? [{
                        role: AIRole.assistant as const,
                        content: task.input.systemPrompt
                    }]
                    : [],

                // Include relevant history
                ...context.history.map(msg => ({
                    role: msg.role === AIRole.user
                        ? msg.role
                        : AIRole.assistant as const,
                    content: msg.content
                })),

                // Add the current task prompt
                {
                    role: AIRole.user as const,
                    content: task.input.prompt
                }
            ] as Anthropic.Messages.MessageParam[]

            const maxTokens = task.requirements?.maxTokens
                || this.config.maxTokens
                || 4096
            const response = await this
                .client
                .messages
                .create({
                    model: this.config.model!,
                    max_tokens: maxTokens,
                    temperature: this.config.temperature ?? 0.7,
                    messages,
                })

            content = response
                .content
                .reduce((acc, block) => acc + (
                    'text' in block
                        ? block.text
                        : ''
                ), '')
            success = true
            metadata.model = response.model
            const {
                input_tokens: input,
                output_tokens: output
            } = response.usage
            metadata.tokensUsed = {
                input,
                output,
            }
        } catch (error) {
            err = error as Error
        }
        metadata.endTime = Date.now()
        return this.createTaskResult(
            task.id,
            success,
            { content },
            err,
            metadata
        )
    }
}