# @utiils/ai-orchestrator

A TypeScript utility for orchestrating multiple AI providers and chaining AI tasks. This package allows you to:

- Connect to and use multiple AI providers (OpenAI, Anthropic Claude, etc.)
- Chain AI tasks with dependencies
- Maintain context and transfer assets between tasks
- Handle asynchronous task execution with proper error handling

## Installation

```bash
npm install @utiils/ai-orchestrator
```

## Basic Usage

```typescript
import { AIOrchestrator, OpenAIProvider, ClaudeProvider } from '@utiils/ai-orchestrator';

// Initialize orchestrator
const orchestrator = new AIOrchestrator();

// Configure and register providers
const openAIProvider = new OpenAIProvider({
  id: 'openai-1',
  name: 'OpenAI GPT-4',
  apiKey: 'your-api-key',
  model: 'gpt-4'
});

const claudeProvider = new ClaudeProvider({
  id: 'claude-1',
  name: 'Claude',
  apiKey: 'your-api-key',
  model: 'claude-2'
});

// Register providers
orchestrator.registerProvider(openAIProvider);
orchestrator.registerProvider(claudeProvider);

// Example: AI Group Chat
async function startAIGroupChat() {
  // Add first task - Moderator sets up the discussion
  const moderatorTaskId = await orchestrator.addTask({
    name: 'Moderator',
    providerId: 'claude-1',
    input: {
      systemPrompt: 'You are a skilled moderator who keeps discussions focused and productive.',
      prompt: 'Set up a discussion about the future of AI in healthcare. Outline 3 key points to discuss.'
    }
  });

  // Add second task - Expert 1 responds
  const expert1TaskId = await orchestrator.addTask({
    name: 'Healthcare Expert',
    providerId: 'openai-1',
    input: {
      systemPrompt: 'You are a healthcare technology expert.',
      prompt: 'Review the moderator\'s points and provide insights on the first point.'
    },
    dependsOn: [moderatorTaskId]
  });

  // Add third task - Expert 2 builds on Expert 1's response
  await orchestrator.addTask({
    name: 'AI Researcher',
    providerId: 'claude-1',
    input: {
      systemPrompt: 'You are an AI researcher.',
      prompt: 'Build upon the healthcare expert\'s insights and address the second point.'
    },
    dependsOn: [expert1TaskId]
  });

  // Listen for task completion
  orchestrator.on('taskCompleted', ({ taskId, result }) => {
    console.log(`Task ${taskId} completed:`, result.output.content);
  });
}

// Example: Content Generation Pipeline
async function generateAndReviewContent() {
  // Author task
  const authorTaskId = await orchestrator.addTask({
    name: 'Author',
    providerId: 'openai-1',
    input: {
      systemPrompt: 'You are a technical writer creating clear, concise documentation.',
      prompt: 'Write a technical guide about implementing authentication in a Node.js API.'
    }
  });

  // Editor task
  const editorTaskId = await orchestrator.addTask({
    name: 'Editor',
    providerId: 'claude-1',
    input: {
      systemPrompt: 'You are a technical editor who reviews and improves documentation.',
      prompt: 'Review the technical guide. Focus on clarity, accuracy, and completeness. Suggest specific improvements if needed.'
    },
    dependsOn: [authorTaskId]
  });

  // Get results
  const editorResult = await new Promise(resolve => {
    orchestrator.on('taskCompleted', ({ taskId, result }) => {
      if (taskId === editorTaskId) {
        resolve(result);
      }
    });
  });

  return editorResult;
}
```

## Advanced Features

### Context and Asset Management

The orchestrator maintains context across tasks, including:
- Conversation history
- Generated assets (text, images, etc.)
- Task-specific metadata

```typescript
// Get current context
const context = orchestrator.getContext();

// Clear context if needed
orchestrator.clearContext();
```

### Task Status and Results

```typescript
// Check task status
const status = orchestrator.getTaskStatus(taskId);

// Get task result
const result = orchestrator.getTaskResult(taskId);
```

### Custom Providers

You can implement custom AI providers by extending the BaseAIProvider class:

```typescript
import { BaseAIProvider, AITask, AIContext, AITaskResult } from '@utiils/ai-orchestrator';

class CustomAIProvider extends BaseAIProvider {
  async connect(): Promise<void> {
    // Initialize your AI client
  }

  async executeTask(task: AITask, context: AIContext): Promise<AITaskResult> {
    // Implement task execution logic
  }
}
```

## API Reference

### AIOrchestrator

Main class for orchestrating AI tasks.

Methods:
- `registerProvider(provider: AIProvider)`
- `unregisterProvider(providerId: string)`
- `addTask(task: AITask): Promise<string>`
- `getTaskStatus(taskId: string): TaskStatus`
- `getTaskResult(taskId: string): AITaskResult`
- `getContext(): AIContext`
- `clearContext()`

Events:
- `taskStarted`: Emitted when a task begins execution
- `taskCompleted`: Emitted when a task successfully completes
- `taskFailed`: Emitted when a task fails

### AIProvider Interface

Interface that all AI providers must implement:

```typescript
interface AIProvider {
  config: AIProviderConfig;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  executeTask(task: AITask, context: AIContext): Promise<AITaskResult>;
  isConnected(): boolean;
}
```

## License

MIT