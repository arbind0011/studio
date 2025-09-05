"use server";

import { suggestNearbyAttractions, SuggestNearbyAttractionsInput } from '@/ai/flows/suggest-nearby-attractions';
import { z } from 'zod';

const formSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timeOfDay: z.string(),
  weather: z.string(),
  interests: z.string().min(3),
});

export async function getAttractionSuggestions(input: SuggestNearbyAttractionsInput) {
    const validatedInput = formSchema.safeParse(input);

    if (!validatedInput.success) {
        return { error: 'Invalid input. Please provide all required fields.' };
    }
    
    try {
        const result = await suggestNearbyAttractions(validatedInput.data);
        return { suggestions: result.suggestions };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get suggestions. Please try again.' };
    }
}
