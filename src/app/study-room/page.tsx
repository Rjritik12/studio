import { StudyRoomClient } from './components/StudyRoomClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lightbulb, Brain } from 'lucide-react';
import Image from 'next/image';

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
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-accent" /> Gemini Tutor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-foreground/80">Your AI tutor can:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                <li>Answer your doubts</li>
                <li>Convert notes/images to flashcards</li>
                <li>Drop timed quizzes</li>
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
          
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Study sessions are ephemeral and auto-delete after 2 hours. Use a "Time Capsule" to save important content (3 per month free).
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
