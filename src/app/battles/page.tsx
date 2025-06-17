
"use client";

import { useState } from "react"; // Added useState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, Users, Zap, Play, ShieldAlert, Trophy, ShieldHalf, BarChart3, Star, IndianRupee } from "lucide-react"; // Added IndianRupee
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PaymentDialog } from "@/components/payments/PaymentDialog"; // Added PaymentDialog import

export default function BattlesPage() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false); // Added state for dialog

  const battleFeatures = [
    { 
      icon: Swords, 
      title: "Thrilling 1v1 Duels", 
      description: "Engage in real-time quiz battles against a friend or a random opponent. Quick thinking and broad knowledge are your keys to victory!" 
    },
    { 
      icon: Zap, 
      title: "Strategic Power-Ups", 
      description: "Turn the tide with game-changing power-ups like 'Freeze Timer' to pause your opponent's clock, 'Double Points' for a crucial question, or 'Fifty-Fifty' to eliminate two wrong options." 
    },
    { 
      icon: BarChart3, 
      title: "Competitive Leaderboards", 
      description: "Climb the ranks! Earn points for every win and see how you stack up against other players locally and globally. Weekly and all-time leaderboards."
    },
    {
      icon: ShieldHalf,
      title: "Streak Bonuses",
      description: "Maintain a winning streak to unlock score multipliers and bonus XP. The longer the streak, the greater the reward!"
    },
    {
      icon: Trophy,
      title: "Exclusive Rewards",
      description: "Win battles to earn unique badges, profile customizations, and in-game currency to spend on new power-ups or Battle Pass tiers."
    },
     {
      icon: Users,
      title: "Custom Lobbies",
      description: "Create private lobbies to challenge your friends directly. Set custom rules, topics, and difficulty for your matches."
    }
  ];

  const handleBattlePassPurchase = () => {
    // In a real app, you might do something after mock payment success
    console.log("Battle Pass mock purchase successful!");
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Online Quiz Battles</h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Test your wits in head-to-head quiz duels! Challenge friends or get matched with players worldwide.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Quiz Battle Arena" 
              width={600} 
              height={400}
              className="rounded-lg shadow-xl object-cover aspect-video"
              data-ai-hint="versus screen gaming" 
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-semibold text-foreground">Ready for a Real Challenge?</h2>
            <p className="text-lg text-foreground/80">
              Experience the thrill of fast-paced 1v1 quiz battles. Answer a series of 5-10 questions, with only 10-15 seconds per question. Use strategic power-ups, build impressive answer streaks, and dominate the leaderboards to become the ultimate quiz champion!
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
                    <p>Matchmaking system coming soon!</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto opacity-50 cursor-not-allowed" disabled>
                      <Users className="mr-2 h-5 w-5" /> Challenge a Friend
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Friend system and private lobbies coming soon!</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="font-headline text-3xl font-semibold text-center mb-10 text-foreground">How Battles Work</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
              <Card className="bg-card/50 shadow-md">
                  <CardHeader>
                      <CardTitle className="font-headline text-xl text-primary">1. Get Matched</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-foreground/80">Quickly find an opponent of similar skill or invite a friend to a custom game.</p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50 shadow-md">
                  <CardHeader>
                      <CardTitle className="font-headline text-xl text-primary">2. Answer & Strategize</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-foreground/80">Face identical questions. Answer faster and more accurately. Deploy power-ups wisely!</p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50 shadow-md">
                  <CardHeader>
                      <CardTitle className="font-headline text-xl text-primary">3. Claim Victory</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-foreground/80">The player with the highest score at the end wins XP, ranking points, and bragging rights.</p>
                  </CardContent>
              </Card>
          </div>
        </section>


        <Card className="shadow-xl border-2 border-primary/30">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle className="font-headline text-2xl text-primary">Electrifying Battle Features</CardTitle>
            <CardDescription>Unleash your potential with these exciting elements designed for competitive fun:</CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {battleFeatures.map(feature => (
              <div key={feature.title} className="flex items-start gap-4 p-4 bg-foreground/5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="h-10 w-10 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-foreground/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-12 text-center p-6 bg-gradient-to-br from-accent/80 to-primary/70 rounded-lg shadow-2xl text-accent-foreground">
          <div className="mb-4">
              <Star className="h-12 w-12 text-yellow-300 mx-auto animate-pulse" />
          </div>
          <h3 className="font-headline text-3xl font-bold mb-3">Unlock the Battle Pass!</h3>
          <p className="text-lg mb-5 max-w-md mx-auto">
              Gain access to exclusive seasonal rewards, bonus XP, unique power-ups, and more for just <Badge variant="secondary" className="text-lg px-3 py-1 align-middle"><IndianRupee className="inline h-4 w-4 mr-0.5"/>99/season</Badge>!
          </p>
          <Button 
            size="lg" 
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold shadow-md"
            onClick={() => setIsPaymentDialogOpen(true)} // Open dialog
          >
            Get Premium Access (Mock)
          </Button>
          <p className="text-xs text-yellow-200/80 mt-3">(Secure UPI & Card payments will be supported)</p>
        </Card>
        
        <Alert variant="default" className="mt-16 max-w-3xl mx-auto bg-primary/10 border-primary/30">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <AlertTitle className="font-headline text-primary">Online Battles: Under Development</AlertTitle>
          <AlertDescription className="text-foreground/80">
            The Online Battle functionality is a key feature we're excited about and is currently under active development. 
            The features described on this page represent our vision for the full experience. True real-time multiplayer requires significant backend infrastructure which is being planned. Stay tuned for updates as we bring this electrifying mode to life!
          </AlertDescription>
        </Alert>
      </div>
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        itemName="Battle Pass Premium Access"
        itemPrice={99}
        onPaymentSuccessMock={handleBattlePassPurchase}
      />
    </>
  );
}

