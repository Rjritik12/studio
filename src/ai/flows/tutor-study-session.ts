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
  flashcardRecommendation: z.string().describe('Reasoning on whether flashcards are helpful for the provided notes and why.'),
  flashcards: z.string().optional().describe('The flashcards generated from the student’s notes, if recommended. Formatted as Q: ... A: ... pairs, separated by double newlines.'),
});
export type TutorStudySessionOutput = z.infer<typeof TutorStudySessionOutputSchema>;

export async function tutorStudySession(input: TutorStudySessionInput): Promise<TutorStudySessionOutput> {
  return tutorStudySessionFlow(input);
}

const tutorPrompt = ai.definePrompt({
  name: 'tutorPrompt',
  input: {schema: TutorStudySessionInputSchema},
  output: {schema: TutorStudySessionOutputSchema},
  prompt: `You are an AI tutor.
The student has the following doubt:
"{{{doubt}}}"

Here are the student's notes:
"{{notes}}"

Your task is to:
1.  Address the student's doubt clearly and concisely.
2.  Analyze the provided notes. Based on their content and nature, decide if creating flashcards would be an effective study strategy for this material. Provide a clear recommendation and explain your reasoning (e.g., "Flashcards are recommended because these notes contain many key terms and definitions." or "Flashcards might not be the most effective for these notes as they are primarily narrative; consider summarizing key points instead.").
3.  If flashcards are recommended, generate them from the notes. Each flashcard should be in a "Q: [Question]" and "A: [Answer]" format. Separate each flashcard pair with two newlines (\n\n). If not recommended, do not provide flashcards.
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

