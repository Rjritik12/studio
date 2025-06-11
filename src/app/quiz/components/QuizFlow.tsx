"use client";

import { useState } from 'react';
import { QuizSetup } from './QuizSetup';
import { QuizGame } from './QuizGame';
import type { QuizQuestion } from '@/lib/types';
import { handleQuizSetup } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

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
    return (
      <Card className="w-full max-w-md mx-auto text-center p-6 shadow-xl">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            You've reached the end of the challenge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground mb-2">Your Final Score:</p>
          <p className="text-5xl font-bold text-accent mb-6">
            {finalScore} <span className="text-3xl text-muted-foreground">/ {questions.length}</span>
          </p>
          <Button onClick={resetQuiz} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null; // Should not happen
}
