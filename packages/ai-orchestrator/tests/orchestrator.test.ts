import { describe, expect, it, beforeEach } from 'vitest'
import { AIOrchestrator } from '../src'
import {
	AIProvider,
	AITask,
	AIContext,
	AITaskResult,
	AIProviderConfig,
} from '../src'

// Mock AI Provider for testing
class MockProvider implements AIProvider {
	public config: AIProviderConfig
	private _isConnected = false

	constructor(config: AIProviderConfig) {
		this.config = config
	}

	async connect(): Promise<void> {
		this._isConnected = true
	}

	async disconnect(): Promise<void> {
		this._isConnected = false
	}

	isConnected(): boolean {
		return this._isConnected
	}

	async executeTask(task: AITask, context: AIContext): Promise<AITaskResult> {
		return {
			taskId: task.id,
			success: true,
			output: {
				content: `Mock response for task: ${task.name}`,
			},
			metadata: {
				startTime: Date.now(),
				endTime: Date.now(),
				model: this.config.model,
			},
		}
	}
}

describe('AIOrchestrator', () => {
	let orchestrator: AIOrchestrator
	let mockProvider: MockProvider

	beforeEach(() => {
		orchestrator = new AIOrchestrator()
		mockProvider = new MockProvider({
			id: 'mock-provider',
			name: 'Mock Provider',
			apiKey: 'mock-key',
			model: 'mock-model',
		})
		orchestrator.registerProvider(mockProvider)
	})

	it('should register and unregister providers', async () => {
		expect(orchestrator.getContext()).toBeDefined()

		// First verify the provider works when registered
		const validTask: Omit<AITask, 'id'> = {
			name: 'test-task',
			providerId: 'mock-provider',
			input: {
				prompt: 'test prompt',
			},
		}

		// Should succeed with registered provider
		const taskId = await orchestrator.addTask(validTask)
		expect(taskId).toBeDefined()

		// Unregister provider
		orchestrator.unregisterProvider('mock-provider')

		// Now trying to add a task should fail
		await expect(orchestrator.addTask(validTask)).rejects.toThrow(
			'No suitable provider found for task',
		)
	})

	it('should execute tasks in correct order based on dependencies', async () => {
		const results: string[] = []

		orchestrator.on('taskCompleted', ({ taskId, result }) => {
			results.push(result.output.content)
		})

		const task1Id = await orchestrator.addTask({
			name: 'Task 1',
			providerId: 'mock-provider',
			input: {
				prompt: 'First task',
			},
		})

		const task2Id = await orchestrator.addTask({
			name: 'Task 2',
			providerId: 'mock-provider',
			input: {
				prompt: 'Second task',
			},
			dependsOn: [task1Id],
		})

		await orchestrator.addTask({
			name: 'Task 3',
			providerId: 'mock-provider',
			input: {
				prompt: 'Third task',
			},
			dependsOn: [task2Id],
		})

		// Wait for all tasks to complete
		await new Promise(resolve => setTimeout(resolve, 100))

		expect(results).toHaveLength(3)
		expect(results[0]).toContain('Task 1')
		expect(results[1]).toContain('Task 2')
		expect(results[2]).toContain('Task 3')
	})

	it('should maintain context between tasks', async () => {
		const taskId = await orchestrator.addTask({
			name: 'Context Test',
			providerId: 'mock-provider',
			input: {
				prompt: 'Test prompt',
			},
		})

		// Wait for task to complete
		await new Promise(resolve => setTimeout(resolve, 50))

		const context = orchestrator.getContext()
		expect(context.history).toHaveLength(1)
		expect(context.history[0].content).toContain('Context Test')
	})

	it('should handle task failures gracefully', async () => {
		const failingProvider = new MockProvider({
			id: 'failing-provider',
			name: 'Failing Provider',
			apiKey: 'mock-key',
			model: 'mock-model',
		})

		// Override executeTask to simulate failure
		failingProvider.executeTask = async () => {
			throw new Error('Simulated failure')
		}

		orchestrator.registerProvider(failingProvider)

		const errors: Error[] = []
		orchestrator.on('taskFailed', ({ error }) => {
			errors.push(error)
		})

		await orchestrator.addTask({
			name: 'Failing Task',
			providerId: 'failing-provider',
			input: {
				prompt: 'This will fail',
			},
		})

		// Wait for task to fail
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(errors).toHaveLength(1)
		expect(errors[0].message).toBe('Simulated failure')
	})
})
