'use server';

/**
 * @fileOverview An AI agent for generating KBC-style quiz questions.
 *
 * - generateQuizQuestions - A function that generates quiz questions.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz questions.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz questions.'),
  numQuestions: z.number().describe('The number of quiz questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('The generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const subjectMatterExpertTool = ai.defineTool({
  name: 'subjectMatterExpert',
  description: 'Provides accurate and detailed information on a given topic.',
  inputSchema: z.object({
    topic: z.string().describe('The specific topic to provide information on.'),
  }),
  outputSchema: z.string(),
  async handler(input) {
    // In a real application, this would fetch data from a database or external API.
    // For this example, we'll just return a placeholder.
    return `Detailed information about ${input.topic} goes here.`;
  },
});

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  tools: [subjectMatterExpertTool],
  prompt: `You are an expert quiz question generator.

  Generate {{numQuestions}} quiz questions on the topic of {{{topic}}}. The difficulty level should be {{difficulty}}.

  Each question should have four options, and one of them should be the correct answer.

  Use the subjectMatterExpert tool to obtain accurate information about the topic.

  Output the questions in the following JSON format:
  {
    "questions": [
      {
        "question": "Question 1",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A"
      },
      {
        "question": "Question 2",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option B"
      }
    ]
  }
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
