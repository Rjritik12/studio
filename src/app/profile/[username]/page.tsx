
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgePercent, Star, ShieldCheck, UserCheck, BarChart3, UserPlus, MessageSquare, Rss, AlertCircle, BarChartHorizontal } from "lucide-react"; // Added BarChartHorizontal
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
  const { user: authUser } = useAuth();
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(false);
  const [mockUserStats, setMockUserStats] = useState({
    xp: 0,
    level: 0,
    badges: [] as string[],
    joinDate: new Date().toLocaleDateString(),
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [mockUserPosts, setMockUserPosts] = useState<Post[]>([]);

  const avatarFallback = username.substring(0, 1).toUpperCase();
  const avatarUrl = `https://placehold.co/128x128.png?text=${avatarFallback}`;
  
  const isOwnPublicProfile = authUser && (authUser.displayName === username || authUser.email?.split('@')[0] === username);

  useEffect(() => {
    const generatedPosts: Post[] = [
      {
        id: `post1-profile-${username}`,
        userName: username,
        userAvatar: avatarUrl,
        content: `Hello from ${username}'s profile! Just sharing a quick note about my studies today. Focused on astrophysics! ✨`,
        type: 'note',
        likes: Math.floor(Math.random() * 50),
        commentsCount: Math.floor(Math.random() * 10),
        createdAt: Date.now() - Math.floor(Math.random() * 24 * 3600000), 
        expiresAt: Date.now() + (48 * 3600000) - Math.floor(Math.random() * 24 * 3600000), 
      },
      {
        id: `post2-profile-${username}`,
        userName: username,
        userAvatar: avatarUrl,
        content: `Check out this interesting article I found on quantum computing. (Viewed from ${username}'s profile page). What are your thoughts?`,
        type: 'link',
        linkUrl: 'https://example.com/quantum-article-profile',
        likes: Math.floor(Math.random() * 30),
        commentsCount: Math.floor(Math.random() * 5),
        createdAt: Date.now() - Math.floor(Math.random() * 48 * 3600000), 
        expiresAt: Date.now() + (48 * 3600000) - Math.floor(Math.random() * 48 * 3600000),
      },
    ];
    const activePosts = generatedPosts.filter(post => post.expiresAt > Date.now());
    setMockUserPosts(activePosts);

    setMockUserStats({
      xp: Math.floor(Math.random() * 2000) + 500,
      level: Math.floor(Math.random() * 10) + 3,
      badges: ["Quiz Enthusiast", "Active Learner", "Community Helper"].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1),
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
      postsCount: activePosts.length + Math.floor(Math.random() * 5), // Add some random older posts count
      followersCount: Math.floor(Math.random() * 500),
      followingCount: Math.floor(Math.random() * 200),
    });
    setIsFollowing(false); // Reset follow state on profile change

  }, [username, avatarUrl]);


  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: !isFollowing ? `Followed ${username}` : `Unfollowed ${username}`,
      description: !isFollowing ? `You are now following ${username}. (Prototype)` : `You are no longer following ${username}. (Prototype)`,
    });
  };
  

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <UserCheck className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">{username}'s Profile</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Viewing the public profile of {username}.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
            <div className="flex justify-around text-center mb-4">
              <div>
                <p className="font-bold text-lg text-foreground">{mockUserStats.postsCount}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{mockUserStats.followersCount}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{mockUserStats.followingCount}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            <p>Joined: {mockUserStats.joinDate}</p>
            <Separator className="my-4" />
            {!isOwnPublicProfile && authUser && (
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
            )}
             {!authUser && (
                <p className="text-xs text-center text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline">Login</Link> to follow or message.
                </p>
            )}
            {isOwnPublicProfile && (
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Your Profile & Settings
                </Link>
              </Button>
            )}
            <Separator className="my-4" />
            <p className="text-muted-foreground text-xs">This is {username}'s public profile. Information shared here is visible to other EduVerse users.</p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Stats & Achievements</CardTitle>
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
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Activity Overview</h3>
                   <Image 
                    src="https://placehold.co/600x300.png" 
                    alt="Generic activity graph"
                    width={600}
                    height={300}
                    className="rounded-lg object-cover aspect-[2/1] w-full"
                    data-ai-hint="user activity chart" 
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">Detailed activity tracking is illustrative.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl w-full">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <Rss className="mr-2 h-5 w-5 text-primary" /> Recent Posts by {username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
      
      <Alert variant="default" className="mt-10 max-w-2xl mx-auto bg-primary/10 border-primary/30">
        <BarChartHorizontal className="h-5 w-5 text-primary" /> {/* Corrected Icon */}
        <AlertTitle className="font-headline text-primary">Public Profile View</AlertTitle>
        <AlertDescription className="text-foreground/80">
          This is a public profile. More interactive features and user-specific content are planned for future updates.
        </AlertDescription>
      </Alert>
    </div>
  );
}

