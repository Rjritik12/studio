
"use client"; // Make this a client component to use hooks

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit3, Clock, AlertCircle, LogIn, Loader2, LogOut, CreditCard, Archive, Rss, UserCircle as SettingsIcon, BadgePercent, ShieldCheck, Star, BarChartHorizontal } from "lucide-react"; // Re-added profile icons
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext"; 
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/lib/types";
import { PostCard } from "@/app/feed/components/PostCard";


export default function MyAccountPage() { 
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [mockSubscriptionEndDate, setMockSubscriptionEndDate] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempBio, setTempBio] = useState('');
  
  const [mockUserStats, setMockUserStats] = useState({
    xp: 0,
    level: 0,
    badges: [] as string[],
    postsCount: 0, 
    timeCapsulesUsed: 1,
    timeCapsulesLimit: 3,
    messagingStatus: "Free Trial Active", 
  });
  const [mockUserPosts, setMockUserPosts] = useState<Post[]>([]);


  useEffect(() => {
    if (!loading && !user) {
      // router.push('/login?redirect=/profile'); 
    }
    const today = new Date();
    const trialEndDate = new Date(today.setDate(today.getDate() + (30 - (Math.floor(Math.random() * 15))))); 
    setMockSubscriptionEndDate(trialEndDate.toLocaleDateString());

    if (user) {
      const currentUserName = user.displayName || user.email?.split('@')[0] || "EduVerse User";
      const currentUserAvatar = user.photoURL || `https://placehold.co/40x40.png?text=${currentUserName.substring(0,1).toUpperCase()}`;

      setTempDisplayName(currentUserName);
      // tempBio can remain empty or be fetched if available in future
      const generatedPosts: Post[] = [
        {
          id: `my-post1-${currentUserName}`,
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          content: "This is a mock post from my profile! Thinking about learning Next.js advanced patterns today.",
          type: 'note',
          likes: Math.floor(Math.random() * 10) + 5,
          commentsCount: Math.floor(Math.random() * 3),
          createdAt: Date.now() - Math.floor(Math.random() * 5 * 3600000), 
          expiresAt: Date.now() + (48 * 3600000) - Math.floor(Math.random() * 5 * 3600000), 
        },
        {
          id: `my-post2-${currentUserName}`,
          userName: currentUserName,
          userAvatar: currentUserAvatar,
          content: "Any recommendations for good TypeScript resources? (Viewed from my profile page).",
          type: 'question',
          likes: Math.floor(Math.random() * 15) + 2,
          commentsCount: Math.floor(Math.random() * 4) + 1,
          createdAt: Date.now() - Math.floor(Math.random() * 10 * 3600000), 
          expiresAt: Date.now() + (48 * 3600000) - Math.floor(Math.random() * 10 * 3600000),
        },
      ];
      const activePosts = generatedPosts.filter(post => post.expiresAt > Date.now());
      setMockUserPosts(activePosts);

      setMockUserStats(prev => ({
        ...prev,
        xp: Math.floor(Math.random() * 1500) + 200,
        level: Math.floor(Math.random() * 8) + 2,
        badges: ["Early Adopter", "Quiz Starter"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1),
        postsCount: activePosts.length,
      }));

    }

  }, [user, loading, router]);

  const handleEditProfileOpen = () => {
    if (user) {
      setTempDisplayName(user.displayName || user.email?.split('@')[0] || "EduVerse User");
      setTempBio(''); 
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated!",
      description: "Your changes have been mocked successfully.",
      variant: "default"
    });
    setIsEditDialogOpen(false);
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
  const joinDateDisplay = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A";

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="text-center mb-12">
          <SettingsIcon className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">My Profile & Settings</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Manage your profile information, view your stats, and account settings.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Profile Details & Actions */}
          <Card className="lg:col-span-1 shadow-xl">
            <CardHeader className="items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="profile picture"/>
                <AvatarFallback className="text-4xl">{displayName.substring(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">{tempDisplayName || displayName}</CardTitle>
              <CardDescription>{displayEmail}</CardDescription>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleEditProfileOpen}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium">{joinDateDisplay}</p>
              </div>
               <Separator />
              <div className="p-3 bg-foreground/5 rounded-md shadow-sm">
                <p className="font-medium flex items-center text-base mb-1">
                  <CreditCard className="mr-2 h-5 w-5 text-primary"/>Messaging
                </p>
                <p className="text-primary font-semibold">{mockUserStats.messagingStatus}</p>
                {mockUserStats.messagingStatus === "Free Trial Active" && <p className="text-xs text-muted-foreground">(Ends {mockSubscriptionEndDate})</p>}
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

          {/* Right Column: Stats, Achievements, My Posts */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">My Stats &amp; Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
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
                        <h3 className="font-semibold text-lg mb-3 text-foreground">Activity Snapshot (Mock)</h3>
                         <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                            <li>Quizzes Completed: 12</li>
                            <li>Average Quiz Score: 82%</li>
                            <li>Battles Won: 7</li>
                            <li>Feed Posts Created: {mockUserStats.postsCount}</li>
                            <li>Study Sessions Joined: 4</li>
                        </ul>
                        <Image 
                            src="https://placehold.co/600x300.png" 
                            alt="Generic activity graph"
                            width={600}
                            height={300}
                            className="rounded-lg object-cover aspect-[2/1] w-full mt-3"
                            data-ai-hint="user activity chart" 
                        />
                        <p className="text-xs text-muted-foreground text-center mt-2">Detailed activity tracking is illustrative.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-xl w-full">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <Rss className="mr-2 h-5 w-5 text-primary" /> My Active Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockUserPosts.length > 0 ? (
                  mockUserPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                   <p className="text-sm text-muted-foreground text-center py-4">You have no active posts. Create one on the Feed page!</p>
                )}
                 <Alert variant="default" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700 mt-4">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">Mock Posts Displayed</AlertTitle>
                  <AlertDescription className="text-amber-700/90 dark:text-amber-300/90 mt-1">
                    The posts above are for demonstration purposes. Actual posts are managed on the Feed page. This section will display your real active posts once backend integration is complete.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

          </div>
        </div>
        
        <Alert variant="default" className="mt-10 max-w-3xl mx-auto bg-primary/10 border-primary/30">
          <BarChartHorizontal className="h-5 w-5 text-primary" />
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
    
