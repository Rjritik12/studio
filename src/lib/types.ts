
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import type { TutorStudySessionOutput } from '@/ai/flows/tutor-study-session';
import type { GetQuizQuestionHintInput, GetQuizQuestionHintOutput } from '@/ai/flows/get-quiz-question-hint';
import type { GenerateSingleQuizQuestionInput, GenerateSingleQuizQuestionOutput as SingleQuestionOutput, SingleQuizQuestion as NewSingleQuizQuestion } from '@/ai/flows/generate-single-quiz-question';


export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty?: 'easy' | 'medium' | 'hard'; // Optional: if we want to track per question
  topic?: string; // Optional: if we want to track per question
}

export type GeneratedQuizData = GenerateQuizQuestionsOutput;

export interface Post {
  id: string;
  userName: string;
  userAvatar: string; // URL for placeholder
  content: string;
  type: 'note' | 'question' | 'meme' | 'link' | 'image';
  likes: number;
  commentsCount: number;
  createdAt: number; // timestamp
  expiresAt: number; // timestamp for ephemeral nature
  imageUrl?: string; // Optional image for post
}

export interface Flashcard {
  question: string;
  answer: string;
}

export type StudyRoomData = TutorStudySessionOutput;

// For KBC Game Lifelines
export type Lifeline = "50-50" | "Flip" | "AI_Hint" | "Audience_Poll";

// Types for new AI flows related to lifelines
export type HintInput = GetQuizQuestionHintInput;
export type HintOutput = GetQuizQuestionHintOutput;
export type FlipQuestionInput = GenerateSingleQuizQuestionInput;
export type FlipQuestionOutput = SingleQuestionOutput;
export type FlippedQuizQuestion = NewSingleQuizQuestion;
