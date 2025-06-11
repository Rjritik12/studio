import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, HelpCircle, LayoutGrid, Swords, Users } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const features = [
    { title: "KBC Quiz", description: "Test your knowledge with exciting quizzes.", href: "/quiz", icon: HelpCircle, dataAiHint: "quiz graduation" },
    { title: "Online Battles", description: "Challenge friends or random opponents.", href: "/battles", icon: Swords, dataAiHint: "gaming competition" },
    { title: "AI Study Room", description: "Collaborate and learn with an AI tutor.", href: "/study-room", icon: Users, dataAiHint: "students studying" },
    { title: "Social Feed", description: "Share and discover study materials.", href: "/feed", icon: LayoutGrid, dataAiHint: "social media" },
    { title: "Study Library", description: "Access a vast collection of resources.", href: "/library", icon: BookOpenCheck, dataAiHint: "library books" },
  ];

  return (
    <div className="flex flex-col items-center justify-center ">
      <header className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary to-accent/80 rounded-lg shadow-xl mb-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary-foreground mb-4">
            Welcome to EduVerse
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Your all-in-one platform for gamified learning, AI-powered study, and social connection.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6">
        <section className="mb-16">
          <h2 className="font-headline text-3xl font-semibold text-center mb-10 text-foreground">Explore Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <feature.icon className="w-10 h-10 text-primary" />
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-foreground/80 mb-4">{feature.description}</CardDescription>
                   <Image 
                    src={`https://placehold.co/600x400.png`} 
                    alt={feature.title} 
                    width={600} 
                    height={400} 
                    className="rounded-md mb-4 object-cover aspect-video"
                    data-ai-hint={feature.dataAiHint}
                    />
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href={feature.href} passHref>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-12 bg-card rounded-lg shadow-md">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl font-semibold mb-6 text-card-foreground">Ready to Elevate Your Learning?</h2>
            <p className="text-lg text-card-foreground/80 mb-8 max-w-2xl mx-auto">
              Join EduVerse today and unlock a universe of knowledge and fun.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/profile">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
