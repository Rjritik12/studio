
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/tutor-study-session.ts';
import '@/ai/flows/get-quiz-question-hint.ts';
import '@/ai/flows/generate-single-quiz-question.ts';
import '@/ai/flows/solve-image-problem-flow.ts'; // Added new flow
