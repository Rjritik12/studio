
"use client"; // Make this a client component to use hooks

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Edit3, ShieldCheck, Star, Clock, AlertCircle, LogIn, Loader2, LogOut, CreditCard, Archive, Rss } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mockSubscriptionEndDate, setMockSubscriptionEndDate] = useState('');

  // Mock data (will be overridden by auth user if available)
  const mockUserStats = {
    xp: 1250,
    level: 8,
    badges: ["Quiz Master", "Streak King", "Study Buddy"],
    timeCapsulesUsed: 1,
    timeCapsulesLimit: 3,
    joinDate: "January 1, 2024", 
    messagingStatus: "Free Trial Active", 
  };

  useEffect(() => {
    if (!loading && !user) {
      // router.push('/login?redirect=/profile'); 
    }
    const today = new Date();
    const trialEndDate = new Date(today.setDate(today.getDate() + (30 - (Math.floor(Math.random() * 15))))); 
    setMockSubscriptionEndDate(trialEndDate.toLocaleDateString());
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
  
  const displayName = user.displayName || user.email?.split('@')[0] || "EduVerse User";
  const displayEmail = user.email || "No email provided";
  const avatarUrl = user.photoURL || `https://placehold.co/128x128.png?text=${displayName.substring(0,1).toUpperCase()}`;
  const joinDate = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : mockUserStats.joinDate;

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
            <CardContent className="text-sm text-foreground/80 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium">{joinDate}</p>
              </div>
              
              <div className="p-3 bg-foreground/5 rounded-md shadow-sm">
                <p className="font-medium flex items-center text-base mb-1">
                  <CreditCard className="mr-2 h-5 w-5 text-primary"/>Messaging
                </p>
                <p className="text-primary font-semibold">{mockUserStats.messagingStatus}</p>
                {mockUserStats.messagingStatus === "Free Trial Active" && <p className="text-xs text-muted-foreground">(Ends {mockSubscriptionEndDate})</p>}
                {mockUserStats.messagingStatus === "Premium Active" && <p className="text-xs text-muted-foreground">(Renews {mockSubscriptionEndDate})</p>}
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-primary text-xs mt-1.5" disabled>
                            Manage Subscription
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Subscription management coming soon!</p></TooltipContent>
                </Tooltip>
              </div>

              <div className="p-3 bg-foreground/5 rounded-md shadow-sm">
                <p className="font-medium flex items-center text-base mb-1">
                    <Archive className="mr-2 h-5 w-5 text-primary"/>Time Capsules
                </p>
                <div className="flex items-center justify-between">
                  <span>Usage:</span>
                  <span className="font-semibold">{mockUserStats.timeCapsulesUsed} / {mockUserStats.timeCapsulesLimit} <span className="text-xs text-muted-foreground">this month</span></span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-primary text-xs mt-1.5" disabled>Purchase More</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Feature coming soon!</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
               <Button onClick={logout} variant="outline" className="w-full mt-3">
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

        <Card className="mt-8 shadow-xl w-full">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <Rss className="mr-2 h-5 w-5 text-primary" /> My Active Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">Feature in Development</AlertTitle>
              <AlertDescription className="text-amber-700/90 dark:text-amber-300/90 mt-1">
                Displaying your active posts here requires backend integration for persistent post storage. This feature is planned for future updates! You can see your newly created posts on the Community Feed, and they will expire after 48 hours.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

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

    