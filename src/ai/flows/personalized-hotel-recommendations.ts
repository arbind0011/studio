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
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the hotel.'),
      description: z.string().describe('A brief description of the hotel.'),
      address: z.string().describe('The full address of the hotel.'),
      latitude: z.number().describe('The latitude of the hotel.'),
      longitude: z.number().describe('The longitude of the hotel.'),
      imageUrl: z.string().url().describe('A URL for an image of the hotel.'),
    })
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
  prompt: `You are a hotel recommendation expert. Based on the user's current location and preferences, provide a list of suitable hotel recommendations. For each hotel, you must provide its name, a short description, its full address, and an exact latitude and longitude. The latitude and longitude fields are mandatory. Also include a placeholder image URL from 'https://picsum.photos/seed/{random}/400/300'. Use a different random seed for each hotel.

Current Location: {{{location}}}
User Preferences: {{{preferences}}}

Return the recommendations in the requested output format.`,
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
