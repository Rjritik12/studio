
'use server';
/**
 * @fileOverview An AI agent for exploring and explaining concepts.
 *
 * Exports:
 * - exploreConcept: An async function that takes an ExploreConceptInput and returns an ExploreConceptOutput.
 *   It provides an explanation, related terms, and an analogy for a given concept.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ExploreConceptInput as ExploreConceptInputType, ExploreConceptOutput as ExploreConceptOutputType } from '@/lib/types'; // Renamed to avoid conflict

// Internal schema, not exported but used for Genkit flow definition
const ExploreConceptInputSchema = z.object({
  concept: z.string().min(1, { message: "Concept cannot be empty." }).describe('The concept or keyword to be explained.'),
});

// Internal schema, not exported but used for Genkit flow definition
const ExploreConceptOutputSchema = z.object({
  explanation: z.string().describe('A concise explanation of the concept.'),
  relatedTerms: z.array(z.string()).describe('A list of 3-5 key terms related to the concept.'),
  analogy: z.string().optional().describe('A simple analogy or example to help understand the concept, if applicable.'),
});

export async function exploreConcept(input: ExploreConceptInputType): Promise<ExploreConceptOutputType> {
  // The public-facing function uses types from lib/types for external contracts
  // It calls the internal Genkit flow which will validate against its own Zod schema
  return exploreConceptFlow(input as z.infer<typeof ExploreConceptInputSchema>);
}

const prompt = ai.definePrompt({
  name: 'exploreConceptPrompt',
  input: {schema: ExploreConceptInputSchema},
  output: {schema: ExploreConceptOutputSchema},
  prompt: `You are an expert educator AI. A student wants to understand a concept.
The concept is: {{{concept}}}

Your task is to:
1.  Provide a clear and concise explanation of this concept. Aim for 2-4 sentences.
2.  List 3-5 key terms that are directly related to this concept.
3.  If appropriate and helpful, provide a simple analogy or a very brief example to make the concept easier to grasp. If an analogy doesn't fit well, you can omit it.

Ensure your response is structured according to the defined output schema.
`,
});

const exploreConceptFlow = ai.defineFlow(
  {
    name: 'exploreConceptFlow',
    inputSchema: ExploreConceptInputSchema,
    outputSchema: ExploreConceptOutputSchema,
  },
  async (input: z.infer<typeof ExploreConceptInputSchema>): Promise<z.infer<typeof ExploreConceptOutputSchema>> => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a valid response for the concept exploration.");
    }
    return output;
  }
);

