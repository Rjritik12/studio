
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Star, ShieldCheck, UserCheck, MessageSquare, UserPlus, Rss, Edit3, MoreHorizontal, ArrowLeft } from "lucide-react"; 
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { PostCard } from "@/app/feed/components/PostCard";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";


export default function UserProfilePage() {
  const params = useParams();
  const username = typeof params.username === 'string' ? decodeURIComponent(params.username) : "User";
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(false);
  const [mockUserStats, setMockUserStats] = useState({
    xp: 0,
    level: 0,
    badges: [] as string[],
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [mockUserPosts, setMockUserPosts] = useState<Post[]>([]);

  const avatarFallback = username.substring(0, 1).toUpperCase();
  const profileAvatarUrl = (authUser?.photoURL && (authUser.displayName === username || authUser.email?.split('@')[0] === username))
                           ? authUser.photoURL 
                           : `https://placehold.co/96x96.png?text=${avatarFallback}`; 
  
  const currentDisplayName = (authUser && (authUser.displayName === username || authUser.email?.split('@')[0] === username))
                           ? authUser.displayName || username
                           : username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 

  const isOwnPublicProfile = authUser && (authUser.displayName === username || authUser.email?.split('@')[0] === username);
  
  useEffect(() => {
    const generatedPosts: Post[] = [
      {
        id: `post1-public-profile-${username}`,
        userName: username,
        userAvatar: profileAvatarUrl, 
        content: `This is a mock post from ${username}'s public profile! Exploring new study techniques.`,
        type: 'note',
        likes: Math.floor(Math.random() * 70) + 5,
        commentsCount: Math.floor(Math.random() * 15) + 2,
        createdAt: Date.now() - Math.floor(Math.random() * 20 * 3600000), 
        expiresAt: Date.now() + (48 * 3600000) - Math.floor(Math.random() * 20 * 3600000), 
      },
      {
        id: `post2-public-profile-${username}`,
        userName: username,
        userAvatar: profileAvatarUrl, 
        content: `Sharing a cool link I found about space exploration, viewed from ${username}'s profile.`,
        type: 'link',
        linkUrl: 'https://example.com/space-exploration-profile',
        likes: Math.floor(Math.random() * 40) + 3,
        commentsCount: Math.floor(Math.random() * 8) + 1,
        createdAt: Date.now() - Math.floor(Math.random() * 40 * 3600000), 
        expiresAt: Date.now() + (48 * 3600000) - Math.floor(Math.random() * 40 * 3600000),
      },
    ];
    const activePosts = generatedPosts.filter(post => post.expiresAt > Date.now());
    setMockUserPosts(activePosts);

    setMockUserStats({
      xp: Math.floor(Math.random() * 2500) + 800,
      level: Math.floor(Math.random() * 12) + 5,
      badges: ["Quiz Master", "Avid Learner", "Top Contributor"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1),
      postsCount: Math.floor(Math.random() * 200) + 10, 
      followersCount: Math.floor(Math.random() * 3000) + 500, 
      followingCount: Math.floor(Math.random() * 1000) + 100, 
    });
    setIsFollowing(Math.random() < 0.3); 

  }, [username, profileAvatarUrl]);

  const handleFollowToggle = () => {
     if (authLoading) return;
    if (!authUser) {
      toast({ title: "Login Required", description: "Please log in to follow users.", variant: "destructive" });
      return;
    }
    setIsFollowing(!isFollowing);
    setMockUserStats(prev => ({
      ...prev,
      followersCount: isFollowing ? prev.followersCount -1 : prev.followersCount + 1
    }));
    toast({
      title: !isFollowing ? `Followed ${username}` : `Unfollowed ${username}`,
      description: !isFollowing ? `You are now following ${username}. (Prototype)` : `You are no longer following ${username}. (Prototype)`,
    });
  };
  
  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 md:px-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-headline text-base sm:text-lg font-semibold text-foreground text-center truncate px-2">
          {username}
        </h2>
        <Button variant="ghost" size="icon" aria-label="Options" disabled>
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
        <Card className="lg:col-span-1 shadow-lg">
          <CardContent className="p-3 sm:p-4 space-y-3">
            <div className="flex flex-row items-center gap-3 sm:gap-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-muted shadow-sm">
                <AvatarImage src={profileAvatarUrl} alt={username} data-ai-hint="user profile avatar"/>
                <AvatarFallback className="text-2xl sm:text-3xl">{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 justify-around items-center text-center">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">{mockUserStats.postsCount}</p>
                  <p className="text-xs text-muted-foreground">posts</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">{mockUserStats.followersCount}</p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">{mockUserStats.followingCount}</p>
                  <p className="text-xs text-muted-foreground">following</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-sm text-foreground">{currentDisplayName}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-headline text-md font-semibold text-primary">EduVerse Stats</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-foreground/5 rounded-lg">
                  <Star className="h-6 w-6 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{mockUserStats.xp} XP</p>
                  <p className="text-xs text-muted-foreground">Level {mockUserStats.level}</p>
                </div>
                <div className="p-2 bg-foreground/5 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-accent mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{mockUserStats.badges.length} Badges</p>
                  <p className="text-xs text-muted-foreground">Collected</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground mb-1.5">Badges Earned:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {mockUserStats.badges.map(badge => (
                    <span key={badge} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                      <BadgePercent className="h-3 w-3"/> {badge}
                    </span>
                  ))}
                  {mockUserStats.badges.length === 0 && <p className="text-xs text-muted-foreground">No badges yet.</p>}
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-row gap-2">
              {isOwnPublicProfile ? (
                 <Button variant="outline" className="flex-1 text-xs h-8" asChild>
                    <Link href="/profile"> Edit Profile</Link>
                </Button>
              ) : authUser && !authLoading ? (
                <>
                  <Button 
                    onClick={handleFollowToggle} 
                    className={cn(
                      "flex-1 text-xs h-8", 
                      isFollowing ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" asChild className="flex-1 text-xs h-8">
                    <Link href={`/messages/${encodeURIComponent(username)}`}>Message</Link>
                  </Button>
                </>
              ) : !authLoading && !authUser ? (
                 <p className="text-xs text-center text-muted-foreground w-full py-2">
                    <Link href="/login" className="text-primary hover:underline">Login</Link> to interact.
                </p>
              ) : null }
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <Card className="shadow-xl w-full"> 
              <CardHeader>
                <CardTitle className="font-headline text-lg md:text-xl flex items-center">
                  <Rss className="mr-2 h-5 w-5 text-primary" /> Recent Posts by {username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {mockUserPosts.length > 0 ? (
                  mockUserPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent active posts to display for {username} in this mock view.</p>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
      
      <Alert variant="default" className="mt-6 md:mt-8 lg:mt-10 max-w-2xl mx-auto bg-primary/10 border-primary/30">
        <UserCheck className="h-5 w-5 text-primary" /> 
        <AlertTitle className="font-headline text-primary">Public Profile View</AlertTitle>
        <AlertDescription className="text-foreground/80">
          This is {username}'s public profile. Social features like following, messaging, and posts are prototyped with mock data.
        </AlertDescription>
      </Alert>
    </div>
  );
}
    
