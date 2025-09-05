// src/ai/flows/personalized-hotel-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized hotel recommendations based on user location and preferences.
 *
 * - personalizedHotelRecommendations - A function that returns personalized hotel recommendations.
 * - PersonalizedHotelRecommendationsInput - The input type for the personalizedHotelRecommendations function.
 * - PersonalizedHotelRecommendationsOutput - The return type for the personalizedHotelRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHotelRecommendationsInputSchema = z.object({
  location: z
    .string()
    .describe('The current location of the user (e.g., city, address).'),
  preferences: z
    .string()
    .describe(
      'The user preferences for hotels (e.g., price range, amenities, star rating).'
    ),
});
export type PersonalizedHotelRecommendationsInput = z.infer<
  typeof PersonalizedHotelRecommendationsInputSchema
>;

const PersonalizedHotelRecommendationsOutputSchema = z.object({
  hotelRecommendations: z
    .string()
    .describe(
      'A list of hotel recommendations based on the user location and preferences.'
    ),
});
export type PersonalizedHotelRecommendationsOutput = z.infer<
  typeof PersonalizedHotelRecommendationsOutputSchema
>;

export async function personalizedHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  return personalizedHotelRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHotelRecommendationsPrompt',
  input: {schema: PersonalizedHotelRecommendationsInputSchema},
  output: {schema: PersonalizedHotelRecommendationsOutputSchema},
  prompt: `You are a hotel recommendation expert. Based on the user's current location and preferences, provide a list of suitable hotel recommendations.

Current Location: {{{location}}}
User Preferences: {{{preferences}}}

Hotel Recommendations:`,
});

const personalizedHotelRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedHotelRecommendationsFlow',
    inputSchema: PersonalizedHotelRecommendationsInputSchema,
    outputSchema: PersonalizedHotelRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
