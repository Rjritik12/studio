
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
    .describe('The student’s notes that need to be converted to flashcards or used for practice questions.'),
  doubt: z.string().describe('A specific doubt or question from the student.'),
});
export type TutorStudySessionInput = z.infer<typeof TutorStudySessionInputSchema>;

const PracticeQuestionSchema = z.object({
  question: z.string().describe('The practice question.'),
  options: z.array(z.string()).length(4).describe('Four possible answers to the practice question.'),
  correctAnswer: z.string().describe('The correct answer to the practice question.'),
});

const FlashcardSchema = z.object({
  question: z.string().describe("The question for the flashcard."),
  answer: z.string().describe("The answer for the flashcard.")
});

const TutorStudySessionOutputSchema = z.object({
  answer: z.string().describe('The answer to the student’s doubt.'),
  flashcardRecommendation: z.string().describe('Reasoning on whether flashcards are helpful and if they were generated. Example: "Flashcards were generated as these notes contain many key terms." or "Flashcards might not be most effective here; consider summarizing instead."'),
  flashcards: z.array(FlashcardSchema).optional().describe('The flashcards generated from the student’s notes, if deemed suitable by the AI. Each item is an object with a question and an answer.'),
  practiceQuestions: z.array(PracticeQuestionSchema).optional().describe('2-3 multiple-choice practice questions generated from the notes, if the notes are suitable for such questions.'),
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
"{{{notes}}}"

Your task is to:
1.  Address the student's doubt clearly and concisely.
2.  Analyze the provided notes. Based on their content and nature, decide if creating flashcards would be an effective study strategy.
    - If flashcards are recommended and the notes are suitable, generate them as a JSON array assigned to the 'flashcards' field. Each element in the array should be an object with a 'question' key (string) and an 'answer' key (string). For example: "flashcards": [{"question": "What is photosynthesis?", "answer": "The process by which green plants use sunlight, water, and carbon dioxide to create their own food."}]. State in your flashcardRecommendation that they were generated.
    - If flashcards are not recommended or the notes are unsuitable for them, explain why in the flashcardRecommendation and do not provide flashcards (the 'flashcards' field should be omitted or an empty array).
3.  If the notes are suitable and cover distinct concepts, generate 2-3 multiple-choice practice questions based on the material in the notes. Each question should have four options and a correct answer. If notes are too brief or unsuitable for practice questions, do not generate them.
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
