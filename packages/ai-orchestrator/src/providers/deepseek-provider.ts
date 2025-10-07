import OpenAI from 'openai';
import { BaseAIProvider } from './base-provider';
import { AITask, AIContext, AITaskResult, AIProviderConfig } from '../types/types';

export class DeepSeekProvider extends BaseAIProvider {
    private api: OpenAI | null = null;

    constructor(config: AIProviderConfig) {
        super({
            ...config,
            model: config.model || 'deepseek-chat'  // Default model
        });
    }

    async connect(): Promise<void> {
        this.api = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.apiEndpoint || 'https://api.deepseek.com/v1',
        });
        this._isConnected = true;
    }

    async executeTask(task: AITask, context: AIContext): Promise<AITaskResult> {
        this.validateTask(task);

        if (!this.api) {
            throw new Error('DeepSeek API not initialized. Call connect() first.');
        }

        const startTime = Date.now();

        try {
            // Prepare messages from context and task
            const messages = [
                // System message if provided
                ...(task.input.systemPrompt ? [{
                    role: 'system' as const,
                    content: task.input.systemPrompt
                }] : []),

                // Include relevant history
                ...context.history.map(msg => ({
                    role: msg.role as 'system' | 'user' | 'assistant',
                    content: msg.content,
                    ...(msg.name ? { name: msg.name } : {})
                })),

                // Add the current task prompt
                {
                    role: 'user' as const,
                    content: task.input.prompt
                }
            ];

            const completion = await this.api.chat.completions.create({
                model: this.config.model!,
                messages,
                max_tokens: task.requirements?.maxTokens || this.config.maxTokens,
                temperature: this.config.temperature,
            });

            const response = completion.choices[0]?.message?.content || '';

            return this.createTaskResult(
                task.id,
                true,
                { content: response },
                undefined,
                {
                    startTime,
                    endTime: Date.now(),
                    tokensUsed: {
                        input: completion.usage?.prompt_tokens || 0,
                        output: completion.usage?.completion_tokens || 0
                    },
                    model: completion.model,
                }
            );
        } catch (error) {
            return this.createTaskResult(
                task.id,
                false,
                { content: '' },
                error as Error,
                {
                    startTime,
                    endTime: Date.now()
                }
            );
        }
    }
}