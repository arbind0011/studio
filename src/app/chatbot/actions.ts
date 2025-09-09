
"use server";

import { z } from 'zod';
import { chatbotFlow } from '@/ai/flows/chatbot-flow';

export interface ChatbotResponse {
    text: string;
    audioUrl?: string;
}

export async function getChatbotResponse(message: string): Promise<{ response?: ChatbotResponse; error?: string }> {
    try {
        const result = await chatbotFlow(message);
        return { response: result };
    } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return { error };
    }
}
