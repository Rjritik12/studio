
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { Flashcard } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashcardDisplayProps {
  flashcard: Flashcard;
}

export function FlashcardDisplay({ flashcard }: FlashcardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <Card 
      className={cn(
        "shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer relative min-h-[160px] flex flex-col justify-between bg-card text-card-foreground"
      )}
      onClick={toggleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFlip(); }}
      aria-pressed={isFlipped}
      aria-label={`Flashcard: ${isFlipped ? 'Showing answer' : 'Showing question'}. Click to flip.`}
    >
      <CardHeader className="pb-2 pt-4 flex-grow">
        <CardTitle className="text-base font-semibold text-primary">
          {isFlipped ? "Answer:" : "Question:"}
        </CardTitle>
        <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">
          {isFlipped ? flashcard.answer : flashcard.question}
        </p>
      </CardHeader>
      <CardContent className="pb-3 pt-1 flex justify-end">
         <div className="text-xs text-muted-foreground flex items-center">
            <RefreshCw className="mr-1 h-3 w-3" /> Tap to flip
          </div>
      </CardContent>
    </Card>
  );
}
