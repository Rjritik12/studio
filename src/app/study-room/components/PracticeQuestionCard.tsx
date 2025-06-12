
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PracticeQuestion } from '@/lib/types';

interface PracticeQuestionCardProps {
  questionItem: PracticeQuestion;
  index: number;
}

export function PracticeQuestionCard({ questionItem, index }: PracticeQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setIsCorrect(value === questionItem.correctAnswer);
  };

  return (
    <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-md font-semibold text-primary">Practice Question {index + 1}:</CardTitle>
        <p className="text-sm text-foreground/90 pt-1">{questionItem.question}</p>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <RadioGroup onValueChange={handleOptionChange} value={selectedOption || ""} disabled={selectedOption !== null}>
          {questionItem.options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`q${index}-opt${optIndex}`} />
              <Label 
                htmlFor={`q${index}-opt${optIndex}`}
                className={cn(
                  "text-sm cursor-pointer",
                  selectedOption === option && isCorrect === true && "text-green-600 font-semibold",
                  selectedOption === option && isCorrect === false && "text-red-600 font-semibold",
                  selectedOption !== null && option === questionItem.correctAnswer && selectedOption !== option && "text-green-600 font-semibold",
                  selectedOption !== null && "cursor-default"
                )}
              >
                {option}
                {selectedOption === option && isCorrect === true && <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />}
                {selectedOption === option && isCorrect === false && <XCircle className="inline ml-2 h-4 w-4 text-red-600" />}
                {selectedOption !== null && option === questionItem.correctAnswer && selectedOption !== option && <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {selectedOption !== null && isCorrect === false && (
          <p className="text-xs text-red-700 font-medium">Correct answer: {questionItem.correctAnswer}</p>
        )}
         {selectedOption !== null && isCorrect === true && (
          <p className="text-xs text-green-700 font-medium">You got it right!</p>
        )}
      </CardContent>
    </Card>
  );
}
