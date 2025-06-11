
"use server";

import { generateQuizQuestions, GenerateQuizQuestionsInput, GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";
import { tutorStudySession, TutorStudySessionInput, TutorStudySessionOutput } from "@/ai/flows/tutor-study-session";
import { getQuizQuestionHint, GetQuizQuestionHintInput, GetQuizQuestionHintOutput } from "@/ai/flows/get-quiz-question-hint";
import { generateSingleQuizQuestion, GenerateSingleQuizQuestionInput, GenerateSingleQuizQuestionOutput } from "@/ai/flows/generate-single-quiz-question";

import { z } from "zod";

const quizSetupSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1").max(15, "Max 15 questions"),
});

export async function handleQuizSetup(formData: FormData): Promise<GenerateQuizQuestionsOutput | { error: string }> {
  const rawFormData = {
    topic: formData.get("topic"),
    difficulty: formData.get("difficulty"),
    numQuestions: formData.get("numQuestions"),
  };

  const validatedFields = quizSetupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrorsToString() };
  }
  
  try {
    const quizData = await generateQuizQuestions(validatedFields.data as GenerateQuizQuestionsInput);
    if (!quizData.questions || quizData.questions.length === 0) {
      return { error: "No questions were generated. Please try different settings or topic." };
    }
    return quizData;
  } catch (e) {
    console.error("Error generating quiz questions:", e);
    return { error: "Failed to generate quiz questions. Please try again." };
  }
}


const studySessionSchema = z.object({
  notes: z.string().min(1, "Notes cannot be empty"),
  doubt: z.string().min(1, "Doubt cannot be empty"),
});

export async function handleStudySession(formData: FormData): Promise<TutorStudySessionOutput | { error: string }> {
  const rawFormData = {
    notes: formData.get("notes"),
    doubt: formData.get("doubt"),
  };

  const validatedFields = studySessionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrorsToString() };
  }

  try {
    const studyData = await tutorStudySession(validatedFields.data as TutorStudySessionInput);
    return studyData;
  } catch (e) {
    console.error("Error in AI study session:", e);
    return { error: "Failed to process study session. Please try again." };
  }
}

export async function handleGetQuizHint(input: GetQuizQuestionHintInput): Promise<GetQuizQuestionHintOutput | { error: string }> {
  try {
    const hintData = await getQuizQuestionHint(input);
    return hintData;
  } catch (e) {
    console.error("Error generating hint:", e);
    return { error: "Failed to generate hint. Please try again." };
  }
}

export async function handleFlipQuestion(input: GenerateSingleQuizQuestionInput): Promise<GenerateSingleQuizQuestionOutput | { error: string }> {
  try {
    const newQuestionData = await generateSingleQuizQuestion(input);
    if (!newQuestionData.question) {
        return { error: "Failed to generate a new question for flip." };
    }
    return newQuestionData;
  } catch (e) {
    console.error("Error flipping question:", e);
    return { error: "Failed to flip question. Please try again." };
  }
}
