'use server';
/**
 * @fileOverview A simple conversational chatbot flow that chats with the user.
 *
 * - chatbotFlow - The main function that orchestrates the chatbot's response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Function to get Gemini API key securely
function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key is not set. Please set GEMINI_API_KEY environment variable.');
  }
  return key;
}

// Helper to create Gemini model with API key
function geminiModel(modelName: string) {
  return googleAI.model(modelName, { apiKey: getGeminiApiKey() });
}

// System prompt for general conversation
const chatbotSystemPrompt = `You are BulBul, a friendly and helpful AI assistant.
- Your primary function is to chat with the user in a natural, conversational manner.
- Provide clear, concise, and friendly responses.
- You can answer questions, provide explanations, or just chat casually.
- Keep the conversation engaging and polite.
- Respond in the user's language if possible.
`;

// Output schema for chatbot response
const ChatbotOutputSchema = z.object({
  text: z.string().describe("The chatbot's text response to the user."),
});

// Define the prompt without tools, just conversational
const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  system: chatbotSystemPrompt,
  input: { schema: z.string() },
  output: { schema: ChatbotOutputSchema },
  // Use Gemini conversational model
  model: geminiModel('gemini-pro'),
});

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
      text: z.string(),
    }),
  },
  async (message) => {
    const llmResponse = await prompt(message);
    const chatbotResponse = llmResponse.output;

    if (!chatbotResponse) {
      throw new Error("Could not get a response from the AI.");
    }

    return {
      text: chatbotResponse.text,
    };
  }
);
