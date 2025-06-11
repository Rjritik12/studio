import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Edit3, ShieldCheck, Star, Clock } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "EduVerse User",
    email: "user@eduverse.app",
    avatarUrl: "https://placehold.co/128x128.png",
    joinDate: "January 1, 2024",
    xp: 1250,
    level: 8,
    badges: ["Quiz Master", "Streak King", "Study Buddy"],
    timeCapsulesUsed: 1,
    timeCapsulesLimit: 3,
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">My Profile</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          View your progress, achievements, and manage your account settings.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-xl">
          <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile picture"/>
              <AvatarFallback className="text-4xl">{user.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Button variant="outline" size="sm" className="mt-3">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            <p>Joined: {user.joinDate}</p>
             <Separator className="my-3" />
            <div className="flex items-center justify-between">
                <span className="font-medium">Time Capsules:</span>
                <span>{user.timeCapsulesUsed} / {user.timeCapsulesLimit} used this month</span>
            </div>
            <Button variant="link" className="p-0 h-auto text-primary text-xs mt-1">Purchase More</Button>
          </CardContent>
        </Card>

        {/* Stats and Badges Card */}
        <Card className="lg:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl">My Stats & Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 bg-foreground/5 rounded-lg">
                <Star className="h-10 w-10 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{user.xp} XP</p>
                <p className="text-sm text-muted-foreground">Level {user.level}</p>
              </div>
              <div className="p-4 bg-foreground/5 rounded-lg">
                <ShieldCheck className="h-10 w-10 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{user.badges.length} Badges</p>
                <p className="text-sm text-muted-foreground">Collected</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3 text-foreground">Badges Earned:</h3>
              <div className="flex flex-wrap gap-3">
                {user.badges.map(badge => (
                  <span key={badge} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1.5">
                    <BadgePercent className="h-4 w-4"/> {badge}
                  </span>
                ))}
              </div>
            </div>
            <Separator />
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Activity (Placeholder)</h3>
              <Image 
                src="https://placehold.co/600x300.png" 
                alt="Activity graph"
                width={600}
                height={300}
                className="rounded-lg object-cover aspect-[2/1]"
                data-ai-hint="activity chart" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
        <p className="text-center text-sm text-muted-foreground mt-10">
        (This is a placeholder profile page. More features coming soon!)
      </p>
    </div>
  );
}
