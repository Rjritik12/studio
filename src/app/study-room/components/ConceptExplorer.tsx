
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Lightbulb, BookText, Zap } from 'lucide-react';
import { handleExploreConcept } from '@/lib/actions';
import type { ExploreConceptOutput } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function ConceptExplorer() {
  const [conceptText, setConceptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conceptData, setConceptData] = useState<ExploreConceptOutput | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conceptText.trim()) {
      setError("Please enter a concept to explore.");
      return;
    }
    
    setError(null);
    setConceptData(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('concept', conceptText);

    try {
      const result = await handleExploreConcept(formData);
      if ('error' in result) {
        setError(result.error);
      } else {
        setConceptData(result);
      }
    } catch (clientError) {
      console.error("Client error calling handleExploreConcept:", clientError);
      setError("An unexpected client-side error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-xl flex items-center">
          <Search className="mr-2 h-6 w-6 text-accent" /> Concept Explorer
        </CardTitle>
        <CardDescription>
          Enter a topic or keyword, and let AI explain it, list related terms, and provide an analogy.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="concept-text" className="text-foreground/90">Concept/Keyword</Label>
            <div className="flex gap-2">
              <Input
                id="concept-text"
                name="concept"
                value={conceptText}
                onChange={(e) => setConceptText(e.target.value)}
                placeholder="e.g., Photosynthesis, Quantum Entanglement"
                className="border-input focus:border-primary transition-colors flex-grow"
                required
                disabled={isLoading}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0" disabled={isLoading || !conceptText.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Explore</span>
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </form>

      {isLoading && (
        <div className="text-center py-4 px-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">AI is exploring the concept...</p>
        </div>
      )}

      {conceptData && !isLoading && (
        <CardContent className="pt-2 space-y-5">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1.5 flex items-center">
              <BookText className="mr-2 h-5 w-5 text-primary" /> Explanation:
            </h3>
            <div className="p-3 bg-foreground/5 rounded-md shadow-sm">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{conceptData.explanation}</p>
            </div>
          </div>

          {conceptData.relatedTerms && conceptData.relatedTerms.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" /> Related Terms:
              </h3>
              <div className="flex flex-wrap gap-2">
                {conceptData.relatedTerms.map((term, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {conceptData.analogy && (
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5 flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-primary" /> Analogy/Example:
              </h3>
               <div className="p-3 bg-foreground/5 rounded-md shadow-sm">
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{conceptData.analogy}</p>
              </div>
            </div>
          )}
        </CardContent>
      )}
       {!isLoading && !conceptData && !error && (
        <CardContent className="pt-0">
            <Alert variant="default" className="bg-muted/50">
                <Lightbulb className="h-5 w-5"/>
                <AlertDescription>
                Enter a concept above and click "Explore" to get an AI-powered explanation.
                </AlertDescription>
            </Alert>
        </CardContent>
       )}
    </Card>
  );
}
