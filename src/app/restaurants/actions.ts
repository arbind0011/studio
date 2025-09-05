"use server";

import { recommendLocalEateries, RecommendLocalEateriesInput } from '@/ai/flows/recommend-local-eateries';
import { z } from 'zod';

const formSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  preferences: z.string().min(5),
});

export async function getRestaurantRecommendations(input: RecommendLocalEateriesInput) {
    const validatedInput = formSchema.safeParse(input);

    if (!validatedInput.success) {
        return { error: 'Invalid input. Please provide location and preferences.' };
    }
    
    try {
        const result = await recommendLocalEateries(validatedInput.data);
        return { recommendations: result.recommendations };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get recommendations. Please try again.' };
    }
}
