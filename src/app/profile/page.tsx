
"use client"; // Make this a client component to use hooks

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Edit3, ShieldCheck, Star, Clock, AlertCircle, LogIn, Loader2, LogOut, CreditCard, Archive, Rss, BarChartHorizontal } from "lucide-react"; // Changed BarChartHorizontalShorthand
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";


export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [mockSubscriptionEndDate, setMockSubscriptionEndDate] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempBio, setTempBio] = useState('');


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
  
  const mockActivityData = {
    quizzesCompleted: 15,
    averageQuizScore: 78,
    battlesWon: 5,
    feedPosts: 3,
    studySessions: 8,
  };


  useEffect(() => {
    if (!loading && !user) {
      // router.push('/login?redirect=/profile'); 
    }
    const today = new Date();
    const trialEndDate = new Date(today.setDate(today.getDate() + (30 - (Math.floor(Math.random() * 15))))); 
    setMockSubscriptionEndDate(trialEndDate.toLocaleDateString());

    if (user) {
      setTempDisplayName(user.displayName || user.email?.split('@')[0] || "EduVerse User");
      // tempBio can remain empty or be fetched if available in future
    }

  }, [user, loading, router]);

  const handleEditProfileOpen = () => {
    if (user) {
      setTempDisplayName(user.displayName || user.email?.split('@')[0] || "EduVerse User");
      setTempBio(''); // Reset or load actual bio if available
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you'd save tempDisplayName and tempBio here
    toast({
      title: "Profile Updated!",
      description: "Your changes have been mocked successfully.",
      variant: "default"
    });
    setIsEditDialogOpen(false);
    // Optionally, update the user context or local state if you want the name change to reflect immediately
    // For this mock, we'll just close the dialog.
  };


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
              <CardTitle className="font-headline text-2xl">{tempDisplayName || displayName}</CardTitle> {/* Show tempDisplayName if edited */}
              <CardDescription>{displayEmail}</CardDescription>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleEditProfileOpen}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
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
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="font-headline text-lg flex items-center"><BarChartHorizontal className="mr-2 h-5 w-5 text-accent" />Activity Snapshot</CardTitle> {/* Changed BarChartHorizontalShorthand */}
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-foreground/5 rounded-md">
                        <span className="text-muted-foreground">Quizzes Completed:</span>
                        <span className="font-semibold text-foreground">{mockActivityData.quizzesCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-foreground/5 rounded-md">
                        <span className="text-muted-foreground">Average Quiz Score:</span>
                        <span className="font-semibold text-foreground">{mockActivityData.averageQuizScore}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-foreground/5 rounded-md">
                        <span className="text-muted-foreground">Battles Won:</span>
                        <span className="font-semibold text-foreground">{mockActivityData.battlesWon}</span>
                    </div>
                     <div className="flex justify-between items-center p-2 bg-foreground/5 rounded-md">
                        <span className="text-muted-foreground">Feed Posts Created:</span>
                        <span className="font-semibold text-foreground">{mockActivityData.feedPosts}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-foreground/5 rounded-md">
                        <span className="text-muted-foreground">AI Study Sessions:</span>
                        <span className="font-semibold text-foreground">{mockActivityData.studySessions}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center pt-2">Detailed activity history coming soon!</p>
                </CardContent>
              </Card>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Edit Your Profile</DialogTitle>
            <DialogDescription>
              Make changes to your public profile. (Mock functionality)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveChanges}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={tempDisplayName}
                  onChange={(e) => setTempDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Changes (Mock)</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </TooltipProvider>
  );
}
    

    
