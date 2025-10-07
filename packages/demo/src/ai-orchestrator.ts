// import {
//     AIOrchestrator,
//     AITask,
//     AIContext,
//     GeminiProvider
// } from '@utiils/ai-orchestrator';

// async function runArticleWorkflow() {
//     // Initialize orchestrator
//     const orchestrator = new AIOrchestrator({
//         metadata: { source: 'article-workflow' }
//     });

//     // Register Gemini provider using environment variable
//     orchestrator.registerProvider(new GeminiProvider({
//         id: 'gemini-1',
//         name: 'Google Gemini',
//         apiKey: process.env.GEMINI_API_KEY || '',
//         model: 'gemini-2.5-pro',
//         temperature: 0.7
//     }));
//     // Listen to task events
//     orchestrator.on('taskStarted', ({ taskId, task }) => {
//         console.log(`\nTask started: ${task.name} (${taskId})`);
//     });

//     orchestrator.on('taskCompleted', ({ taskId, result }) => {
//         console.log(`\nTask completed: ${taskId}`);
//         console.log('Result:', result);//.output.content
//     });

//     orchestrator.on('taskFailed', ({ taskId, error }) => {
//         console.error(`\nTask failed: ${taskId}`, error);
//     });

//     // Define article writing task
//     const writeArticleTask: Omit<AITask, 'id'> = {
//         name: 'Write Article',
//         providerId: 'gemini-1',
//         input: {
//             prompt: `Write a Sci-Fi story about a random topic. Make it funny, engaging, futuristic and exciting.`
//         }
//     };

//     // Define review and improvement task
//     const reviewArticleTask: Omit<AITask, 'id'> = {
//         name: 'Review and Improve Article',
//         providerId: 'gemini-1',
//         input: {
//             prompt: `Review the article above and suggest improvements for:
//                 1. Clarity and flow
//                 2. Technical accuracy
//                 3. Supporting examples
//                 4. Industry relevance
                
//                 If improvements are needed, provide an enhanced version of the article.
//                 If the article is already well-written, explain why it meets high-quality standards.`
//         }
//     };

//     try {
//         console.log('\nStarting article workflow...');

//         // Add tasks to orchestrator
//         const writeId = await orchestrator.addTask(writeArticleTask);

//         // Make review task dependent on article writing
//         const reviewId = await orchestrator.addTask({
//             ...reviewArticleTask,
//             dependsOn: [writeId]
//         });

//         // Monitor task statuses
//         const checkStatus = setInterval(() => {
//             const tasks = [
//                 { id: writeId, name: 'Article Writing' },
//                 { id: reviewId, name: 'Article Review' }
//             ];

//             let failed = false
//             const allCompleted = tasks.every(task => {
//                 const status = orchestrator.getTaskStatus(task.id);
//                 console.log(`${task.name} status: ${status}`);
//                 failed = failed || status === 'failed'
//                 return failed || status === 'completed'
//             });

//             if (allCompleted || failed) {
//                 clearInterval(checkStatus);

//                 if (failed) return
//                 // Get final context
//                 const finalContext = orchestrator.getContext();
//                 console.log('\nWorkflow Results:');
//                 finalContext.history.forEach(msg => {
//                     console.log(`\n[${msg.name}]:\n${msg.content}`);
//                 });
//             }
//         }, 1000);

//     } catch (error) {
//         console.error('Error in article workflow:', error);
//     }
// }

// // Run the workflow if GEMINI_API_KEY is available
// if (!process.env.GEMINI_API_KEY) {
//     console.error('Error: GEMINI_API_KEY environment variable is not set');
//     process.exit(1);
// }

// console.log('Starting Article Workflow with Gemini...');
// runArticleWorkflow().catch(console.error);