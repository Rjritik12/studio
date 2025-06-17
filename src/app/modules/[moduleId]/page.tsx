
"use client";

import { useParams, useRouter } from 'next/navigation';
import { mockLearningModules } from '@/data/learning-modules';
import type { LearningModule } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, ChevronRight, CircleHelp, Atom, Dna } from 'lucide-react';
import { ModuleSectionDisplay } from '../components/ModuleSectionDisplay';
import Link from 'next/link';

const iconMap: { [key: string]: React.ElementType } = {
  Atom: Atom,
  Dna: Dna,
  BookOpen: BookOpen,
  Default: BookOpen,
};


export default function IndividualModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = typeof params.moduleId === 'string' ? params.moduleId : null;

  const module = mockLearningModules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <CircleHelp className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Module Not Found</h1>
        <p className="text-muted-foreground mb-6">The learning module you are looking for does not exist or could not be loaded.</p>
        <Button asChild variant="outline">
          <Link href="/modules"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules</Link>
        </Button>
      </div>
    );
  }
  
  const IconComponent = module.icon ? iconMap[module.icon] || iconMap.Default : iconMap.Default;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/modules')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Modules
      </Button>

      <Card className="shadow-xl border-primary/30">
        <CardHeader className="bg-primary/5 rounded-t-lg">
          <div className="flex items-center gap-4">
            <IconComponent className="h-12 w-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{module.title}</CardTitle>
              <CardDescription className="text-md text-primary/80 mt-1">{module.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {module.sections.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {module.sections.map((section, index) => (
                <AccordionItem value={`section-${section.id}`} key={section.id}>
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center">
                      <ChevronRight className="mr-3 h-5 w-5 text-accent transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      {index + 1}. {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-8 border-l-2 border-accent/30 ml-2.5">
                    <ModuleSectionDisplay section={section} moduleDifficulty={module.difficulty} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-4">No sections available for this module yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
