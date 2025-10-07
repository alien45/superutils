export type AssetType = 'text' | 'image' | 'audio' | 'video' | 'model3d'

export interface Asset {
    id: string
    type: AssetType
    content: string | Buffer
    metadata?: Record<string, unknown>
}

export interface AIContext {
    conversationId: string
    history: Array<{
        role: AIRole
        content: string
        name?: string
    }>
    assets: Asset[]
    metadata?: Record<string, unknown>
}

export interface AIProviderConfig {
    id: string
    name: string
    apiKey: string
    model?: string
    maxTokens?: number
    temperature?: number
    apiEndpoint?: string
    additionalHeaders?: Record<string, string>
}

export interface AIProvider {
    config: AIProviderConfig
    connect(): Promise<void>
    disconnect(): Promise<void>
    executeTask(task: AITask, context: AIContext): Promise<AITaskResult>
    isConnected(): boolean
}

export enum AIRole {
    system = 'system',
    user = 'user',
    assistant = 'assistant',
}

export enum TaskStatus {
    pending = 'pending',
    running = 'running',
    completed = 'completed',
    failed = 'failed',
}

export interface AITask {
    id: string
    name: string
    description?: string
    providerId?: string // If not specified, orchestrator will pick an available provider
    input: {
        prompt: string
        systemPrompt?: string
        assets?: Asset[]
    }
    requirements?: {
        model?: string
        minTokens?: number
        maxTokens?: number
        capabilities?: string[] // e.g., ['text', 'image', 'audio']
    }
    dependsOn?: string[] // IDs of tasks that must complete before this one
    metadata?: Record<string, unknown>
    role: AIRole
}

export interface AITaskResultMetadata {
    startTime: number
    endTime: number
    tokensUsed?: {
        input: number
        output: number
    }
    [key: string]: unknown
}

export interface AITaskResult {
    taskId: string
    success: boolean
    output: {
        content: string
        generatedAssets?: Asset[]
    }
    error?: Error
    metadata?: AITaskResultMetadata
}