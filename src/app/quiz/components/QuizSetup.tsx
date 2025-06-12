
"use client";

import type { FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

interface QuizSetupProps {
  onQuizSetup: (formData: FormData) => void;
  isLoading: boolean;
  error?: string | null;
}

const suggestedTopics = [
  "General Knowledge", "Current Events", "World History", "Indian History", "Geography", "World Capitals",
  "Science", "Physics", "Chemistry", "Biology", "Human Body", "Space Exploration", "Technology", "Computer Science", "Artificial Intelligence",
  "Mathematics", "Algebra", "Geometry",
  "Literature", "Famous Books", "Authors", "Poetry",
  "Art", "Famous Paintings", "Artists", "Sculpture",
  "Music", "Classical Music", "Pop Music", "Musicians", "Instruments",
  "Movies", "Hollywood", "Bollywood", "Famous Actors", "Film Directors",
  "Sports", "Cricket", "Football (Soccer)", "Basketball", "Tennis", "Olympics",
  "Politics", "World Leaders", "Indian Politics", "International Relations",
  "Economics", "Global Economy", "Stock Market",
  "Mythology", "Greek Mythology", "Norse Mythology", "Indian Mythology",
  "Nature & Environment", "Animals", "Plants", "Climate Change", "National Parks",
  "Inventions & Discoveries", "Inventors", "Scientific Discoveries",
  "Famous Personalities", "Entrepreneurs", "Scientists", "Nobel Prize Winners",
  "Food & Drink", "World Cuisine", "Cooking Techniques",
  "Programming Languages", "Web Development", "Data Structures", "Algorithms"
];

export function QuizSetup({ onQuizSetup, isLoading, error }: QuizSetupProps) {
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onQuizSetup(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Setup Your Quiz</CardTitle>
        <CardDescription>Choose your topic, difficulty, and number of questions to start.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-foreground/90">Topic</Label>
            <Input 
              id="topic" 
              name="topic" 
              placeholder="e.g., Indian History, Physics" 
              required 
              list="topic-suggestions"
            />
            <datalist id="topic-suggestions">
              {suggestedTopics.map(topic => (
                <option key={topic} value={topic} />
              ))}
            </datalist>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-foreground/90">Difficulty</Label>
            <Select name="difficulty" defaultValue="medium" required>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numQuestions" className="text-foreground/90">Number of Questions</Label>
            <Input id="numQuestions" name="numQuestions" type="number" defaultValue="5" min="1" max="15" required />
            <p className="text-sm text-muted-foreground">Max 15 questions for KBC style.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Start Quiz"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
