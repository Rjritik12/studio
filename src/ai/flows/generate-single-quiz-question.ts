
'use server';

/**
 * @fileOverview An AI agent for generating a single KBC-style quiz question.
 *
 * - generateSingleQuizQuestion - A function that generates one quiz question.
 * - GenerateSingleQuizQuestionInput - The input type.
 * - GenerateSingleQuizQuestionOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSingleQuizQuestionInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz question.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz question.'),
  existingQuestions: z.array(z.string()).optional().describe('A list of existing questions to avoid repetition if possible.'),
});
export type GenerateSingleQuizQuestionInput = z.infer<typeof GenerateSingleQuizQuestionInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('Four possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});
export type SingleQuizQuestion = z.infer<typeof QuizQuestionSchema>;

const GenerateSingleQuizQuestionOutputSchema = z.object({
    question: QuizQuestionSchema.describe('The generated quiz question.')
});
export type GenerateSingleQuizQuestionOutput = z.infer<typeof GenerateSingleQuizQuestionOutputSchema>;


export async function generateSingleQuizQuestion(
  input: GenerateSingleQuizQuestionInput
): Promise<GenerateSingleQuizQuestionOutput> {
  return generateSingleQuizQuestionFlow(input);
}

const subjectMatterExpertTool = ai.defineTool({
  name: 'subjectMatterExpert',
  description: 'Provides accurate and detailed information on a given topic for question generation.',
  inputSchema: z.object({
    topic: z.string().describe('The specific topic to provide information on.'),
  }),
  outputSchema: z.string(),
  async handler(input) {
    // In a real application, this would fetch data from a database or external API.
    // For this example, we'll just return a placeholder.
    return `Detailed information about ${input.topic} to help generate a unique question.`;
  },
});

const prompt = ai.definePrompt({
  name: 'generateSingleQuizQuestionPrompt',
  input: {schema: GenerateSingleQuizQuestionInputSchema},
  output: {schema: GenerateSingleQuizQuestionOutputSchema},
  tools: [subjectMatterExpertTool],
  prompt: `You are an expert quiz question generator.
  Generate ONE unique quiz question on the topic of {{{topic}}}.
  The difficulty level should be {{difficulty}}.
  The question should have four options, and one of them should be the correct answer.
  Use the subjectMatterExpert tool to obtain accurate information about the topic.
  {{#if existingQuestions}}
  Avoid generating questions similar to these:
  {{#each existingQuestions}}
  - {{{this}}}
  {{/each}}
  {{/if}}
  Output the question in the specified JSON format.
  `,
});

const generateSingleQuizQuestionFlow = ai.defineFlow(
  {
    name: 'generateSingleQuizQuestionFlow',
    inputSchema: GenerateSingleQuizQuestionInputSchema,
    outputSchema: GenerateSingleQuizQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
