
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

const prioritizedTopics = [
  "Class 6th Science", "Class 6th Maths", "Class 6th Social Studies", "Class 6th English",
  "Class 7th Science", "Class 7th Maths", "Class 7th Social Studies", "Class 7th English",
  "Class 8th Science", "Class 8th Maths", "Class 8th Social Studies", "Class 8th English",
  "Class 9th Physics", "Class 9th Chemistry", "Class 9th Biology", "Class 9th Maths", "Class 9th History", "Class 9th Geography", "Class 9th Civics", "Class 9th Economics",
  "Class 10th Physics", "Class 10th Chemistry", "Class 10th Biology", "Class 10th Maths", "Class 10th History", "Class 10th Geography", "Class 10th Civics", "Class 10th Economics",
  "Class 11th Physics", "Class 11th Chemistry", "Class 11th Biology", "Class 11th Maths", "Class 11th Accountancy", "Class 11th Business Studies", "Class 11th Economics", "Class 11th History", "Class 11th Political Science",
  "Class 12th Physics", "Class 12th Chemistry", "Class 12th Biology", "Class 12th Maths", "Class 12th Accountancy", "Class 12th Business Studies", "Class 12th Economics", "Class 12th History", "Class 12th Political Science",
  "JEE Main Physics", "JEE Main Chemistry", "JEE Main Maths", 
  "JEE Advanced Physics", "JEE Advanced Chemistry", "JEE Advanced Maths",
  "NEET Physics", "NEET Chemistry", "NEET Biology (Botany & Zoology)",
  "Logical Reasoning", "Verbal Ability", "Quantitative Aptitude"
];

const otherTopics = [
  "General Knowledge", "Current Events", "World History", "Indian History", "Geography", "World Capitals",
  "Science", "Physics", "Chemistry", "Biology", "Human Body", "Space Exploration", "Technology", "Computer Science", "Artificial Intelligence",
  "Mathematics", "Algebra", "Geometry", "Trigonometry", "Calculus",
  "Literature", "Famous Books", "Authors", "Poetry", "Indian Literature", "English Literature",
  "Art", "Famous Paintings", "Artists", "Sculpture", "Indian Art Forms",
  "Music", "Classical Music", "Pop Music", "Musicians", "Instruments", "Indian Music",
  "Movies", "Hollywood", "Bollywood", "Famous Actors", "Film Directors", "World Cinema",
  "Sports", "Cricket", "Football (Soccer)", "Basketball", "Tennis", "Olympics", "Badminton", "Hockey",
  "Politics", "World Leaders", "Indian Politics", "International Relations", "Indian Constitution",
  "Economics", "Global Economy", "Stock Market", "Indian Economy", "Banking",
  "Mythology", "Greek Mythology", "Norse Mythology", "Indian Mythology", "Egyptian Mythology",
  "Nature & Environment", "Animals", "Plants", "Climate Change", "National Parks", "Ecology",
  "Inventions & Discoveries", "Inventors", "Scientific Discoveries", "Technological Advancements",
  "Famous Personalities", "Entrepreneurs", "Scientists", "Nobel Prize Winners", "Historical Figures",
  "Food & Drink", "World Cuisine", "Cooking Techniques", "Indian Cuisine",
  "Programming Languages", "Web Development", "Data Structures", "Algorithms", "Cybersecurity"
];

// Combine and remove duplicates, ensuring prioritized topics come first
const suggestedTopics = [
  ...new Set([...prioritizedTopics, ...otherTopics.filter(topic => !prioritizedTopics.includes(topic))])
];


export function QuizSetup({ onQuizSetup, isLoading, error }: QuizSetupProps) {
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onQuizSetup(formData);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-2 border-primary/20">
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
              placeholder="e.g., Class 10th Physics, JEE Maths, Indian History" 
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

