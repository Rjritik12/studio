
"use client"; 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit3, Clock, AlertCircle, LogIn, Loader2, LogOut, CreditCard, Archive, SettingsIcon as ProfileSettingsIcon } from "lucide-react"; 
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


export default function MyAccountPage() { 
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [mockSubscriptionEndDate, setMockSubscriptionEndDate] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempBio, setTempBio] = useState('');
  
  const [mockAccountStats, setMockAccountStats] = useState({
    timeCapsulesUsed: 1,
    timeCapsulesLimit: 3,
    messagingStatus: "Free Trial Active", 
  });

  useEffect(() => {
    if (!loading && !user) {
       router.push('/login?redirect=/profile'); 
    }
    const today = new Date();
    const trialEndDate = new Date(today.setDate(today.getDate() + (30 - (Math.floor(Math.random() * 15))))); 
    setMockSubscriptionEndDate(trialEndDate.toLocaleDateString());

    if (user) {
      setTempDisplayName(user.displayName || user.email?.split('@')[0] || "EduVerse User");
      // For a real app, you'd fetch and set the user's bio from your backend here
      setTempBio(localStorage.getItem(`userBio_${user.uid}`) || 'I am an avid learner exploring EduVerse!'); 
      setMockAccountStats(prev => ({
        ...prev,
      }));
    }

  }, [user, loading, router]);

  const handleEditProfileOpen = () => {
    if (user) {
      setTempDisplayName(user.displayName || user.email?.split('@')[0] || "EduVerse User");
      setTempBio(localStorage.getItem(`userBio_${user.uid}`) || 'I am an avid learner exploring EduVerse!');
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveChanges = (e: FormEvent) => {
    e.preventDefault();
    if(user) {
      // Mock save action: In a real app, call an updateProfile function from AuthContext or an API.
      // For now, we can update a local display name if needed.
      // For the bio, we'll use localStorage for this mock.
      localStorage.setItem(`userBio_${user.uid}`, tempBio);
      
      // To update display name in Firebase, you'd use updateProfile(auth.currentUser, { displayName: tempDisplayName })
      // This requires re-authentication for recent logins sometimes.
      // For this mock, we'll just update the state to reflect immediately in UI.
      if (user && user.displayName !== tempDisplayName) {
          // This is a visual mock update for the current session.
          // A real Firebase updateProfile would be needed.
          // The AuthContext's user object might not reflect this immediately without a new auth state change.
          const updatedUser = { ...user, displayName: tempDisplayName };
          // If you have a setUser in AuthContext exposed, you might call it. Otherwise, this is local.
      }
       toast({
        title: "Profile Updated!",
        description: "Your changes have been mocked successfully. Display name updates require re-login or full Firebase integration to persist across sessions.",
        variant: "default"
      });
    }
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
            You need to be logged in to manage your account.
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
  
  const currentDisplayName = tempDisplayName || user.displayName || user.email?.split('@')[0] || "EduVerse User";
  const displayEmail = user.email || "No email provided";
  const avatarUrl = user.photoURL || `https://placehold.co/128x128.png?text=${currentDisplayName.substring(0,1).toUpperCase()}`;
  const joinDateDisplay = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A";
  const currentBio = tempBio || localStorage.getItem(`userBio_${user.uid}`) || 'I am an avid learner exploring EduVerse!';


  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="text-center mb-12">
          <ProfileSettingsIcon className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">My Account & Settings</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Manage your profile information and account settings.
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-xl">
            <CardHeader className="items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={avatarUrl} alt={currentDisplayName} data-ai-hint="profile picture"/>
                <AvatarFallback className="text-4xl">{currentDisplayName.substring(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">{currentDisplayName}</CardTitle>
              <CardDescription>{displayEmail}</CardDescription>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleEditProfileOpen}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile Details
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-medium">{joinDateDisplay}</p>
              </div>
              <Separator/>
              <div>
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="font-medium whitespace-pre-wrap">{currentBio || "No bio set."}</p>
              </div>
               <Separator />
              <div className="p-3 bg-foreground/5 rounded-md shadow-sm">
                <p className="font-medium flex items-center text-base mb-1">
                  <CreditCard className="mr-2 h-5 w-5 text-primary"/>Messaging
                </p>
                <p className="text-primary font-semibold">{mockAccountStats.messagingStatus}</p>
                {mockAccountStats.messagingStatus === "Free Trial Active" && <p className="text-xs text-muted-foreground">(Ends {mockSubscriptionEndDate})</p>}
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
                  <span className="font-semibold">{mockAccountStats.timeCapsulesUsed} / {mockAccountStats.timeCapsulesLimit} <span className="text-xs text-muted-foreground">this month</span></span>
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
        
            <Alert variant="default" className="bg-primary/10 border-primary/30">
                <ProfileSettingsIcon className="h-5 w-5 text-primary" />
                <AlertTitle className="font-headline text-primary">Account Management</AlertTitle>
                <AlertDescription className="text-foreground/80">
                    This page is for managing your account details and settings. For your public profile, achievements, and posts, please visit your public profile page.
                </AlertDescription>
            </Alert>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Edit Your Profile Details</DialogTitle>
            <DialogDescription>
              Update your display name and bio. (Bio changes are mock-saved locally)
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
                <p className="text-xs text-muted-foreground">Note: Full persistence of display name requires Firebase backend update.</p>
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
