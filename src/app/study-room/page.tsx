
import { StudyRoomClient } from './components/StudyRoomClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lightbulb, Brain, Clock, Archive, UserCircle, Search } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConceptExplorer } from './components/ConceptExplorer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export default function StudyRoomPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">AI Study Room</h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          Get AI-powered assistance from Gemini. Your dedicated space for focused learning and concept exploration.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <StudyRoomClient />
        </div>
        
        <aside className="lg:col-span-1 space-y-6">
          <Accordion type="single" collapsible className="w-full shadow-lg rounded-lg border bg-card text-card-foreground">
            <AccordionItem value="concept-explorer">
              <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 hover:no-underline">
                <div className="flex items-center font-headline text-lg sm:text-xl text-primary">
                  <Search className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Concept Explorer
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-0 pb-0">
                {/* ConceptExplorer is already a Card, so it provides its own padding and structure */}
                <ConceptExplorer />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tutor-capabilities" className="border-t">
              <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 hover:no-underline">
                <div className="flex items-center font-headline text-lg sm:text-xl text-accent">
                  <Lightbulb className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Gemini Tutor Capabilities
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-foreground/80">Your AI tutor can:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-foreground/70">
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
                    className="rounded-md mt-2 object-cover aspect-video w-full"
                    data-ai-hint="AI tutor abstract"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Alert variant="default" className="bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-semibold text-sm sm:text-base text-blue-700 dark:text-blue-300">Session & Content Information</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm text-blue-700/90 dark:text-blue-300/90 mt-1 space-y-1">
                <p>AI Tutor sessions (notes, doubt, image) are processed on demand and results are displayed. They are not stored long-term unless you manually save the output.</p>
                <p className="flex items-center"><Archive className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-blue-500 dark:text-blue-300" /> Concept Explorer results are also generated on demand. Consider copying important information.</p>
            </AlertDescription>
          </Alert>
        </aside>
      </div>
    </div>
  );
}

