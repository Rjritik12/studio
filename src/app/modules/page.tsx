
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Atom, Dna } from 'lucide-react';
import { mockLearningModules } from '@/data/learning-modules';
import Image from 'next/image';
import type { LearningModule } from '@/lib/types';

const iconMap: { [key: string]: React.ElementType } = {
  Atom: Atom,
  Dna: Dna,
  BookOpen: BookOpen,
  Default: BookOpen,
};


export default function LearningModulesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Learning Modules</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Explore structured learning paths with theory and AI-generated practice questions.
        </p>
      </header>

      {mockLearningModules.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockLearningModules.map((module: LearningModule) => {
            const IconComponent = module.icon ? iconMap[module.icon] || iconMap.Default : iconMap.Default;
            return (
              <Card key={module.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="h-10 w-10 text-accent" />
                    <CardTitle className="font-headline text-2xl text-primary">{module.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm text-foreground/80 min-h-[60px] line-clamp-3">{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Image
                    src={`https://placehold.co/600x300.png`}
                    alt={module.title}
                    width={600}
                    height={300}
                    className="rounded-md object-cover aspect-video w-full"
                    data-ai-hint={module.dataAiHint || 'study education'}
                  />
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/modules/${module.id}`}>
                      Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No learning modules available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
