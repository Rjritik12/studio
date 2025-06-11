
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, Users, Zap, Play, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BattlesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Online Battles</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Challenge your friends or match with random opponents in exciting real-time quiz duels!
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <Image 
            src="https://placehold.co/600x400.png" 
            alt="Quiz Battle" 
            width={600} 
            height={400}
            className="rounded-lg shadow-xl object-cover aspect-video"
            data-ai-hint="gaming versus" 
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-semibold text-foreground">Ready for a Challenge?</h2>
          <p className="text-lg text-foreground/80">
            Engage in fast-paced 1v1 battles. Answer 5-10 questions, 10 seconds each. Use power-ups, build streaks, and climb the leaderboard!
          </p>
          <TooltipProvider>
            <div className="flex flex-col sm:flex-row gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto opacity-50 cursor-not-allowed" disabled>
                    <Play className="mr-2 h-5 w-5" /> Find Random Match
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon!</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto opacity-50 cursor-not-allowed" disabled>
                    <Users className="mr-2 h-5 w-5" /> Challenge a Friend
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon!</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Battle Features</CardTitle>
          <CardDescription>Unleash your potential with these exciting elements:</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Swords, title: "1v1 Duels", description: "Real-time quiz battles." },
            { icon: Zap, title: "Power-Ups", description: "Freeze opponent, peek answers, double XP." },
            { icon: Users, title: "Leaderboards", description: "Compete for top rankings." },
          ].map(feature => (
            <div key={feature.title} className="flex items-start gap-4 p-4 bg-card-foreground/5 rounded-lg">
              <feature.icon className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-12 text-center p-6 bg-accent/10 rounded-lg">
        <h3 className="font-headline text-2xl font-semibold text-accent mb-3">Battle Pass</h3>
        <p className="text-foreground/80 mb-4">Get extra battles and exclusive rewards for just ₹9!</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground opacity-50 cursor-not-allowed" disabled>Unlock Battle Pass</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Payment integration coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-muted-foreground mt-2">(UPI payments supported - coming soon)</p>
      </div>
      
      <Alert variant="default" className="mt-10 max-w-2xl mx-auto bg-primary/10 border-primary/30">
        <ShieldAlert className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Under Development</AlertTitle>
        <AlertDescription className="text-foreground/80">
          The Online Battle functionality is currently under active development and not yet live. 
          The features described are part of the planned experience. Stay tuned for updates!
        </AlertDescription>
      </Alert>
    </div>
  );
}
