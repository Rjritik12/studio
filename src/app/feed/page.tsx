
"use client";

import { useState } from 'react';
import { CreatePostForm } from './components/CreatePostForm';
import { PostCard } from './components/PostCard';
import type { Post } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { SearchIcon, FilterIcon, MessagesSquare, Image as ImageIconLucide } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StoryBubble } from './components/StoryBubble';
import { Separator } from '@/components/ui/separator';
import { StoryViewer, type StoryItem } from './components/StoryViewer'; // Import StoryViewer and StoryItem

// Mock data for stories
interface MockStory extends StoryItem {
  hasUnread: boolean;
}

const mockStoriesData: MockStory[] = [
  { id: "user1", username: "Alice", avatarUrl: "https://placehold.co/64x64.png?text=A", storyImageUrl: "https://placehold.co/360x640.png?text=Alice's+Story+1", hasUnread: true },
  { id: "user1-2", username: "Alice", avatarUrl: "https://placehold.co/64x64.png?text=A", storyImageUrl: "https://placehold.co/360x640.png?text=Alice's+Story+2", hasUnread: true },
  { id: "user2", username: "BobCoder", avatarUrl: "https://placehold.co/64x64.png?text=BC", storyImageUrl: "https://placehold.co/360x640.png?text=Bob's+Story", hasUnread: true },
  { id: "user3", username: "TechGuru", avatarUrl: "https://placehold.co/64x64.png?text=TG", storyImageUrl: "https://placehold.co/360x640.png?text=TechGuru's+Story", hasUnread: false },
  { id: "user4", username: "DesignerDee", avatarUrl: "https://placehold.co/64x64.png?text=DD", storyImageUrl: "https://placehold.co/360x640.png?text=Dee's+Story", hasUnread: true },
  { id: "user5", username: "SamLearns", avatarUrl: "https://placehold.co/64x64.png?text=SL", storyImageUrl: "https://placehold.co/360x640.png?text=Sam's+Story", hasUnread: false },
  { id: "user6", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", storyImageUrl: "https://placehold.co/360x640.png?text=Eva's+Story+1", hasUnread: true },
  { id: "user6-2", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", storyImageUrl: "https://placehold.co/360x640.png?text=Eva's+Story+2", hasUnread: true },
  { id: "user6-3", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", storyImageUrl: "https://placehold.co/360x640.png?text=Eva's+Story+3", hasUnread: true },
];

// Group stories by username for the bubble display
const uniqueUserStories = mockStoriesData.reduce((acc, story) => {
  if (!acc.find(s => s.username === story.username)) {
    acc.push(story);
  }
  return acc;
}, [] as MockStory[]);


export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();
  
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storiesForViewer, setStoriesForViewer] = useState<StoryItem[]>([]);
  const [storyViewerStartIndex, setStoryViewerStartIndex] = useState(0);
  const [currentUserStoryGroupIndex, setCurrentUserStoryGroupIndex] = useState(-1);


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

  const handleAddStoryClick = () => {
     toast({
      title: "Stories Feature",
      description: "Adding your own story is coming soon!",
    });
  }

  const handleStoryBubbleClick = (username: string) => {
    const userStoryItems = mockStoriesData.filter(s => s.username === username);
    if (userStoryItems.length > 0) {
      setStoriesForViewer(userStoryItems);
      setStoryViewerStartIndex(0); // Start from the first story of that user
      setIsStoryViewerOpen(true);
      const groupIndex = uniqueUserStories.findIndex(s => s.username === username);
      setCurrentUserStoryGroupIndex(groupIndex);
    }
  };

  const handleStoryViewerClose = () => {
    setIsStoryViewerOpen(false);
    setStoriesForViewer([]);
    setCurrentUserStoryGroupIndex(-1);
  };
  
  const navigateStorySet = (direction: 'next' | 'prev') => {
    let nextGroupIndex = currentUserStoryGroupIndex + (direction === 'next' ? 1 : -1);

    // Cycle through unique users
    if (nextGroupIndex >= uniqueUserStories.length) {
      nextGroupIndex = 0; 
    } else if (nextGroupIndex < 0) {
      nextGroupIndex = uniqueUserStories.length - 1;
    }
    
    if (nextGroupIndex === currentUserStoryGroupIndex && uniqueUserStories.length ===1) { // only one user, close
         handleStoryViewerClose();
         return;
    }


    if (uniqueUserStories[nextGroupIndex]) {
      const nextUsername = uniqueUserStories[nextGroupIndex].username;
      const nextUserStories = mockStoriesData.filter(s => s.username === nextUsername);
      if (nextUserStories.length > 0) {
        setStoriesForViewer(nextUserStories);
        setStoryViewerStartIndex(0);
        setCurrentUserStoryGroupIndex(nextGroupIndex);
        // setIsStoryViewerOpen(true); // Viewer is already open
      } else {
        handleStoryViewerClose(); // No stories for next/prev user, close
      }
    } else {
      handleStoryViewerClose(); // Should not happen if logic is correct
    }
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

        <Card className="mb-8 shadow-sm">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-lg font-semibold flex items-center">
                <ImageIconLucide className="h-5 w-5 mr-2 text-primary" /> Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <StoryBubble 
                username="CurrentUser" 
                avatarUrl="https://placehold.co/64x64.png?text=Me" 
                isAddStory 
                onClick={handleAddStoryClick}
              />
              {uniqueUserStories.map(story => (
                <StoryBubble 
                  key={story.id} // Use a unique ID from the first story of the user
                  username={story.username}
                  avatarUrl={story.avatarUrl}
                  hasUnread={story.hasUnread}
                  onClick={() => handleStoryBubbleClick(story.username)}
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
      
      {isStoryViewerOpen && storiesForViewer.length > 0 && (
        <StoryViewer
          isOpen={isStoryViewerOpen}
          onClose={handleStoryViewerClose}
          stories={storiesForViewer}
          startIndex={storyViewerStartIndex}
          onNextStorySet={() => navigateStorySet('next')}
          onPrevStorySet={() => navigateStorySet('prev')}
        />
      )}
    </TooltipProvider>
  );
}
