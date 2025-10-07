import { AIProvider, AIProviderConfig, AITask, AIContext, AITaskResult } from '../types/types';

export abstract class BaseAIProvider implements AIProvider {
    protected _isConnected: boolean = false;

    constructor(public config: AIProviderConfig) { }

    abstract connect(): Promise<void>;
    abstract executeTask(task: AITask, context: AIContext): Promise<AITaskResult>;

    async disconnect(): Promise<void> {
        this._isConnected = false;
    }

    isConnected(): boolean {
        return this._isConnected;
    }

    protected validateTask(task: AITask): void {
        if (!task.id) throw new Error('Task ID is required');
        if (!task.name) throw new Error('Task name is required');
        if (!task.input?.prompt) throw new Error('Task prompt is required');

        // Validate requirements if specified
        if (task.requirements) {
            if (task.requirements.model && task.requirements.model !== this.config.model) {
                throw new Error(`Provider ${this.config.name} does not support required model ${task.requirements.model}`);
            }
            if (task.requirements.capabilities?.length) {
                // Provider-specific capability validation should be implemented in derived classes
            }
        }
    }

    protected createTaskResult(
        taskId: string,
        success: boolean,
        output: AITaskResult['output'],
        error?: Error,
        metadata?: AITaskResult['metadata']
    ): AITaskResult {
        return {
            taskId,
            success,
            output,
            error,
            metadata: {
                startTime: Date.now(),
                endTime: Date.now(),
                ...metadata,
            },
        };
    }
}