import { v4 as uuidv4 } from 'uuid'
import { AIProvider, AITask, AIContext, AITaskResult, TaskStatus, AIRole } from '../types/types'
import { EventEmitter } from 'events'

interface TaskQueueItem {
	task: AITask
	status: TaskStatus
	result?: AITaskResult
}

export class AIOrchestrator extends EventEmitter {
	private providers: Map<string, AIProvider> = new Map()
	private taskQueue: Map<string, TaskQueueItem> = new Map()
	private context: AIContext

	constructor(initialContext?: Partial<AIContext>) {
		super()
		this.context = {
			conversationId: uuidv4(),
			history: [],
			assets: [],
			...initialContext,
		}
	}

	registerProvider(provider: AIProvider): void {
		this.providers.set(provider.config.id, provider)
	}

	unregisterProvider(providerId: string): void {
		this.providers.delete(providerId)
	}

	async addTask(task: Omit<AITask, 'id'>): Promise<string> {
		// Check for provider availability before queueing the task
		const provider = task.providerId
			? this.providers.get(task.providerId)
			: this.selectProvider(task as AITask)

		if (!provider) throw new Error('No suitable provider found for task')

		const id = uuidv4()
		const fullTask: AITask = { ...task, id }

		this.taskQueue.set(id, {
			task: fullTask,
			status: TaskStatus.pending,
		})

		// If no dependencies, execute immediately
		if (!fullTask.dependsOn?.length) this.executeTask(id)

		return id
	}

	async executePendingTasks(): Promise<void> {
		const executableTasks = Array.from(this.taskQueue.entries()).filter(([_, item]) => {
			if (item.status !== TaskStatus.pending) return false

			// Check if all dependencies are completed
			const task = item.task
			if (!task.dependsOn?.length) return true

			return task.dependsOn.every(depId => {
				const depTask = this.taskQueue.get(depId)
				return depTask?.status === TaskStatus.completed
			})
		})
		if (executableTasks.length === 0) return
		console.log(
			'Executable tasks:',
			JSON.stringify(
				executableTasks.map(([id, { task }]) => task.name),
				null,
				4,
			),
		)
		await Promise.all(executableTasks.map(([taskId]) => this.executeTask(taskId)))
	}

	private async executeTask(taskId: string, executeNext = true): Promise<void> {
		const queueItem = this.taskQueue.get(taskId)
		if (!queueItem || queueItem.status !== TaskStatus.pending) return

		const task = queueItem.task
		let provider = task.providerId
			? this.providers.get(task.providerId)
			: this.selectProvider(task)

		if (!provider) {
			this.handleTaskError(taskId, new Error('No suitable provider found for task'))
			return
		}

		try {
			queueItem.status = TaskStatus.running
			this.emit('taskStarted', { taskId, task })

			// Ensure provider is connected
			!provider.isConnected() && (await provider.connect())

			const result = await provider.executeTask(task, this.context)

			// Update context with task result
			this.updateContext(task, result)

			queueItem.result = result
			queueItem.status = TaskStatus.completed
			this.emit('taskCompleted', { taskId, result })

			// Execute next batch of tasks
			executeNext && this.executePendingTasks()
		} catch (error) {
			this.handleTaskError(taskId, error as Error)
		}
	}

	private selectProvider(task: AITask): AIProvider | undefined {
		// Simple provider selection - can be enhanced based on requirements
		return Array.from(this.providers.values()).find(provider => {
			if (task.requirements?.model && provider.config.model !== task.requirements.model) {
				return false
			}
			// Add more provider selection criteria here
			return true
		})
	}

	private handleTaskError(taskId: string, error: Error): void {
		const queueItem = this.taskQueue.get(taskId)
		if (!queueItem) return

		queueItem.status = TaskStatus.failed
		queueItem.result = {
			taskId,
			success: false,
			output: { content: '' },
			error,
			metadata: {
				startTime: Date.now(),
				endTime: Date.now(),
			},
		}

		this.emit('taskFailed', { taskId, error })
	}

	private updateContext(task: AITask, result: AITaskResult): void {
		// Add to conversation history
		this.context.history.push({
			role: AIRole.user,
			content: result.output.content,
			name: task.name,
		})

		// Add any generated assets
		if (result.output.generatedAssets?.length) {
			this.context.assets.push(...result.output.generatedAssets)
		}

		// Update metadata
		if (result.metadata) {
			this.context.metadata = {
				...this.context.metadata,
				[task.id]: result.metadata,
			}
		}
	}

	getTaskStatus(taskId: string): TaskStatus | undefined {
		return this.taskQueue.get(taskId)?.status
	}

	getTaskResult(taskId: string): AITaskResult | undefined {
		return this.taskQueue.get(taskId)?.result
	}

	getContext(): AIContext {
		return { ...this.context }
	}

	clearContext(): void {
		this.context = {
			conversationId: uuidv4(),
			history: [],
			assets: [],
			metadata: {},
		}
	}
}
