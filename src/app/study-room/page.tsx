
import { StudyRoomClient } from './components/StudyRoomClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lightbulb, Brain, Clock, Archive } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StudyRoomPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">AI Study Room</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Collaborate with peers and get AI-powered assistance from Gemini. Your dedicated space for focused learning.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <StudyRoomClient />
        </div>
        
        <aside className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Users className="mr-2 h-6 w-6 text-accent" /> Co-Study Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground/80">Join up to 2 other users for a collaborative session.</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                <li>Pomodoro Timers</li>
                <li>Shared Notepad</li>
                <li>Group Chat</li>
              </ul>
              <Image 
                src="https://placehold.co/400x250.png" 
                alt="Collaboration" 
                width={400} 
                height={250} 
                className="rounded-md mt-2 object-cover aspect-video"
                data-ai-hint="team collaboration"
              />
               <p className="text-xs text-muted-foreground text-center mt-1">(Co-study features coming soon)</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-accent" /> Gemini Tutor Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground/80">Your AI tutor can:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                <li>Answer your specific doubts</li>
                <li>Convert notes to flashcards (if helpful)</li>
                <li>Generate practice questions from notes</li>
                <li>Provide reasoning for its actions</li>
              </ul>
               <Image 
                src="https://placehold.co/400x250.png" 
                alt="AI Tutor" 
                width={400} 
                height={250} 
                className="rounded-md mt-2 object-cover aspect-video"
                data-ai-hint="robot teaching"
              />
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Session & Content Information</AlertTitle>
            <AlertDescription className="text-blue-700/90 dark:text-blue-300/90 mt-1 space-y-1">
                <p>Study sessions are ephemeral and auto-delete after 2 hours of inactivity.</p>
                <p className="flex items-center"><Archive className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-300" /> Use a "Time Capsule" to save important AI generations (3 per month free - feature coming soon).</p>
            </AlertDescription>
          </Alert>
        </aside>
      </div>
    </div>
  );
}
