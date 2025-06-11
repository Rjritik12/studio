"use client";

import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion, Lifeline } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { LifelineButton } from './LifelineButton';
import { cn } from '@/lib/utils';

interface QuizGameProps {
  questions: QuizQuestion[];
  onGameEnd: (score: number) => void;
}

const TOTAL_QUESTIONS_LADDER = 15;
const TIME_PER_QUESTION = 30; // seconds

export function QuizGame({ questions, onGameEnd }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [gameOver, setGameOver] = useState(false);
  
  const initialLifelines = {
    "50-50": { used: false, available: true },
    "Flip": { used: false, available: true },
    "AI_Hint": { used: false, available: true },
    "Audience_Poll": { used: false, available: true },
  };
  const [lifelines, setLifelines] = useState(initialLifelines);
  const [displayedOptions, setDisplayedOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion) {
      setDisplayedOptions(currentQuestion.options);
    }
  }, [currentQuestion]);
  
  useEffect(() => {
    if (gameOver) return;

    if (timeLeft === 0 && !selectedAnswer) {
      handleAnswer(null); // Time's up
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, selectedAnswer]);

  const resetForNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setTimeLeft(TIME_PER_QUESTION);
    if (questions[currentQuestionIndex + 1]) {
       setDisplayedOptions(questions[currentQuestionIndex + 1].options);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (answer: string | null) => {
    if (selectedAnswer || gameOver) return;

    setSelectedAnswer(answer || "Time's up");
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
      setGameOver(true); // Game over on incorrect answer
    }

    setTimeout(() => {
      if (isCorrect && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        resetForNextQuestion();
      } else {
        setGameOver(true);
        onGameEnd(score + (isCorrect ? 1 : 0));
      }
    }, 2000); // Show feedback for 2 seconds
  };

  const handleLifeline = (type: Lifeline) => {
    if (lifelines[type].used || gameOver) return;

    setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true }}));

    switch (type) {
      case '50-50':
        // eslint-disable-next-line no-case-declarations
        const correctAnswer = currentQuestion.correctAnswer;
        // eslint-disable-next-line no-case-declarations
        let wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
        // eslint-disable-next-line no-case-declarations
        const optionToKeep = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        setDisplayedOptions([correctAnswer, optionToKeep].sort(() => Math.random() - 0.5));
        break;
      // Placeholder for other lifelines
      case 'Flip':
      case 'AI_Hint':
      case 'Audience_Poll':
        alert(`${type} lifeline used ( fonctionnalité en cours de développement ).`);
        break;
    }
  };

  if (gameOver && !answerStatus) { // Handles game over if questions run out before incorrect answer
    return (
      <Card className="text-center p-8 shadow-lg">
        <CardTitle className="font-headline text-3xl mb-4 text-primary">Game Over!</CardTitle>
        <CardDescription className="text-xl mb-6">Your final score is: {score} / {questions.length}</CardDescription>
        <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90 text-primary-foreground">Play Again</Button>
      </Card>
    );
  }
  
  if (!currentQuestion) {
     // This case should ideally be handled by gameOver logic, but as a fallback:
    return (
      <Card className="text-center p-8">
        <CardTitle className="font-headline text-2xl">Loading Quiz...</CardTitle>
        <CardDescription>Preparing your challenge.</CardDescription>
      </Card>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS_LADDER) * 100;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-headline text-xl md:text-2xl">Question {currentQuestionIndex + 1} / {questions.length}</CardTitle>
          <div className="flex items-center text-lg font-semibold text-primary">
            <Clock className="mr-2 h-6 w-6" /> {timeLeft}s
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg md:text-xl text-foreground/90 mb-6 min-h-[60px]">{currentQuestion.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "p-4 h-auto text-base justify-start text-left whitespace-normal break-words",
                  "border-2 rounded-lg transition-all duration-200 ease-in-out",
                  selectedAnswer === option && answerStatus === 'correct' && 'bg-green-500 border-green-700 text-white hover:bg-green-600',
                  selectedAnswer === option && answerStatus === 'incorrect' && 'bg-red-500 border-red-700 text-white hover:bg-red-600',
                  selectedAnswer && selectedAnswer !== option && option === currentQuestion.correctAnswer && 'bg-green-200 border-green-400 text-green-800', // Show correct if wrong one selected
                  !selectedAnswer && 'hover:bg-primary/10 hover:border-primary',
                  selectedAnswer && 'cursor-not-allowed'
                )}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer || gameOver}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
        {answerStatus && (
          <CardFooter className="mt-4">
            {answerStatus === 'correct' && <p className="text-green-600 font-semibold flex items-center"><CheckCircle className="mr-2"/>Correct!</p>}
            {answerStatus === 'incorrect' && <p className="text-red-600 font-semibold flex items-center"><XCircle className="mr-2"/>Incorrect! Correct answer: {currentQuestion.correctAnswer}</p>}
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">Lifelines</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(lifelines) as Lifeline[]).map(type => (
            <LifelineButton 
              key={type} 
              type={type} 
              onClick={handleLifeline} 
              disabled={!!selectedAnswer || gameOver}
              used={lifelines[type].used} 
            />
          ))}
        </CardContent>
      </Card>
      
      <div>
        <Label className="text-sm text-muted-foreground">KBC Ladder Progress (out of {TOTAL_QUESTIONS_LADDER} potential questions)</Label>
        <Progress value={progressPercentage} className="w-full h-3 mt-1" />
        <p className="text-xs text-right text-muted-foreground mt-1">Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS_LADDER}</p>
      </div>

      {gameOver && answerStatus && ( // Show this block when an answer has been processed and game is over
        <Card className="text-center p-6 mt-6 bg-destructive/10 border-destructive">
          <CardTitle className="font-headline text-2xl mb-3 text-destructive flex items-center justify-center"><AlertCircle className="mr-2" />Game Over!</CardTitle>
          <CardDescription className="text-lg mb-4">Your final score: {score} / {questions.length}</CardDescription>
          <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90 text-primary-foreground">Play Again</Button>
        </Card>
      )}
    </div>
  );
}
