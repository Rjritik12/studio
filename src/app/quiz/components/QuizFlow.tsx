
"use client";

import { useState } from 'react';
import { QuizSetup } from './QuizSetup';
import { QuizGame } from './QuizGame';
import type { QuizQuestion } from '@/lib/types';
import { handleQuizSetup } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles } from 'lucide-react'; // Added Sparkles

type QuizStage = 'setup' | 'playing' | 'results';

export function QuizFlow() {
  const [stage, setStage] = useState<QuizStage>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    const result = await handleQuizSetup(formData);
    setIsLoading(false);

    if ('error' in result) {
      setError(result.error);
    } else if (result.questions && result.questions.length > 0) {
      setQuestions(result.questions);
      setStage('playing');
    } else {
      setError("No questions were generated. Please try different settings.");
    }
  };

  const handleGameEnd = (score: number) => {
    setFinalScore(score);
    setStage('results');
  };

  const resetQuiz = () => {
    setStage('setup');
    setQuestions([]);
    setFinalScore(0);
    setError(null);
  };

  if (stage === 'setup') {
    return <QuizSetup onQuizSetup={startQuiz} isLoading={isLoading} error={error} />;
  }

  if (stage === 'playing') {
    return <QuizGame questions={questions} onGameEnd={handleGameEnd} />;
  }

  if (stage === 'results') {
    const isWinner = finalScore === questions.length && questions.length > 0;
    return (
      <Card className={`w-full max-w-md mx-auto text-center p-6 shadow-xl ${isWinner ? 'border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600' : ''}`}>
        <CardHeader>
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${isWinner ? 'bg-yellow-400/20 dark:bg-yellow-500/20' : 'bg-primary/10'}`}>
            {isWinner ? <Sparkles className="h-10 w-10 text-yellow-500 dark:text-yellow-400" /> : <Trophy className="h-10 w-10 text-primary" />}
          </div>
          <CardTitle className={`font-headline text-3xl ${isWinner ? 'text-yellow-600 dark:text-yellow-400' : 'text-primary'}`}>
            {isWinner ? "Congratulations! You Won!" : "Quiz Complete!"}
          </CardTitle>
          <CardDescription className={`text-lg ${isWinner ? 'text-yellow-700/90 dark:text-yellow-300/90' : 'text-foreground/80'}`}>
            {isWinner ? "You've answered all questions correctly!" : "You've reached the end of the challenge."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground mb-2">Your Final Score:</p>
          <p className={`text-5xl font-bold mb-6 ${isWinner ? 'text-yellow-700 dark:text-yellow-400' : 'text-accent'}`}>
            {finalScore} <span className={`text-3xl ${isWinner ? 'text-yellow-600/80 dark:text-yellow-300/80' : 'text-muted-foreground' }`}>/ {questions.length}</span>
          </p>
          <Button 
            onClick={resetQuiz} 
            className={`w-full ${isWinner ? 'bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null; // Should not happen
}
