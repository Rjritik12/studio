
'use server';
/**
 * @fileOverview An AI agent for solving problems from images.
 *
 * - solveImageProblem - A function that takes an image and description to provide a solution.
 * - SolveImageProblemInput - The input type for the solveImageProblem function.
 * - SolveImageProblemOutput - The return type for the solveImageProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveImageProblemInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('An optional description or specific question about the problem in the image.'),
});
export type SolveImageProblemInput = z.infer<typeof SolveImageProblemInputSchema>;

const SolveImageProblemOutputSchema = z.object({
  solution: z.string().describe('A step-by-step solution, explanation, or answer for the problem identified in the image and accompanying description.'),
});
export type SolveImageProblemOutput = z.infer<typeof SolveImageProblemOutputSchema>;

export async function solveImageProblem(input: SolveImageProblemInput): Promise<SolveImageProblemOutput> {
  return solveImageProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveImageProblemPrompt',
  input: {schema: SolveImageProblemInputSchema},
  output: {schema: SolveImageProblemOutputSchema},
  prompt: `You are an expert AI tutor and problem solver. A student has provided an image of a problem and an optional description.
Your task is to analyze the image and the description to understand the problem and provide a clear, helpful, and step-by-step solution or a detailed explanation.

Image of the problem:
{{media url=imageDataUri}}

{{#if description}}
Student's Description/Question:
"{{{description}}}"
{{/if}}

Carefully examine the image. If the image is unclear, unreadable, or does not seem to contain a solvable problem, politely state that and suggest providing a clearer image or more context.
If the problem is identifiable and solvable:
1. Identify the core problem or question(s) presented.
2. Break down the solution into logical steps if applicable.
3. Explain the concepts or methods used to arrive at the solution.
4. Ensure your explanation is easy to understand for a student.
5. If multiple interpretations are possible, address the most likely one or ask for clarification.

Provide the solution directly.
`,
});

const solveImageProblemFlow = ai.defineFlow(
  {
    name: 'solveImageProblemFlow',
    inputSchema: SolveImageProblemInputSchema,
    outputSchema: SolveImageProblemOutputSchema,
  },
  async input => {
    // Ensure the default Gemini Flash model is used if it's capable, or specify gemini-pro-vision for older genkit versions if needed.
    // The global `ai` object in genkit.ts is configured with gemini-2.0-flash which supports multimodal input.
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a valid solution matching the output schema.");
    }
    return output;
  }
);

