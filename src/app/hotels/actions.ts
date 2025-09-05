"use server";

import { personalizedHotelRecommendations, PersonalizedHotelRecommendationsInput } from '@/ai/flows/personalized-hotel-recommendations';
import { z } from 'zod';

const formSchema = z.object({
  location: z.string().min(2),
  preferences: z.string().min(10),
});

export async function getHotelRecommendations(input: PersonalizedHotelRecommendationsInput) {
    const validatedInput = formSchema.safeParse(input);

    if (!validatedInput.success) {
        return { error: 'Invalid input.' };
    }
    
    try {
        const result = await personalizedHotelRecommendations(validatedInput.data);
        return { recommendations: result.recommendations };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get recommendations. Please try again.' };
    }
}
