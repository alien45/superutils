import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AITask, AIContext, DeepSeekProvider, AIRole } from '../src'

vi.mock('openai', () => {
	const mockCreate = vi.fn().mockResolvedValue({
		id: 'mock-completion-id',
		model: 'deepseek-chat',
		choices: [
			{
				message: {
					role: 'assistant',
					content: 'Mock response from DeepSeek',
				},
			},
		],
		usage: {
			prompt_tokens: 50,
			completion_tokens: 30,
		},
	})

	return {
		default: class {
			constructor(public config: any) {}
			chat = {
				completions: {
					create: mockCreate,
				},
			}
		},
	}
})

describe('DeepSeekProvider', () => {
	let provider: DeepSeekProvider
	const mockConfig = {
		id: 'deepseek-test',
		name: 'DeepSeek Test',
		apiKey: 'mock-api-key',
		model: 'deepseek-chat',
	}

	beforeEach(() => {
		vi.clearAllMocks()
		provider = new DeepSeekProvider(mockConfig)
	})

	it('should connect successfully', async () => {
		await provider.connect()
		expect(provider.isConnected()).toBe(true)
		expect(provider['api']).toBeDefined()
	})

	it('should execute tasks with proper context handling', async () => {
		await provider.connect()

		const mockTask: AITask = {
			id: 'test-task',
			name: 'Test Task',
			input: {
				systemPrompt: 'You are a helpful assistant',
				prompt: 'Hello, how are you?',
			},
			role: AIRole.assistant,
		}

		const mockContext: AIContext = {
			conversationId: 'test-convo',
			history: [
				{ role: AIRole.user, content: 'Previous message' },
				{ role: AIRole.assistant, content: 'Previous response' },
			],
			assets: [],
		}

		const result = await provider.executeTask(mockTask, mockContext)

		expect(result.success).toBe(true)
		expect(result.output.content).toBe('Mock response from DeepSeek')
		expect(result.taskId).toBe(mockTask.id)
		expect(result.metadata).toBeDefined()
		expect(result.metadata?.tokensUsed).toEqual({
			input: 50,
			output: 30,
		})
	})

	it('should handle errors gracefully', async () => {
		await provider.connect()

		const mockError = new Error('API Error')
		vi.mocked(
			provider['api']!.chat.completions.create,
		).mockRejectedValueOnce(mockError)

		const mockTask: AITask = {
			id: 'error-task',
			name: 'Error Task',
			input: {
				prompt: 'This will fail',
			},
		}

		const result = await provider.executeTask(mockTask, {
			conversationId: 'test',
			history: [],
			assets: [],
		})

		expect(result.success).toBe(false)
		expect(result.error).toBeDefined()
		expect(result.error!.message).toBe('API Error')
	})

	it('should validate tasks properly', async () => {
		await provider.connect()

		const invalidTask = {
			id: 'invalid-task',
			name: 'Invalid Task',
			input: {}, // Missing prompt
		} as AITask

		await expect(
			provider.executeTask(invalidTask, {
				conversationId: 'test',
				history: [],
				assets: [],
			}),
		).rejects.toThrow('Task prompt is required')
	})

	it('should use custom API endpoint when provided', async () => {
		const customEndpointProvider = new DeepSeekProvider({
			...mockConfig,
			apiEndpoint: 'https://custom-endpoint.com',
		})

		await customEndpointProvider.connect()
		expect(provider['api']).toBeDefined()
	})
})
