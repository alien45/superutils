import { describe, expect, it, vi, beforeEach } from 'vitest'
import { OpenAIProvider } from '../src/providers/openai-provider'
import { AITask, AIContext } from '../src/types/types'

vi.mock('openai', () => {
	const mockCreate = vi.fn().mockResolvedValue({
		id: 'mock-completion-id',
		model: 'gpt-4',
		choices: [
			{
				message: {
					role: 'assistant',
					content: 'Mock response from OpenAI',
				},
			},
		],
		usage: {
			prompt_tokens: 40,
			completion_tokens: 20,
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

describe('OpenAIProvider', () => {
	let provider: OpenAIProvider
	const mockConfig = {
		id: 'openai-test',
		name: 'OpenAI Test',
		apiKey: 'mock-api-key',
		model: 'gpt-4',
	}

	beforeEach(() => {
		vi.clearAllMocks()
		provider = new OpenAIProvider(mockConfig)
	})

	it('should connect successfully', async () => {
		await provider.connect()
		expect(provider.isConnected()).toBe(true)
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
		}

		const mockContext: AIContext = {
			conversationId: 'test-convo',
			history: [
				{ role: 'user', content: 'Previous message' },
				{ role: 'assistant', content: 'Previous response' },
			],
			assets: [],
		}

		const result = await provider.executeTask(mockTask, mockContext)

		expect(result.success).toBe(true)
		expect(result.output.content).toBe('Mock response from OpenAI')
		expect(result.taskId).toBe(mockTask.id)
		expect(result.metadata).toBeDefined()
		expect(result.metadata?.tokensUsed).toEqual({
			input: 40,
			output: 20,
		})
	})

	it('should handle errors gracefully', async () => {
		await provider.connect()

		const mockError = new Error('API Error')
		vi.mocked(provider['api']!.chat.completions.create).mockRejectedValueOnce(mockError)

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

	it('should use organization ID when provided', async () => {
		const providerWithOrg = new OpenAIProvider({
			...mockConfig,
			additionalHeaders: {
				'OpenAI-Organization': 'org-123',
			},
		})

		await providerWithOrg.connect()
		expect(providerWithOrg['api']).toBeDefined()
	})
})
