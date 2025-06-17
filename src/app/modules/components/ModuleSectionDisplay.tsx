
"use client";

import { useState } from 'react';
import type { ModuleSection, QuizQuestion, GenerateSingleQuizQuestionInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, BookText, CheckCircle, XCircle, SigmaSquare, Brain } from 'lucide-react';
import { handleFlipQuestion } from '@/lib/actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea import

interface ModuleSectionDisplayProps {
  section: ModuleSection;
  moduleDifficulty: 'easy' | 'medium' | 'hard';
}

export function ModuleSectionDisplay({ section, moduleDifficulty }: ModuleSectionDisplayProps) {
  const [practiceQuestion, setPracticeQuestion] = useState<QuizQuestion | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [errorQuestion, setErrorQuestion] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean | null>(null);

  const generateQuestion = async () => {
    setIsLoadingQuestion(true);
    setErrorQuestion(null);
    setPracticeQuestion(null);
    setSelectedAnswer(null);
    setAnswerIsCorrect(null);

    const input: GenerateSingleQuizQuestionInput = {
      topic: section.topicForAI,
      difficulty: moduleDifficulty,
      // existingQuestions: practiceQuestion ? [practiceQuestion.question] : [], // To avoid immediate repetition if desired
    };

    try {
      const result = await handleFlipQuestion(input); // Using the flip action to get one question
      if ('error' in result || !result.question) {
        setErrorQuestion(result.error || "Failed to generate practice question.");
      } else {
        setPracticeQuestion(result.question);
      }
    } catch (e) {
      setErrorQuestion("An unexpected error occurred while fetching the question.");
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleAnswerSelection = (value: string) => {
    if (!practiceQuestion) return;
    setSelectedAnswer(value);
    setAnswerIsCorrect(value === practiceQuestion.correctAnswer);
  };

  return (
    <ScrollArea className="max-h-[65vh] pr-3"> {/* Added ScrollArea and max height */}
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
            <Brain className="mr-2 h-5 w-5 text-primary" /> Practice Question
          </h4>
          <Button onClick={generateQuestion} disabled={isLoadingQuestion} className="mb-4">
            {isLoadingQuestion && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {practiceQuestion ? "Generate New Question" : "Generate Practice Question"}
          </Button>

          {errorQuestion && <p className="text-sm text-destructive">{errorQuestion}</p>}

          {practiceQuestion && !isLoadingQuestion && (
            <Card className="bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium text-muted-foreground">Question:</CardDescription>
                <CardTitle className="text-md text-card-foreground">{practiceQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RadioGroup
                  onValueChange={handleAnswerSelection}
                  value={selectedAnswer || ""}
                  disabled={selectedAnswer !== null}
                >
                  {practiceQuestion.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${section.id}-q-opt${optIndex}`} />
                      <Label
                        htmlFor={`${section.id}-q-opt${optIndex}`}
                        className={cn(
                          "text-sm cursor-pointer",
                          selectedAnswer === option && answerIsCorrect === true && "text-green-600 font-semibold",
                          selectedAnswer === option && answerIsCorrect === false && "text-red-600 font-semibold",
                          selectedAnswer !== null && option === practiceQuestion.correctAnswer && selectedAnswer !== option && "text-green-600 font-semibold",
                          selectedAnswer !== null && "cursor-default"
                        )}
                      >
                        {option}
                        {selectedAnswer === option && answerIsCorrect === true && <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />}
                        {selectedAnswer === option && answerIsCorrect === false && <XCircle className="inline ml-2 h-4 w-4 text-red-600" />}
                        {selectedAnswer !== null && option === practiceQuestion.correctAnswer && selectedAnswer !== option && <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {selectedAnswer !== null && answerIsCorrect === false && (
                  <p className="text-xs text-red-700 font-medium">Correct answer: {practiceQuestion.correctAnswer}</p>
                )}
                {selectedAnswer !== null && answerIsCorrect === true && (
                  <p className="text-xs text-green-700 font-medium">You got it right!</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
    
