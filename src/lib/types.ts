import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import type { TutorStudySessionOutput } from '@/ai/flows/tutor-study-session';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
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
