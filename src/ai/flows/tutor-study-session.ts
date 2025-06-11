// src/ai/flows/tutor-study-session.ts
'use server';

/**
 * @fileOverview An AI study session agent where Gemini acts as a tutor.
 *
 * - tutorStudySession - A function that initiates and manages the AI study session.
 * - TutorStudySessionInput - The input type for the tutorStudySession function.
 * - TutorStudySessionOutput - The return type for the tutorStudySession function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TutorStudySessionInputSchema = z.object({
  notes: z
    .string()
    .describe('The student’s notes that need to be converted to flashcards.'),
  doubt: z.string().describe('A specific doubt or question from the student.'),
});
export type TutorStudySessionInput = z.infer<typeof TutorStudySessionInputSchema>;

const TutorStudySessionOutputSchema = z.object({
  answer: z.string().describe('The answer to the student’s doubt.'),
  flashcards: z.string().describe('The flashcards generated from the student’s notes.'),
});
export type TutorStudySessionOutput = z.infer<typeof TutorStudySessionOutputSchema>;

export async function tutorStudySession(input: TutorStudySessionInput): Promise<TutorStudySessionOutput> {
  return tutorStudySessionFlow(input);
}

const tutorPrompt = ai.definePrompt({
  name: 'tutorPrompt',
  input: {schema: TutorStudySessionInputSchema},
  output: {schema: TutorStudySessionOutputSchema},
  prompt: `You are an AI tutor helping a student with their studies.

The student has the following doubt: {{{doubt}}}

Here are the student's notes:
{{notes}}

Answer the student's doubt clearly and concisely. Also, convert the student's notes into a set of flashcards that will help them study effectively. The flashcards should be in a question and answer format.
`,
});

const tutorStudySessionFlow = ai.defineFlow(
  {
    name: 'tutorStudySessionFlow',
    inputSchema: TutorStudySessionInputSchema,
    outputSchema: TutorStudySessionOutputSchema,
  },
  async input => {
    const {output} = await tutorPrompt(input);
    return output!;
  }
);
