
"use client";

import { useState } from 'react';
import { CreatePostForm } from './components/CreatePostForm';
import { PostCard } from './components/PostCard';
import type { Post } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { SearchIcon, FilterIcon, MessagesSquare, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon for Story
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card and CardContent
import { StoryBubble } from './components/StoryBubble';
import { Separator } from '@/components/ui/separator';

// Mock data for stories
interface MockStory {
  id: string;
  username: string;
  avatarUrl: string;
  hasUnread: boolean;
}

const mockStories: MockStory[] = [
  { id: "user1", username: "Alice", avatarUrl: "https://placehold.co/64x64.png?text=A", hasUnread: true },
  { id: "user2", username: "BobCoder", avatarUrl: "https://placehold.co/64x64.png?text=BC", hasUnread: true },
  { id: "user3", username: "TechGuru", avatarUrl: "https://placehold.co/64x64.png?text=TG", hasUnread: false },
  { id: "user4", username: "DesignerDee", avatarUrl: "https://placehold.co/64x64.png?text=DD", hasUnread: true },
  { id: "user5", username: "SamLearns", avatarUrl: "https://placehold.co/64x64.png?text=SL", hasUnread: false },
  { id: "user6", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", hasUnread: true },
];


export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  const handlePostCreate = (newPostData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>) => {
    const newPost: Post = {
      ...newPostData,
      id: String(Date.now()),
      userName: 'CurrentUser', 
      userAvatar: 'https://placehold.co/40x40.png?text=CU', 
      likes: 0,
      commentsCount: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * 48, 
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    toast({
      title: "Post Created!",
      description: "Your post has been added to the feed.",
      variant: "default",
    });
  };

  const handleStoryClick = (username?: string) => {
    toast({
      title: "Stories Feature",
      description: `${username ? username + "'s story" : "Adding/Viewing stories"} coming soon!`,
    });
  };


  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-2 md:px-4 lg:px-6">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-3">Community Feed</h1>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto">
            Share notes, ask questions, and connect with fellow learners. Posts vanish after 48 hours!
          </p>
        </header>

        {/* Stories Bar */}
        <Card className="mb-8 shadow-sm">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-lg font-semibold flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-primary" /> Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <StoryBubble 
                username="CurrentUser" 
                avatarUrl="https://placehold.co/64x64.png?text=Me" 
                isAddStory 
                onClick={() => handleStoryClick()}
              />
              {mockStories.map(story => (
                <StoryBubble 
                  key={story.id}
                  username={story.username}
                  avatarUrl={story.avatarUrl}
                  hasUnread={story.hasUnread}
                  onClick={() => handleStoryClick(story.username)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="max-w-2xl mx-auto mb-10">
          <CreatePostForm onPostCreate={handlePostCreate} />
        </div>
        
        <Separator className="my-8"/>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Tooltip>
              <TooltipTrigger asChild className="relative flex-grow">
                <div className="w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search posts..." className="pl-10" disabled />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search functionality coming soon!</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild className="w-full sm:w-[180px]">
                <div> 
                  <Select defaultValue="latest" disabled>
                    <SelectTrigger className="w-full">
                      <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtering options coming soon!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts.length === 0 && (
            <Card className="text-center py-10 shadow-sm bg-card">
              <CardContent className="flex flex-col items-center gap-4">
                <MessagesSquare className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-xl font-medium text-card-foreground">It's quiet in here...</p>
                <p className="text-sm text-muted-foreground">
                  No posts yet. Why not be the first to share something?
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
