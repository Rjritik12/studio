
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import type { TutorStudySessionOutput } from '@/ai/flows/tutor-study-session';
import type { GetQuizQuestionHintInput, GetQuizQuestionHintOutput } from '@/ai/flows/get-quiz-question-hint';
import type { GenerateSingleQuizQuestionInput, GenerateSingleQuizQuestionOutput as SingleQuestionOutput, SingleQuizQuestion as NewSingleQuizQuestion } from '@/ai/flows/generate-single-quiz-question';


export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
}

export type GeneratedQuizData = GenerateQuizQuestionsOutput;

export interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'note' | 'question' | 'meme' | 'link' | 'image';
  likes: number;
  commentsCount: number;
  createdAt: number;
  expiresAt: number;
  imageUrl?: string;
  linkUrl?: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// TutorStudySessionOutput from Genkit will implicitly define the structure of StudyRoomData
export type StudyRoomData = TutorStudySessionOutput;


export type Lifeline = "50-50" | "Flip" | "AI_Hint" | "Audience_Poll";


export type HintInput = GetQuizQuestionHintInput;
export type HintOutput = GetQuizQuestionHintOutput;
export type FlipQuestionInput = GenerateSingleQuizQuestionInput;
export type FlipQuestionOutput = SingleQuestionOutput;
export type FlippedQuizQuestion = NewSingleQuizQuestion;

// Types for Concept Explorer
export interface ExploreConceptInput {
  concept: string;
}

export interface ExploreConceptOutput {
  explanation: string;
  relatedTerms: string[];
  analogy?: string;
}

// Types for Mock Study Groups
export interface MockStudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avatarUrl: string;
  createdBy: string; // User who created it (mock)
}

// Types for Learning Modules
export interface ModuleSection {
  id: string;
  title: string;
  topicForAI: string; // Specific topic string for AI question generation
  theory: string; // Placeholder for theory content
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard'; // Default difficulty for practice questions
  icon?: string; // Optional: Lucide icon name
  sections: ModuleSection[];
  dataAiHint?: string; // For placeholder image on module listing
}

