'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending local restaurants, cafes, and eateries to the user.
 *
 * - recommendLocalEateries - A function that takes user location and preferences as input and returns a list of recommended eateries.
 * - RecommendLocalEateriesInput - The input type for the recommendLocalEateries function.
 * - RecommendLocalEateriesOutput - The return type for the recommendLocalEateries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLocalEateriesInputSchema = z.object({
  latitude: z
    .number()
    .describe('The latitude of the user\'s current location.'),
  longitude: z
    .number()
    .describe('The longitude of the user\'s current location.'),
  preferences: z
    .string()
    .describe(
      'The user\'s preferences for restaurants, cafes, and eateries. This could include cuisine types, price range, ambiance, etc.'
    ),
});
export type RecommendLocalEateriesInput = z.infer<
  typeof RecommendLocalEateriesInputSchema
>;

const RecommendLocalEateriesOutputSchema = z.object({
  recommendations: z
    .array(
        z.object({
            name: z.string().describe('The name of the eatery.'),
            description: z.string().describe('A brief description of the eatery.'),
            address: z.string().describe('The full address of the eatery.'),
            latitude: z.number().describe('The latitude of the eatery.'),
            longitude: z.number().describe('The longitude of the eatery.'),
            imageUrl: z.string().url().describe('A URL for an image of the eatery.'),
        })
    )
    .describe('A list of recommended restaurants, cafes, and eateries.'),
});
export type RecommendLocalEateriesOutput = z.infer<
  typeof RecommendLocalEateriesOutputSchema
>;

export async function recommendLocalEateries(
  input: RecommendLocalEateriesInput
): Promise<RecommendLocalEateriesOutput> {
  return recommendLocalEateriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLocalEateriesPrompt',
  input: {schema: RecommendLocalEateriesInputSchema},
  output: {schema: RecommendLocalEateriesOutputSchema},
  prompt: `You are a local restaurant recommendation expert.

  Based on the user's current location (latitude: {{{latitude}}}, longitude: {{{longitude}}}) and preferences ({{{preferences}}}), recommend a list of restaurants, cafes, and eateries.
  For each place, provide its name, a brief description, its full address with exact latitude and longitude, and a placeholder image URL from 'https://picsum.photos/400/300'.
  Return the recommendations in the requested output format.
  Do not include contact information.
  Do not include disclaimers that you are an AI. Just return the list of recommendations.
  `,
});

const recommendLocalEateriesFlow = ai.defineFlow(
  {
    name: 'recommendLocalEateriesFlow',
    inputSchema: RecommendLocalEateriesInputSchema,
    outputSchema: RecommendLocalEateriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
