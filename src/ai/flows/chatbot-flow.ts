
'use server';
/**
 * @fileOverview A multi-purpose chatbot flow that can translate, plan travel, and provide voice responses.
 *
 * - chatbotFlow - The main function that orchestrates the chatbot's response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { recommendLocalEateries } from './recommend-local-eateries';
import { personalizedHotelRecommendations } from './personalized-hotel-recommendations';
import { suggestNearbyAttractions } from './suggest-nearby-attractions';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

// Define tools for the chatbot to use
const translationTool = ai.defineTool(
  {
    name: 'translateText',
    description: 'Translates text from a source language to a target language.',
    inputSchema: z.object({
      text: z.string().describe('The text to translate.'),
      targetLanguage: z.string().describe('The target language to translate to (e.g., "Spanish", "French").'),
      sourceLanguage: z.string().optional().describe('The source language of the text.'),
    }),
    outputSchema: z.string().describe('The translated text.'),
  },
  async ({ text, targetLanguage, sourceLanguage }) => {
    const prompt = `Translate the following text from ${sourceLanguage || 'the detected language'} to ${targetLanguage}: "${text}"`;
    const llmResponse = await ai.generate({
        prompt,
        model: googleAI.model('gemini-pro'),
        output: { format: 'text' }
    });
    return llmResponse.text;
  }
);

const hotelTool = ai.defineTool({
    name: 'findHotels',
    description: 'Finds hotel recommendations based on location and user preferences.',
    inputSchema: z.object({
        location: z.string().describe("The city or area to search for hotels."),
        preferences: z.string().describe("User's preferences like 'cheap', 'luxury', 'with a pool'.")
    }),
    outputSchema: z.any(),
}, async (input) => await personalizedHotelRecommendations(input));

const restaurantTool = ai.defineTool({
    name: 'findRestaurants',
    description: 'Finds restaurant recommendations based on location and user preferences.',
    inputSchema: z.object({
        latitude: z.number(),
        longitude: z.number(),
        preferences: z.string().describe("User's preferences like 'italian', 'spicy', 'vegetarian'.")
    }),
    outputSchema: z.any(),
}, async (input) => await recommendLocalEateries(input));

const attractionTool = ai.defineTool({
    name: 'findAttractions',
    description: 'Finds attraction recommendations based on location and user interests.',
    inputSchema: z.object({
        latitude: z.number(),
        longitude: z.number(),
        interests: z.string().describe("User's interests like 'history', 'art', 'nightlife'.")
    }),
    outputSchema: z.any(),
}, async (input) => await suggestNearbyAttractions({ ...input, timeOfDay: 'afternoon', weather: 'sunny' }));


// Main chatbot flow
const chatbotSystemPrompt = `You are BulBul, an expert AI travel assistant.
- Your primary function is to help users with travel-related queries, such as translating text, or finding hotels, restaurants, and attractions.
- Use the provided tools to answer user requests.
- When you use a tool and get a result, present the results to the user in a clear, friendly, and readable format. Do not just output raw JSON. Summarize the results. For example: "I found a few great options for you! For Italian food, there's 'Mama's Pizzeria' which has great reviews..."
- If the user asks a general question, provide a helpful response.
- Your responses should be concise and conversational.
- You can provide responses in the user's language.
- After generating your text response, you MUST determine if the response is something that should be spoken aloud. Generally, all translations and direct answers to questions should be spoken. However, long lists of recommendations should not be. If the response should be spoken, set the 'shouldSpeak' field to true.
`;

const ChatbotOutputSchema = z.object({
    text: z.string().describe("The chatbot's text response to the user."),
    shouldSpeak: z.boolean().describe("Whether the text response should be converted to audio and spoken."),
});

const prompt = ai.definePrompt({
    name: 'chatbotPrompt',
    system: chatbotSystemPrompt,
    tools: [translationTool, hotelTool, restaurantTool, attractionTool],
    input: { schema: z.string() },
    output: { schema: ChatbotOutputSchema },
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) { bufs.push(d); });
    writer.on('end', function () { resolve(Buffer.concat(bufs).toString('base64')); });

    writer.write(pcmData);
    writer.end();
  });
}

export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
        text: z.string(),
        audioUrl: z.string().optional(),
    }),
  },
  async (message) => {
    const llmResponse = await prompt(message);
    const chatbotResponse = llmResponse.output;

    if (!chatbotResponse) {
        throw new Error("Could not get a response from the AI.");
    }
    
    let audioUrl: string | undefined = undefined;

    if (chatbotResponse.shouldSpeak && chatbotResponse.text) {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                  },
                },
            },
            prompt: chatbotResponse.text,
        });

        if (media?.url) {
            const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
            const wavBase64 = await toWav(audioBuffer);
            audioUrl = 'data:audio/wav;base64,' + wavBase64;
        }
    }

    return {
        text: chatbotResponse.text,
        audioUrl: audioUrl,
    };
  }
);
