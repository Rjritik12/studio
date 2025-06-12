
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Star, ShieldCheck, UserCheck, BarChart3 } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const username = typeof params.username === 'string' ? decodeURIComponent(params.username) : "User";

  // Mock data for a generic user profile
  const mockUserStats = {
    xp: Math.floor(Math.random() * 2000) + 500, // Random XP between 500 and 2500
    level: Math.floor(Math.random() * 10) + 3,    // Random level between 3 and 12
    badges: ["Quiz Enthusiast", "Active Learner", "Community Helper"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1), // 1 to 3 random badges
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toLocaleDateString(), // Random join date within the last year
  };

  const avatarFallback = username.substring(0, 1).toUpperCase();
  const avatarUrl = `https://placehold.co/128x128.png?text=${avatarFallback}`;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <UserCheck className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">{username}'s Profile</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Viewing the public profile of {username}.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-xl">
          <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
              <AvatarImage src={avatarUrl} alt={username} data-ai-hint="profile picture user" />
              <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{username}</CardTitle>
            <CardDescription>EduVerse Member</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            <p>Joined: {mockUserStats.joinDate}</p>
            <Separator className="my-3" />
            <p className="text-muted-foreground">More user details will be available here in the future.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Stats & Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 bg-foreground/5 rounded-lg">
                <Star className="h-10 w-10 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{mockUserStats.xp} XP</p>
                <p className="text-sm text-muted-foreground">Level {mockUserStats.level}</p>
              </div>
              <div className="p-4 bg-foreground/5 rounded-lg">
                <ShieldCheck className="h-10 w-10 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{mockUserStats.badges.length} Badges</p>
                <p className="text-sm text-muted-foreground">Collected</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3 text-foreground">Badges Earned:</h3>
              <div className="flex flex-wrap gap-3">
                {mockUserStats.badges.map(badge => (
                  <span key={badge} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1.5">
                    <BadgePercent className="h-4 w-4"/> {badge}
                  </span>
                ))}
                {mockUserStats.badges.length === 0 && <p className="text-sm text-muted-foreground">No badges earned yet.</p>}
              </div>
            </div>
            <Separator />
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Activity Overview</h3>
               <Image 
                src="https://placehold.co/600x300.png" 
                alt="Generic activity graph"
                width={600}
                height={300}
                className="rounded-lg object-cover aspect-[2/1]"
                data-ai-hint="user activity chart" 
              />
              <p className="text-xs text-muted-foreground text-center mt-2">Detailed activity tracking is illustrative.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert variant="default" className="mt-10 max-w-2xl mx-auto bg-primary/10 border-primary/30">
        <BarChart3 className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Public Profile View</AlertTitle>
        <AlertDescription className="text-foreground/80">
          This is a basic public profile. More interactive features and user-specific content for public profiles are planned for future updates.
        </AlertDescription>
      </Alert>
    </div>
  );
}
