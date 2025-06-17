
"use client";

import { useState, type FormEvent } from 'react';
import type { ModuleSection, QuizQuestion, GenerateQuizQuestionsInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, BookText, CheckCircle, XCircle, SigmaSquare, Brain, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { handleGenerateSectionQuiz } from '@/lib/actions'; // New action
import { Progress } from '@/components/ui/progress'; // For quiz progress

interface ModuleSectionDisplayProps {
  section: ModuleSection;
  moduleDifficulty: 'easy' | 'medium' | 'hard';
}

const NUM_MINI_QUIZ_QUESTIONS = 3; // Number of questions for the mini-quiz

export function ModuleSectionDisplay({ section, moduleDifficulty }: ModuleSectionDisplayProps) {
  // State for the mini-quiz
  const [miniQuizQuestions, setMiniQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentMiniQuizQuestionIndex, setCurrentMiniQuizQuestionIndex] = useState(0);
  const [miniQuizSelectedAnswers, setMiniQuizSelectedAnswers] = useState<Record<number, string | null>>({});
  const [miniQuizAnswerStatuses, setMiniQuizAnswerStatuses] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const [miniQuizScore, setMiniQuizScore] = useState(0);
  const [miniQuizStage, setMiniQuizStage] = useState<'idle' | 'loading' | 'playing' | 'results'>('idle');
  const [errorMiniQuiz, setErrorMiniQuiz] = useState<string | null>(null);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);


  const startMiniQuiz = async () => {
    setMiniQuizStage('loading');
    setErrorMiniQuiz(null);
    setMiniQuizQuestions(null);
    setCurrentMiniQuizQuestionIndex(0);
    setMiniQuizSelectedAnswers({});
    setMiniQuizAnswerStatuses({});
    setMiniQuizScore(0);
    setCurrentQuestionAnswered(false);

    try {
      const result = await handleGenerateSectionQuiz({
        topic: section.topicForAI,
        difficulty: moduleDifficulty,
        numQuestions: NUM_MINI_QUIZ_QUESTIONS,
      });

      if ('error' in result || !result.questions || result.questions.length === 0) {
        setErrorMiniQuiz(result.error || "Failed to generate mini-quiz questions. Please try again later.");
        setMiniQuizStage('idle');
      } else {
        setMiniQuizQuestions(result.questions);
        setMiniQuizStage('playing');
      }
    } catch (e) {
      console.error("Error starting mini-quiz:", e);
      setErrorMiniQuiz("An unexpected error occurred while fetching questions for the mini-quiz.");
      setMiniQuizStage('idle');
    }
  };

  const handleMiniQuizAnswerSelection = (value: string) => {
    if (currentQuestionAnswered) return;
    setMiniQuizSelectedAnswers(prev => ({ ...prev, [currentMiniQuizQuestionIndex]: value }));
  };
  
  const submitMiniQuizAnswer = () => {
    if (!miniQuizQuestions || currentQuestionAnswered) return;
    const currentQuestion = miniQuizQuestions[currentMiniQuizQuestionIndex];
    const selectedAnswer = miniQuizSelectedAnswers[currentMiniQuizQuestionIndex];

    if (!selectedAnswer) {
      // Optionally, prompt user to select an answer
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setMiniQuizAnswerStatuses(prev => ({ ...prev, [currentMiniQuizQuestionIndex]: isCorrect ? 'correct' : 'incorrect' }));
    if (isCorrect) {
      setMiniQuizScore(prevScore => prevScore + 1);
    }
    setCurrentQuestionAnswered(true);
  };

  const goToNextMiniQuizQuestion = () => {
    if (!miniQuizQuestions || currentMiniQuizQuestionIndex >= miniQuizQuestions.length - 1) {
      setMiniQuizStage('results'); // All questions answered, go to results
    } else {
      setCurrentMiniQuizQuestionIndex(prevIndex => prevIndex + 1);
      setCurrentQuestionAnswered(false); // Reset for the new question
    }
  };
  
  const resetMiniQuiz = () => {
    startMiniQuiz();
  }

  const currentQuestionForDisplay = miniQuizQuestions ? miniQuizQuestions[currentMiniQuizQuestionIndex] : null;
  const currentSelectedAnswerForDisplay = miniQuizSelectedAnswers[currentMiniQuizQuestionIndex];
  const currentAnswerStatusForDisplay = miniQuizAnswerStatuses[currentMiniQuizQuestionIndex];

  return (
    <ScrollArea className="max-h-[65vh] pr-3">
      <div className="space-y-6 py-4">
        <div>
          <h4 className="font-semibold text-lg text-foreground mb-2 flex items-center">
            <BookText className="mr-2 h-5 w-5 text-primary" /> Theory
          </h4>
          <div className="p-4 bg-muted/50 rounded-md shadow-sm">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {section.theory || "Theory content for this section will be available soon."}
            </p>
          </div>
        </div>

        {section.keyFormulasAndConcepts && (
          <div>
            <Separator className="my-4" />
            <h4 className="font-semibold text-lg text-foreground mb-2 flex items-center">
              <SigmaSquare className="mr-2 h-5 w-5 text-primary" /> Key Formulas & Concepts
            </h4>
            <div className="p-4 bg-accent/10 dark:bg-accent/20 rounded-md shadow-sm border border-accent/30">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap font-code">
                {section.keyFormulasAndConcepts}
              </p>
            </div>
          </div>
        )}
        
        <Separator className="my-4" />

        <div>
          <h4 className="font-semibold text-lg text-foreground mb-3 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" /> Test Your Understanding
          </h4>
          
          {miniQuizStage === 'idle' && (
            <Button onClick={startMiniQuiz} className="mb-4">
              Start Mini-Quiz ({NUM_MINI_QUIZ_QUESTIONS} Questions)
            </Button>
          )}

          {miniQuizStage === 'loading' && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating mini-quiz...</p>
            </div>
          )}

          {errorMiniQuiz && miniQuizStage === 'idle' && (
            <p className="text-sm text-destructive mb-4">{errorMiniQuiz}</p>
          )}

          {miniQuizStage === 'playing' && currentQuestionForDisplay && (
            <Card className="bg-card shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                        Question {currentMiniQuizQuestionIndex + 1} of {miniQuizQuestions?.length}
                    </CardDescription>
                    <Progress value={((currentMiniQuizQuestionIndex + 1) / (miniQuizQuestions?.length || 1)) * 100} className="w-1/2 h-2" />
                </div>
                <CardTitle className="text-md text-card-foreground pt-2">{currentQuestionForDisplay.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RadioGroup
                  onValueChange={handleMiniQuizAnswerSelection}
                  value={currentSelectedAnswerForDisplay || ""}
                  disabled={currentQuestionAnswered}
                >
                  {currentQuestionForDisplay.options.map((option, optIndex) => (
                    <div key={optIndex} className={cn(
                        "flex items-center space-x-3 p-3 rounded-md border transition-colors",
                        currentQuestionAnswered && option === currentQuestionForDisplay.correctAnswer && "bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-700",
                        currentQuestionAnswered && currentSelectedAnswerForDisplay === option && option !== currentQuestionForDisplay.correctAnswer && "bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-700",
                        !currentQuestionAnswered && currentSelectedAnswerForDisplay === option && "bg-primary/10 border-primary",
                        !currentQuestionAnswered && "hover:bg-muted/50 cursor-pointer"
                      )}
                      onClick={() => !currentQuestionAnswered && handleMiniQuizAnswerSelection(option)}
                    >
                      <RadioGroupItem 
                        value={option} 
                        id={`${section.id}-mq-opt${optIndex}`} 
                        checked={currentSelectedAnswerForDisplay === option}
                        disabled={currentQuestionAnswered}
                      />
                      <Label
                        htmlFor={`${section.id}-mq-opt${optIndex}`}
                        className={cn(
                          "text-sm flex-1",
                          !currentQuestionAnswered && "cursor-pointer",
                           currentQuestionAnswered && option === currentQuestionForDisplay.correctAnswer && "text-green-700 dark:text-green-300 font-semibold",
                           currentQuestionAnswered && currentSelectedAnswerForDisplay === option && option !== currentQuestionForDisplay.correctAnswer && "text-red-700 dark:text-red-300 font-semibold"
                        )}
                      >
                        {option}
                      </Label>
                      {currentQuestionAnswered && option === currentQuestionForDisplay.correctAnswer && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
                      {currentQuestionAnswered && currentSelectedAnswerForDisplay === option && option !== currentQuestionForDisplay.correctAnswer && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 mt-2">
                {!currentQuestionAnswered ? (
                  <Button onClick={submitMiniQuizAnswer} disabled={!currentSelectedAnswerForDisplay}>
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={goToNextMiniQuizQuestion}>
                    {currentMiniQuizQuestionIndex < (miniQuizQuestions?.length || 0) - 1 ? "Next Question" : "Finish Quiz"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {miniQuizStage === 'results' && miniQuizQuestions && (
            <Card className="bg-card shadow-md text-center">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Mini-Quiz Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-lg">You scored <span className="font-bold text-accent">{miniQuizScore}</span> out of <span className="font-bold">{miniQuizQuestions.length}</span>!</p>
                {miniQuizScore === miniQuizQuestions.length && <p className="text-green-600 font-semibold">Excellent work! 🎉</p>}
                {miniQuizScore < miniQuizQuestions.length && miniQuizScore >= miniQuizQuestions.length / 2 && <p className="text-orange-500 font-semibold">Good effort, keep practicing!</p>}
                {miniQuizScore < miniQuizQuestions.length / 2 && <p className="text-red-600 font-semibold">Review the material and try again!</p>}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={resetMiniQuiz} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4"/> Retry Mini-Quiz
                </Button>
                <Button onClick={() => setMiniQuizStage('idle')}>Back to Section</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
    
