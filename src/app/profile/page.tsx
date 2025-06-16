
"use client"; 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit3, Clock, AlertCircle, LogIn, Loader2, LogOut, CreditCard, Archive, Settings2Icon, CameraIcon } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext"; 
import Link from "next/link";
import { useEffect, useState, type FormEvent, type ChangeEvent, useRef } from "react";
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

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (!loading && !user) {
       router.push('/login?redirect=/profile'); 
       return;
    }
    if (user) {
      const storedAvatar = localStorage.getItem(`userAvatar_${user.uid}`);
      if (storedAvatar) {
        setLocalAvatarUrl(storedAvatar);
      }
      setTempDisplayName(user.displayName || user.email?.split('@')[0] || "EduVerse User");
      setTempBio(localStorage.getItem(`userBio_${user.uid}`) || 'I am an avid learner exploring EduVerse!'); 
      
      const today = new Date();
      const trialEndDate = new Date(today.setDate(today.getDate() + (30 - (Math.floor(Math.random() * 15))))); 
      setMockSubscriptionEndDate(trialEndDate.toLocaleDateString());
      setMockAccountStats(prev => ({ ...prev }));
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
      localStorage.setItem(`userBio_${user.uid}`, tempBio);
      // Visual update for display name for this session; actual Firebase updateProfile needed for persistence
      // Potentially update user in AuthContext if a setter is exposed for displayName.
       toast({
        title: "Profile Details Updated!",
        description: "Bio has been saved locally. Display name update is visual for this session; full persistence requires backend integration.",
        variant: "default"
      });
    }
    setIsEditDialogOpen(false);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for profile pics
        toast({ title: "Image Too Large", description: "Please select an image under 2MB.", variant: "destructive" });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({ title: "Invalid File Type", description: "Please use JPG, PNG, GIF, or WEBP.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
        setSelectedImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleCancelImageChange = () => {
    setImagePreviewUrl(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleSaveImage = async () => {
    if (!selectedImageFile || !imagePreviewUrl) return;
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock upload
    if (user) {
      localStorage.setItem(`userAvatar_${user.uid}`, imagePreviewUrl);
      setLocalAvatarUrl(imagePreviewUrl);
    }
    setIsUploading(false);
    setImagePreviewUrl(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({ title: "Profile Picture Updated!", description: "Your new avatar has been (mock) saved.", variant: "default" });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This case is handled by useEffect redirect, but good for safety
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-headline">Access Denied</AlertTitle>
          <AlertDescription>
            You need to be logged in to manage your account. Redirecting to login...
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Display name and avatar logic now relies on user definitely existing due to checks above
  const currentDisplayNameToShow = tempDisplayName || user.displayName || user.email?.split('@')[0] || "EduVerse User";
  const displayEmail = user.email || "No email provided";
  const displayAvatarUrl = imagePreviewUrl || localAvatarUrl || user.photoURL || `https://placehold.co/128x128.png?text=${currentDisplayNameToShow.substring(0,1).toUpperCase()}`;
  const joinDateDisplay = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A";
  const currentBioToShow = tempBio || localStorage.getItem(`userBio_${user.uid}`) || 'I am an avid learner exploring EduVerse!';


  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="text-center mb-12">
          <Settings2Icon className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">My Account & Settings</h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Manage your profile information and account settings.
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-xl">
            <CardHeader className="items-center text-center">
              <div className="flex flex-col items-center gap-3 mb-3">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-md">
                  <AvatarImage src={displayAvatarUrl} alt={currentDisplayNameToShow} data-ai-hint="profile picture"/>
                  <AvatarFallback className="text-4xl">{currentDisplayNameToShow.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                {!imagePreviewUrl && !isUploading && (
                  <Button variant="outline" size="sm" onClick={triggerFileSelect} className="w-auto">
                    <CameraIcon className="mr-2 h-4 w-4" /> Change Picture
                  </Button>
                )}
                {imagePreviewUrl && !isUploading && (
                  <div className="flex gap-2 items-center">
                    <Button variant="default" size="sm" onClick={handleSaveImage}>
                      Save Picture
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancelImageChange}>
                      Cancel
                    </Button>
                  </div>
                )}
                 {isUploading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
              </div>
              
              <CardTitle className="font-headline text-2xl">{currentDisplayNameToShow}</CardTitle>
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
                <p className="font-medium whitespace-pre-wrap">{currentBioToShow || "No bio set."}</p>
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
                <Settings2Icon className="h-5 w-5 text-primary" />
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
              Update your display name and bio.
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </TooltipProvider>
  );
}
