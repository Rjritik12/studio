
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
  imageDataUri: z.string().optional().describe("An optional image provided by the student, as a data URI (e.g., 'data:image/png;base64,...'). This image might relate to their notes or their doubt."),
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

{{#if imageDataUri}}
The student also provided an image related to their doubt or notes:
{{media url=imageDataUri}}
Please consider this image in your response and analysis.
{{/if}}

Your task is to:
1.  Address the student's doubt clearly and concisely, taking the image into account if provided.
2.  Analyze the provided notes (and image, if any). Based on their content and nature, decide if creating flashcards would be an effective study strategy.
    - If flashcards are recommended and the notes/image are suitable, generate them as a JSON array assigned to the 'flashcards' field. Each element in the array should be an object with a 'question' key (string) and an 'answer' key (string). For example: "flashcards": [{"question": "What is photosynthesis?", "answer": "The process by which green plants use sunlight, water, and carbon dioxide to create their own food."}]. State in your flashcardRecommendation that they were generated.
    - If flashcards are not recommended or the notes/image are unsuitable for them, explain why in the flashcardRecommendation and do not provide flashcards (the 'flashcards' field should be omitted or an empty array).
3.  If the notes (and image, if any) are suitable and cover distinct concepts, generate 2-3 multiple-choice practice questions based on the material. Each question should have four options and a correct answer. If notes/image are too brief or unsuitable for practice questions, do not generate them.
`,
});

const tutorStudySessionFlow = ai.defineFlow(
  {
    name: 'tutorStudySessionFlow',
    inputSchema: TutorStudySessionInputSchema,
    outputSchema: TutorStudySessionOutputSchema,
  },
  async (input: z.infer<typeof TutorStudySessionInputSchema>): Promise<z.infer<typeof TutorStudySessionOutputSchema>> => {
    const {output} = await tutorPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate a valid response matching the output schema.");
    }
    return output;
  }
);
