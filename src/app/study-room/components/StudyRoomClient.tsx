
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Lightbulb, AlertCircle } from 'lucide-react';
import { handleStudySession } from '@/lib/actions';
import type { Flashcard, StudyRoomData } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PracticeQuestionCard } from './PracticeQuestionCard'; // Import the new component

export function StudyRoomClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyData, setStudyData] = useState<StudyRoomData | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStudyData(null);

    const formData = new FormData(event.currentTarget);
    const result = await handleStudySession(formData);
    setIsLoading(false);

    if ('error' in result) {
      setError(result.error);
    } else {
      setStudyData(result);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-2 h-7 w-7 text-primary" /> Ask Your AI Tutor</CardTitle>
          <CardDescription>Enter your notes and any doubts you have. Gemini will help you out!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground/90 text-lg">Your Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Paste your study notes here..."
                rows={6}
                className="border-input focus:border-primary transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doubt" className="text-foreground/90 text-lg">Your Doubt/Question</Label>
              <Textarea
                id="doubt"
                name="doubt"
                placeholder="What are you stuck on? Ask Gemini..."
                rows={3}
                className="border-input focus:border-primary transition-colors"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Get AI Help"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <div className="text-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-lg text-muted-foreground">Gemini is thinking...</p>
        </div>
      )}

      {studyData && (
        <Card className="shadow-xl border-primary/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center"><Sparkles className="mr-2 h-7 w-7 text-accent" /> AI Tutor Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-xl text-foreground mb-2">Answer to Your Doubt:</h3>
              <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none p-4 bg-foreground/5 rounded-md shadow">
                <p className="text-foreground/90 whitespace-pre-wrap">{studyData.answer}</p>
              </div>
            </div>

            <div>
                <h3 className="font-semibold text-xl text-foreground mb-2">Flashcard Status:</h3>
                <Alert>
                    <Lightbulb className="h-5 w-5" />
                    <AlertTitle className="font-semibold">Recommendation & Outcome</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap mt-1">
                        {studyData.flashcardRecommendation}
                    </AlertDescription>
                </Alert>
            </div>
            
            {studyData.flashcards && studyData.flashcards.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl text-foreground mb-3">Generated Flashcards:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {studyData.flashcards.map((flashcard: Flashcard, index: number) => ( // Ensure Flashcard type is used
                    <Card key={index} className="bg-card shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-base font-semibold text-primary">Q: {flashcard.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm text-foreground/80">A: {flashcard.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {studyData.flashcards && typeof studyData.flashcards === 'string' && ( // Fallback if AI still returns string
                 <div>
                    <h3 className="font-semibold text-xl text-foreground mb-3">Generated Flashcards (Raw Data):</h3>
                    <Alert variant="default" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">Flashcard Parsing Issue</AlertTitle>
                        <AlertDescription className="text-amber-700/90 dark:text-amber-300/90 mt-1">
                            The AI provided flashcard data as a string, but we expected a structured array.
                            You can see the raw data below to copy or format it manually.
                        </AlertDescription>
                    </Alert>
                    <Textarea value={studyData.flashcards} readOnly rows={8} className="bg-muted/50 text-sm mt-3 focus-visible:ring-0 focus-visible:ring-offset-0" />
                 </div>
            )}
             {studyData.practiceQuestions && studyData.practiceQuestions.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl text-foreground mb-3">Practice Questions:</h3>
                <div className="space-y-4">
                  {studyData.practiceQuestions.map((pq, index) => (
                    <PracticeQuestionCard key={index} questionItem={pq} index={index} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
