
"use server";

import { generateQuizQuestions, type GenerateQuizQuestionsInput, type GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";
import { tutorStudySession, type TutorStudySessionInput, type TutorStudySessionOutput } from "@/ai/flows/tutor-study-session";
import { getQuizQuestionHint, type GetQuizQuestionHintInput, type GetQuizQuestionHintOutput } from "@/ai/flows/get-quiz-question-hint";
import { generateSingleQuizQuestion, type GenerateSingleQuizQuestionInput, type GenerateSingleQuizQuestionOutput } from "@/ai/flows/generate-single-quiz-question";
import { exploreConcept } from "@/ai/flows/explore-concept-flow";
import type { ExploreConceptInput, ExploreConceptOutput, QuizQuestion } from "@/lib/types";


import { z } from "zod";

const quizSetupSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  numQuestions: z.coerce.number().min(1, "Number of questions must be at least 1").max(15, "Max 15 questions"),
});

export interface HandleQuizSetupResult extends GenerateQuizQuestionsOutput {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return defaultMessage;
}


export async function handleQuizSetup(formData: FormData): Promise<HandleQuizSetupResult | { error: string }> {
  const rawFormData = {
    topic: formData.get("topic"),
    difficulty: formData.get("difficulty"),
    numQuestions: formData.get("numQuestions"),
  };

  const validatedFields = quizSetupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const flatErrors = validatedFields.error.flatten();
    const errorMessages: string[] = [];
    if (flatErrors.formErrors.length) {
      errorMessages.push(...flatErrors.formErrors);
    }
    for (const field in flatErrors.fieldErrors) {
      const fieldErrors = flatErrors.fieldErrors[field as keyof typeof flatErrors.fieldErrors];
      if (fieldErrors) {
        errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
      }
    }
    return { error: errorMessages.join('; ') || "Validation failed. Please check your inputs." };
  }

  try {
    const quizInput = validatedFields.data as GenerateQuizQuestionsInput;
    const quizData = await generateQuizQuestions(quizInput);
    if (!quizData.questions || quizData.questions.length === 0) {
      return { error: "No questions were generated. Please try different settings or topic." };
    }
    return { ...quizData, topic: quizInput.topic, difficulty: quizInput.difficulty };
  } catch (e) {
    console.error("Error generating quiz questions:", e);
    return { error: getErrorMessage(e, "Failed to generate quiz questions. Please try again.") };
  }
}


const studySessionSchema = z.object({
  notes: z.string(),
  doubt: z.string().min(1, "Doubt cannot be empty"),
  imageDataUri: z.string().optional(),
});

export async function handleStudySession(formData: FormData): Promise<TutorStudySessionOutput | { error: string }> {
  const rawFormData = {
    notes: formData.get("notes"),
    doubt: formData.get("doubt"),
    imageDataUri: formData.get("imageDataUri") as string | undefined,
  };

  const validatedFields = studySessionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const flatErrors = validatedFields.error.flatten();
    const errorMessages: string[] = [];
    if (flatErrors.formErrors.length) {
      errorMessages.push(...flatErrors.formErrors);
    }
    for (const field in flatErrors.fieldErrors) {
      const fieldErrors = flatErrors.fieldErrors[field as keyof typeof flatErrors.fieldErrors];
      if (fieldErrors) {
        errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
      }
    }
    return { error: errorMessages.join('; ') || "Validation failed. Please check your inputs." };
  }

  try {
    const inputForTutor: TutorStudySessionInput = {
      notes: validatedFields.data.notes,
      doubt: validatedFields.data.doubt,
    };
    if (validatedFields.data.imageDataUri) {
      inputForTutor.imageDataUri = validatedFields.data.imageDataUri;
    }

    const studyData = await tutorStudySession(inputForTutor);
    return studyData;
  } catch (e) {
    console.error("Error in AI study session:", e);
    return { error: getErrorMessage(e, "Failed to process study session. Please try again.") };
  }
}

export async function handleGetQuizHint(input: GetQuizQuestionHintInput): Promise<GetQuizQuestionHintOutput | { error: string }> {
  try {
    const hintData = await getQuizQuestionHint(input);
    return hintData;
  } catch (e) {
    console.error("Error generating hint:", e);
    return { error: getErrorMessage(e, "Failed to generate hint. Please try again.") };
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
    return { error: getErrorMessage(e, "Failed to flip question. Please try again.") };
  }
}

const exploreConceptClientSchema = z.object({
  concept: z.string().min(1, "Concept cannot be empty."),
});

export async function handleExploreConcept(formData: FormData): Promise<ExploreConceptOutput | { error: string }> {
  const rawFormData = {
    concept: formData.get("concept"),
  };

  const validatedFields = exploreConceptClientSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.concept?.join(", ") || "Invalid concept input." };
  }

  try {
    const result = await exploreConcept(validatedFields.data as ExploreConceptInput);
    return result;
  } catch (e) {
    console.error("Error exploring concept:", e);
    return { error: getErrorMessage(e, "Failed to explore concept. Please try again.") };
  }
}


const sectionQuizSchema = z.object({
  topic: z.string().min(1, "Topic is required for section quiz"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  numQuestions: z.coerce.number().min(1).max(5),
});
export type HandleGenerateSectionQuizInput = z.infer<typeof sectionQuizSchema>;

export async function handleGenerateSectionQuiz(input: HandleGenerateSectionQuizInput): Promise<{ questions: QuizQuestion[] } | { error: string }> {
  const validatedFields = sectionQuizSchema.safeParse(input);

  if (!validatedFields.success) {
    return { error: "Invalid input for section quiz generation." };
  }

  try {
    const quizInput = validatedFields.data as GenerateQuizQuestionsInput;
    const quizData = await generateQuizQuestions(quizInput);
    if (!quizData.questions || quizData.questions.length === 0) {
      return { error: `No questions were generated for the topic: "${quizInput.topic}". Please try a broader topic or check AI capabilities.` };
    }
    return { questions: quizData.questions };
  } catch (e) {
    console.error("Error generating section quiz questions:", e);
    return { error: getErrorMessage(e, "Failed to generate section quiz questions. Please try again.") };
  }
}
