
'use server';
/**
 * @fileOverview An AI agent for generating a hint for a quiz question.
 *
 * - getQuizQuestionHint - A function that generates a hint.
 * - GetQuizQuestionHintInput - The input type for the getQuizQuestionHint function.
 * - GetQuizQuestionHintOutput - The return type for the getQuizQuestionHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetQuizQuestionHintInputSchema = z.object({
  question: z.string().describe('The quiz question for which a hint is needed.'),
  options: z.array(z.string()).describe('The multiple-choice options for the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});
export type GetQuizQuestionHintInput = z.infer<typeof GetQuizQuestionHintInputSchema>;

const GetQuizQuestionHintOutputSchema = z.object({
  hint: z.string().describe('A subtle hint for the quiz question.'),
});
export type GetQuizQuestionHintOutput = z.infer<typeof GetQuizQuestionHintOutputSchema>;

export async function getQuizQuestionHint(
  input: GetQuizQuestionHintInput
): Promise<GetQuizQuestionHintOutput> {
  return getQuizQuestionHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getQuizQuestionHintPrompt',
  input: {schema: GetQuizQuestionHintInputSchema},
  output: {schema: GetQuizQuestionHintOutputSchema},
  prompt: `You are a helpful quiz assistant.
Given the following quiz question, options, and the correct answer, provide a subtle hint that guides the user towards the correct answer without explicitly revealing it. The hint should make the user think or recall relevant information.

Question: {{{question}}}
Options:
{{#each options}}
- {{{this}}}
{{/each}}
Correct Answer: {{{correctAnswer}}}

Generate a single, concise hint.
`,
});

const getQuizQuestionHintFlow = ai.defineFlow(
  {
    name: 'getQuizQuestionHintFlow',
    inputSchema: GetQuizQuestionHintInputSchema,
    outputSchema: GetQuizQuestionHintOutputSchema,
  },
  async (input: z.infer<typeof GetQuizQuestionHintInputSchema>): Promise<z.infer<typeof GetQuizQuestionHintOutputSchema>> => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a hint for the quiz question.");
    }
    return output;
  }
);
