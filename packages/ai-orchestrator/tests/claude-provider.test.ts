import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { AITask, AIContext, ClaudeProvider } from '../src'

vi.mock('@anthropic-ai/sdk', () => {
	return {
		default: class MockAnthropic {
			messages = {
				create: vi.fn().mockResolvedValue({
					id: 'mock-message-id',
					model: 'claude-3-opus-20240229',
					content: [{ text: 'Mock response from Claude' }],
				}),
			}
		},
	}
})

describe('ClaudeProvider', () => {
	let provider: ClaudeProvider
	const mockConfig = {
		id: 'claude-test',
		name: 'Claude Test',
		apiKey: 'mock-api-key',
		model: 'claude-3-opus-20240229',
	}

	beforeEach(() => {
		provider = new ClaudeProvider(mockConfig)
	})

	afterEach(() => {
		vi.clearAllMocks()
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
		expect(result.output.content).toBe('Mock response from Claude')
		expect(result.taskId).toBe(mockTask.id)
		expect(result.metadata).toBeDefined()
	})

	it('should handle errors gracefully', async () => {
		await provider.connect()

		// Mock the Anthropic API to throw an error
		const mockError = new Error('API Error')
		vi.mocked(provider['client']!.messages.create).mockRejectedValueOnce(
			mockError,
		)

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

	it('should handle system prompts correctly', async () => {
		await provider.connect()

		const taskWithSystemPrompt: AITask = {
			id: 'system-prompt-task',
			name: 'System Prompt Task',
			input: {
				systemPrompt: 'You are a helpful assistant',
				prompt: 'Hello',
			},
		}

		await provider.executeTask(taskWithSystemPrompt, {
			conversationId: 'test',
			history: [],
			assets: [],
		})

		expect(
			vi.mocked(provider['client']!.messages.create),
		).toHaveBeenCalledWith(
			expect.objectContaining({
				messages: expect.arrayContaining([
					expect.objectContaining({
						role: 'assistant',
						content: 'You are a helpful assistant',
					}),
				]),
			}),
		)
	})
})
