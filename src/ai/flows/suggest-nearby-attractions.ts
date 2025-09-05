// src/ai/flows/suggest-nearby-attractions.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests nearby attractions, landmarks, and points of interest
 * based on the user's location and contextual factors such as time of day and weather.
 *
 * - suggestNearbyAttractions - The main function to initiate the suggestion process.
 * - SuggestNearbyAttractionsInput - The input type for the suggestNearbyAttractions function.
 * - SuggestNearbyAttractionsOutput - The output type for the suggestNearbyAttractions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNearbyAttractionsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
  timeOfDay: z.string().describe('The time of day (e.g., morning, afternoon, evening).'),
  weather: z.string().describe('The current weather conditions (e.g., sunny, rainy, cloudy).'),
  interests: z.string().describe('A comma separated list of user interests (e.g., history, art, food).'),
});
export type SuggestNearbyAttractionsInput = z.infer<typeof SuggestNearbyAttractionsInputSchema>;

const SuggestNearbyAttractionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('The name of the attraction.'),
      description: z.string().describe('A brief description of the attraction.'),
      address: z.string().describe('The address of the attraction.'),
    })
  ).describe('A list of suggested nearby attractions.'),
});
export type SuggestNearbyAttractionsOutput = z.infer<typeof SuggestNearbyAttractionsOutputSchema>;

export async function suggestNearbyAttractions(input: SuggestNearbyAttractionsInput): Promise<SuggestNearbyAttractionsOutput> {
  return suggestNearbyAttractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNearbyAttractionsPrompt',
  input: {schema: SuggestNearbyAttractionsInputSchema},
  output: {schema: SuggestNearbyAttractionsOutputSchema},
  prompt: `You are a helpful AI assistant that suggests nearby attractions, landmarks, and points of interest based on the user's location and contextual factors.

  The current time of day is: {{{timeOfDay}}}
  The current weather is: {{{weather}}}
  The user's interests are: {{{interests}}}

  Location:
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}

  Suggest some attractions near this location, taking into account the time of day, weather, and user interests. Return an array of suggestions, including the name, description, and address of each attraction.
  Make sure to include the address and description of each location, along with its name.
  `,
});

const suggestNearbyAttractionsFlow = ai.defineFlow(
  {
    name: 'suggestNearbyAttractionsFlow',
    inputSchema: SuggestNearbyAttractionsInputSchema,
    outputSchema: SuggestNearbyAttractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
