
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Star, ShieldCheck, UserCheck, BarChartHorizontal, UserPlus, MessageSquare, Rss, AlertCircle, Edit3 } from "lucide-react"; 
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
  // Use a consistent placeholder URL or derive from username if no authUser photoURL is available
  const profileAvatarUrl = `https://placehold.co/128x128.png?text=${avatarFallback}`;
  
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
      postsCount: activePosts.length + Math.floor(Math.random() * 10),
      followersCount: Math.floor(Math.random() * 700) + 50,
      followingCount: Math.floor(Math.random() * 300) + 20,
    });
    setIsFollowing(Math.random() < 0.3); // Randomly follow some users for demo

  }, [username, profileAvatarUrl]);


  const handleFollowToggle = () => {
     if (authLoading) return;
    if (!authUser) {
      toast({ title: "Login Required", description: "Please log in to follow users.", variant: "destructive" });
      return;
    }
    setIsFollowing(!isFollowing);
    toast({
      title: !isFollowing ? `Followed ${username}` : `Unfollowed ${username}`,
      description: !isFollowing ? `You are now following ${username}. (Prototype)` : `You are no longer following ${username}. (Prototype)`,
    });
  };
  

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-10">
        <UserCheck className="mx-auto h-12 w-12 md:h-16 md:w-16 text-primary mb-3" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3">{username}'s Profile</h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-xl mx-auto">
          Discover {username}'s contributions and achievements in EduVerse.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        <Card className="lg:col-span-1 shadow-xl">
          <CardHeader className="items-center text-center p-4 md:p-6">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-4 border-4 border-primary shadow-md">
              <AvatarImage src={profileAvatarUrl} alt={username} data-ai-hint="profile picture user" />
              <AvatarFallback className="text-3xl md:text-4xl">{avatarFallback}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-xl md:text-2xl">{username}</CardTitle>
            <CardDescription>Level {mockUserStats.level} EduVerse Explorer</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80 p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-around text-center mb-4 sm:gap-2">
              <div>
                <p className="font-bold text-base md:text-lg text-foreground">{mockUserStats.postsCount}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="font-bold text-base md:text-lg text-foreground">{mockUserStats.followersCount + (isFollowing && !isOwnPublicProfile ? 1 : 0)}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-bold text-base md:text-lg text-foreground">{mockUserStats.followingCount}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            <Separator className="my-3" />
            {isOwnPublicProfile ? (
                 <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile">
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Your Profile & Settings
                    </Link>
                </Button>
            ) : authUser && !authLoading ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleFollowToggle} className="flex-1">
                  {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href={`/messages/${encodeURIComponent(username)}`}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                  </Link>
                </Button>
              </div>
            ) : !authLoading && !authUser ? (
                 <p className="text-xs text-center text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline">Login</Link> to follow or message {username}.
                </p>
            ) : null }
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-lg md:text-xl flex items-center"><BarChartHorizontal className="mr-2 h-5 w-5 text-primary" /> Stats & Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div className="p-3 md:p-4 bg-foreground/5 rounded-lg">
                    <Star className="h-8 w-8 md:h-10 md:w-10 text-accent mx-auto mb-1" />
                    <p className="text-xl md:text-2xl font-bold text-foreground">{mockUserStats.xp} XP</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Level {mockUserStats.level}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-foreground/5 rounded-lg">
                    <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-accent mx-auto mb-1" />
                    <p className="text-xl md:text-2xl font-bold text-foreground">{mockUserStats.badges.length} Badges</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Collected</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-2 text-foreground">Badges Earned:</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUserStats.badges.map(badge => (
                      <span key={badge} className="px-2.5 py-1 text-xs md:text-sm rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                        <BadgePercent className="h-3.5 w-3.5"/> {badge}
                      </span>
                    ))}
                    {mockUserStats.badges.length === 0 && <p className="text-xs md:text-sm text-muted-foreground">No badges earned yet.</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

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
                <Alert variant="default" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700 mt-4">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">Mock Posts Displayed</AlertTitle>
                  <AlertDescription className="text-amber-700/90 dark:text-amber-300/90 mt-1">
                    The posts above are for demonstration purposes. Displaying {username}'s actual recent posts requires backend integration for persistent post storage. This feature is planned for future updates!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
        </div>
      </div>
      
      <Alert variant="default" className="mt-8 md:mt-10 max-w-2xl mx-auto bg-primary/10 border-primary/30">
        <UserCheck className="h-5 w-5 text-primary" /> 
        <AlertTitle className="font-headline text-primary">Public Profile View</AlertTitle>
        <AlertDescription className="text-foreground/80">
          This is {username}'s public profile. More interactive features and user-specific content are planned for future updates.
        </AlertDescription>
      </Alert>
    </div>
  );
}

