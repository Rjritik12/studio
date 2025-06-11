
"use client"; // Make this a client component to use hooks

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Edit3, ShieldCheck, Star, Clock, AlertCircle, LogIn, Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Mock data (will be overridden by auth user if available)
  const mockUserStats = {
    xp: 1250,
    level: 8,
    badges: ["Quiz Master", "Streak King", "Study Buddy"],
    timeCapsulesUsed: 1,
    timeCapsulesLimit: 3,
    joinDate: "January 1, 2024", // This might be fetched from Firestore in a real app
  };

  useEffect(() => {
    if (!loading && !user) {
      // router.push('/login?redirect=/profile'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-headline">Access Denied</AlertTitle>
          <AlertDescription>
            You need to be logged in to view your profile.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-6">
          <Link href="/login">
            <LogIn className="mr-2 h-5 w-5" /> Log In
          </Link>
        </Button>
      </div>
    );
  }
  
  // If user is authenticated
  const displayName = user.displayName || user.email?.split('@')[0] || "EduVerse User";
  const displayEmail = user.email || "No email provided";
  const avatarUrl = user.photoURL || `https://placehold.co/128x128.png?text=${displayName.substring(0,1).toUpperCase()}`;


  return (
    <TooltipProvider>
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
                <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="profile picture"/>
                <AvatarFallback className="text-4xl">{displayName.substring(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">{displayName}</CardTitle>
              <CardDescription>{displayEmail}</CardDescription>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-3" disabled>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Feature coming soon!</p>
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              <p>Joined: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : mockUserStats.joinDate}</p>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                  <span className="font-medium">Time Capsules:</span>
                  <span>{mockUserStats.timeCapsulesUsed} / {mockUserStats.timeCapsulesLimit} used this month</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-primary text-xs mt-1" disabled>Purchase More</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Feature coming soon!</p>
                </TooltipContent>
              </Tooltip>
               <Separator className="my-3" />
               <Button onClick={logout} variant="outline" className="w-full mt-2">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
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
                  {mockUserStats.badges.length === 0 && <p className="text-sm text-muted-foreground">No badges earned yet. Keep learning!</p>}
                </div>
              </div>
              <Separator />
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Activity</h3>
                <Image 
                  src="https://placehold.co/600x300.png" 
                  alt="Activity graph"
                  width={600}
                  height={300}
                  className="rounded-lg object-cover aspect-[2/1]"
                  data-ai-hint="activity chart" 
                />
                 <p className="text-xs text-muted-foreground text-center mt-2">Activity tracking coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Alert variant="default" className="mt-10 max-w-2xl mx-auto bg-primary/10 border-primary/30">
          <AlertCircle className="h-5 w-5 text-primary" />
          <AlertTitle className="font-headline text-primary">Profile Enhancements Coming Soon!</AlertTitle>
          <AlertDescription className="text-foreground/80">
            Full editing capabilities, detailed activity tracking, persistent stats, and more Time Capsule options are under development. Your current stats are for demonstration. Stay tuned!
          </AlertDescription>
        </Alert>
      </div>
    </TooltipProvider>
  );
}
