import GenAI, { Content, GoogleGenAI } from '@google/genai'
import { BaseAIProvider } from './base-provider'
import { AITask, AIContext, AITaskResult, AIProviderConfig } from '../types/types'

enum GEMINI_ROLE {
    model = 'model',
    user = 'user',
}
type ChatMessage = Content

export type GeminiConfig = AIProviderConfig

const DEFAULT_MODEL = 'gemini-2.0-flash'
type ModelList = Awaited<ReturnType<GoogleGenAI['models']['list']>>

const getRole = (role: string) => role in GEMINI_ROLE
    ? GEMINI_ROLE[role as keyof typeof GEMINI_ROLE]
    : GEMINI_ROLE.user

export class GeminiProvider extends BaseAIProvider {
    private genAI: GoogleGenAI//GoogleGenerativeAI
    private model?: GenAI.Model
    protected modelValid?: true | false
    public modelList?: ModelList
    config: GeminiConfig

    constructor(config: GeminiConfig) {
        super(config)
        this.config = config
        this.genAI = new GoogleGenAI({}) // client gets API key from process.env.GEMINI_API_KEY
    }

    async connect(): Promise<void> {
        try {
            // Initialize the model
            this.modelList = this.modelList || await this.genAI.models.list()
            const allModelNames = [] as string[]
            const modelName = (() => {
                const name = this.config.model || DEFAULT_MODEL
                return name.startsWith('models/')
                    ? name
                    : `models/${name}`
            })()
            for await (const model of this.modelList) {
                model.name && allModelNames.push(model.name)
                if (model.name !== modelName) continue

                console.log('Using Gemini model:', model)
                this.modelValid = true
                this.model = model
                break
            }

            if (!this.model) throw new Error(
                `Invalid/unsupported model: ${modelName}. Supported models: ${JSON.stringify(allModelNames, null, 4)}`
            )

            // // Test connection with a simple prompt
            // const result = await this.generateContent('test')
            // if (!result.text) throw new Error('Failed to get response from Gemini API')

            this._isConnected = true
        } catch (error: unknown) {
            this._isConnected = false
            if (error instanceof Error) {
                throw new Error(`Failed to connect to Gemini: ${error.message}`)
            }
            throw new Error('Failed to connect to Gemini: Unknown error')
        }
    }

    async executeTask(task: AITask, context: AIContext): Promise<AITaskResult> {
        // Validate the task
        this.validateTask(task)

        try {
            // Create conversation history if provided in context
            const chatHistory: ChatMessage[] = []
            if (context?.history) {

                chatHistory.push(
                    ...context.history.map(msg => ({
                        role: getRole(msg.role),
                        parts: [{
                            text: msg.content
                        }],
                    }))
                )
            }

            // Start a chat if there's history, otherwise generate content directly
            const result = chatHistory.length > 0
                ? await this.handleChatTask(task, chatHistory)
                : await this.handleGenerateTask(task)

            return {
                taskId: task.id,
                success: true,
                output: {
                    content: result,
                    generatedAssets: []
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            return {
                taskId: task.id,
                success: false,
                output: {
                    content: '',
                    generatedAssets: []
                },
                error: new Error(errorMessage)
            }
        }
    }

    generateContent(prompt: string) {
        console.log('\n\nGeminiProvider.generateContent.prompt:', prompt)
        return this.genAI.models.generateContent({
            model: this.config.model || DEFAULT_MODEL,
            contents: prompt,
            config: {
                temperature: this.config.temperature ?? 0.7,
                maxOutputTokens: this.config.maxTokens// ?? 1024,
            }
        })
    }

    private async handleChatTask(task: AITask, history: ChatMessage[]): Promise<any> {
        try {
            const chat = this.genAI.chats.create({
                config: {
                    temperature: this.config.temperature ?? 0.7,
                    maxOutputTokens: this.config.maxTokens// ?? 1024,
                },
                history,
                model: this.config.model || DEFAULT_MODEL,
            })

            const result = await chat.sendMessage({ message: task.input.prompt })
            return result.text
        } catch (error: unknown) {
            const msg = error instanceof Error
                ? error.message
                : 'Unknown chat error'
            throw new Error(`Gemini chat error: ${msg}`, { cause: error })
        }
    }

    private async handleGenerateTask(task: AITask): Promise<any> {
        try {
            const result = await this.generateContent(task.input.prompt)
            if (!result.text) throw new Error('No text returned from Gemini generateContent')
            return result.text
        } catch (error) {
            const msg = error instanceof Error
                ? error.message
                : 'Unknown error'
            throw new Error(`Gemini content generation failed: ${msg}`, { cause: error })
        }
    }
}