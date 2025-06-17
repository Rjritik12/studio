
"use server";

import { generateQuizQuestions, GenerateQuizQuestionsInput, GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";
import { tutorStudySession, TutorStudySessionInput, TutorStudySessionOutput } from "@/ai/flows/tutor-study-session"; 
import { getQuizQuestionHint, GetQuizQuestionHintInput, GetQuizQuestionHintOutput } from "@/ai/flows/get-quiz-question-hint";
import { generateSingleQuizQuestion, GenerateSingleQuizQuestionInput, GenerateSingleQuizQuestionOutput } from "@/ai/flows/generate-single-quiz-question";
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
    // Return topic and difficulty along with questions for context in UI
    return { ...quizData, topic: quizInput.topic, difficulty: quizInput.difficulty };
  } catch (e) {
    console.error("Error generating quiz questions:", e);
    return { error: "Failed to generate quiz questions. Please try again." };
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
    let errorMessage = "Failed to process study session. Please try again.";
    if (e instanceof Error) {
        errorMessage = e.message;
    } else if (typeof e === 'string') {
        errorMessage = e;
    }
    return { error: errorMessage };
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

// Server action for Concept Explorer
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
    // The Genkit flow itself uses Zod for input validation based on ExploreConceptInputSchema,
    // so we are passing the validated client-side data.
    const result = await exploreConcept(validatedFields.data as ExploreConceptInput);
    return result;
  } catch (e) {
    console.error("Error exploring concept:", e);
    let errorMessage = "Failed to explore concept. Please try again.";
     if (e instanceof Error) {
        errorMessage = e.message;
    } else if (typeof e === 'string') {
        errorMessage = e;
    }
    return { error: errorMessage };
  }
}


const sectionQuizSchema = z.object({
  topic: z.string().min(1, "Topic is required for section quiz"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  numQuestions: z.coerce.number().min(1).max(5), // Mini-quiz, e.g., 3-5 questions
});
export type HandleGenerateSectionQuizInput = z.infer<typeof sectionQuizSchema>;

export async function handleGenerateSectionQuiz(input: HandleGenerateSectionQuizInput): Promise<{ questions: QuizQuestion[] } | { error: string }> {
  const validatedFields = sectionQuizSchema.safeParse(input);

  if (!validatedFields.success) {
    return { error: "Invalid input for section quiz generation." };
  }

  try {
    const quizInput = validatedFields.data as GenerateQuizQuestionsInput; // Re-use same input type for Genkit flow
    const quizData = await generateQuizQuestions(quizInput);
    if (!quizData.questions || quizData.questions.length === 0) {
      return { error: `No questions were generated for the topic: "${quizInput.topic}". Please try a broader topic or check AI capabilities.` };
    }
    return { questions: quizData.questions };
  } catch (e) {
    console.error("Error generating section quiz questions:", e);
    return { error: "Failed to generate section quiz questions. Please try again." };
  }
}
