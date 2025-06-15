
"use client";

import { useState, useEffect } from 'react';
import { CreatePostForm } from './components/CreatePostForm';
import { PostCard } from './components/PostCard';
import type { Post } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { SearchIcon, FilterIcon, MessagesSquare, Image as ImageIconLucide, User, Plus, StickyNote } from 'lucide-react';
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
import { StoryViewer, type StoryItem } from './components/StoryViewer';
import { CreateStoryDialog } from './components/CreateStoryDialog';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface MockStory extends StoryItem {
  hasUnread: boolean;
}

const initialMockStoriesData: MockStory[] = [
  { id: "user1_story1", username: "Alice", avatarUrl: "https://placehold.co/64x64.png?text=A", storyImageUrl: "https://placehold.co/360x640.png?text=Alice's+Story+1", hasUnread: true, duration: 7000 },
  { id: "user1_story2", username: "Alice", avatarUrl: "https://placehold.co/64x64.png?text=A", storyImageUrl: "https://placehold.co/360x640.png?text=Alice's+Story+2", hasUnread: true },
  { id: "user2_story1", username: "BobCoder", avatarUrl: "https://placehold.co/64x64.png?text=BC", storyImageUrl: "https://placehold.co/360x640.png?text=Bob's+Story", hasUnread: true },
  { id: "user3_story1", username: "TechGuru", avatarUrl: "https://placehold.co/64x64.png?text=TG", storyImageUrl: "https://placehold.co/360x640.png?text=TechGuru's+Story", hasUnread: false },
  { id: "user4_story1", username: "DesignerDee", avatarUrl: "https://placehold.co/64x64.png?text=DD", storyImageUrl: "https://placehold.co/360x640.png?text=Dee's+Story", hasUnread: true },
  { id: "user5_story1", username: "SamLearns", avatarUrl: "https://placehold.co/64x64.png?text=SL", storyImageUrl: "https://placehold.co/360x640.png?text=Sam's+Story", hasUnread: false },
  { id: "user6_story1", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", storyImageUrl: "https://placehold.co/360x640.png?text=Eva's+Story+1", hasUnread: true },
  { id: "user6_story2", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", storyImageUrl: "https://placehold.co/360x640.png?text=Eva's+Story+2", hasUnread: true },
  { id: "user6_story3", username: "EvaReads", avatarUrl: "https://placehold.co/64x64.png?text=ER", storyImageUrl: "https://placehold.co/360x640.png?text=Eva's+Story+3", hasUnread: true },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();

  const [mockStoriesData, setMockStoriesData] = useState<MockStory[]>(initialMockStoriesData);
  const [uniqueUserStories, setUniqueUserStories] = useState<MockStory[]>([]);
  
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storiesForViewer, setStoriesForViewer] = useState<StoryItem[]>([]);
  const [storyViewerStartIndex, setStoryViewerStartIndex] = useState(0);
  const [currentUserStoryGroupIndex, setCurrentUserStoryGroupIndex] = useState(-1);

  const [isCreateStoryDialogOpen, setIsCreateStoryDialogOpen] = useState(false);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);


  useEffect(() => {
    const usersWithStories = mockStoriesData.reduce((acc, story) => {
      if (!acc.find(s => s.username === story.username)) {
        const hasAnyUnread = mockStoriesData.some(s => s.username === story.username && s.hasUnread);
        acc.push({...story, hasUnread: hasAnyUnread});
      }
      return acc;
    }, [] as MockStory[]);
    setUniqueUserStories(usersWithStories);
  }, [mockStoriesData]);

  const handlePostCreate = (newPostData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>) => {
    const currentUserName = authUser?.displayName || authUser?.email?.split('@')[0] || "Anonymous";
    const currentUserAvatar = authUser?.photoURL || `https://placehold.co/40x40.png?text=${currentUserName.substring(0,1).toUpperCase()}`;

    const newPost: Post = {
      ...newPostData,
      id: String(Date.now()),
      userName: currentUserName, 
      userAvatar: currentUserAvatar, 
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
    if (authLoading) return;
    if (!authUser) {
      toast({
        title: "Login Required",
        description: "Please log in to add your story.",
        variant: "destructive",
      });
      return;
    }
    setIsCreateStoryDialogOpen(true);
  }

  const handleStoryBubbleClick = (username: string) => {
    const userStoryItems = mockStoriesData.filter(s => s.username === username);
    if (userStoryItems.length > 0) {
      setStoriesForViewer(userStoryItems);
      setStoryViewerStartIndex(0);
      setIsStoryViewerOpen(true);
      
      const currentAuthUserName = authUser ? (authUser.displayName || authUser.email?.split('@')[0] || "CurrentUser") : null;
      let orderedUniqueUserStoriesForIndex: MockStory[] = [];

      if (Array.isArray(uniqueUserStories)) {
          const currentUserOwnStory = currentAuthUserName ? uniqueUserStories.find(s => s.username === currentAuthUserName) : undefined;
          const otherUsersStories = uniqueUserStories.filter(s => s.username !== currentAuthUserName);
          if (currentUserOwnStory) {
              orderedUniqueUserStoriesForIndex = [currentUserOwnStory, ...otherUsersStories];
          } else {
              orderedUniqueUserStoriesForIndex = otherUsersStories;
          }
      }
      const groupIndex = orderedUniqueUserStoriesForIndex.findIndex(s => s.username === username);
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

    const currentAuthUserName = authUser ? (authUser.displayName || authUser.email?.split('@')[0] || "CurrentUser") : null;
    let displayableUniqueUserStories: MockStory[] = [];

    if (Array.isArray(uniqueUserStories)) {
        const currentUserOwnStory = currentAuthUserName ? uniqueUserStories.find(s => s.username === currentAuthUserName) : undefined;
        const otherUsersStories = uniqueUserStories.filter(s => s.username !== currentAuthUserName);

        if (currentUserOwnStory) {
            displayableUniqueUserStories = [currentUserOwnStory, ...otherUsersStories];
        } else {
            displayableUniqueUserStories = otherUsersStories;
        }
    }
    
    if (displayableUniqueUserStories.length === 0) {
        handleStoryViewerClose();
        return;
    }

    if (nextGroupIndex >= displayableUniqueUserStories.length) {
      nextGroupIndex = 0; 
    } else if (nextGroupIndex < 0) {
      nextGroupIndex = displayableUniqueUserStories.length - 1;
    }
    
    if (nextGroupIndex === currentUserStoryGroupIndex && displayableUniqueUserStories.length === 1) {
         handleStoryViewerClose();
         return;
    }

    if (displayableUniqueUserStories[nextGroupIndex]) {
      const nextUsername = displayableUniqueUserStories[nextGroupIndex].username;
      const nextUserStories = mockStoriesData.filter(s => s.username === nextUsername);
      if (nextUserStories.length > 0) {
        setStoriesForViewer(nextUserStories);
        setStoryViewerStartIndex(0);
        setCurrentUserStoryGroupIndex(nextGroupIndex);
      } else {
        handleStoryViewerClose();
      }
    } else {
      handleStoryViewerClose();
    }
  };

  const handleActualStoryCreate = (imageDataUri: string) => {
    if (!authUser) return;

    const currentUserName = authUser.displayName || authUser.email?.split('@')[0] || "CurrentUser";
    const currentUserAvatar = authUser.photoURL || `https://placehold.co/64x64.png?text=${currentUserName.substring(0,1).toUpperCase()}`;

    const newStory: MockStory = {
      id: `currentUserStory-${Date.now()}`,
      username: currentUserName,
      avatarUrl: currentUserAvatar,
      storyImageUrl: imageDataUri,
      hasUnread: true, 
      duration: 5000,
    };
    setMockStoriesData(prevStories => [newStory, ...prevStories]);
  };
  
  const currentUserNameOrDefault = authUser?.displayName || authUser?.email?.split('@')[0] || "CurrentUser";
  const currentUserAvatarOrDefault = authUser?.photoURL || `https://placehold.co/64x64.png?text=${currentUserNameOrDefault.substring(0,1).toUpperCase()}`;
  const currentUserHasStories = authUser && mockStoriesData.some(story => story.username === currentUserNameOrDefault);

  const activePosts = posts.filter(post => post.expiresAt > Date.now());

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4 relative">
        <header className="text-center mb-6">
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3">Community Feed</h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-xl mx-auto">
            Share notes, ask questions, and connect with fellow learners. Posts vanish after 48 hours!
          </p>
        </header>

        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-2 pt-3 sm:pb-3 sm:pt-4">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center">
                <ImageIconLucide className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" /> Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {!authLoading && authUser && !currentUserHasStories && (
                <StoryBubble 
                  username={currentUserNameOrDefault} 
                  avatarUrl={currentUserAvatarOrDefault}
                  isAddStory 
                  onClick={handleAddStoryClick}
                />
              )}
              {uniqueUserStories.map(story => (
                <StoryBubble 
                  key={story.username}
                  username={story.username}
                  avatarUrl={story.avatarUrl}
                  hasUnread={mockStoriesData.some(s => s.username === story.username && s.hasUnread)}
                  onClick={() => handleStoryBubbleClick(story.username)}
                />
              ))}
               {!authUser && !authLoading && (
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <StoryBubble 
                            username="Your Story" 
                            avatarUrl={`https://placehold.co/64x64.png?text=Me`}
                            isAddStory 
                            onClick={handleAddStoryClick}
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent><p>Login to add your story.</p></TooltipContent>
                 </Tooltip>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    className="fixed bottom-22 right-6 md:bottom-8 md:right-8 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                    size="icon"
                    onClick={() => {
                        if (authLoading) return;
                        if (!authUser) {
                        toast({ title: "Login Required", description: "Please log in to create a post.", variant: "destructive" });
                        return;
                        }
                        setIsCreatePostDialogOpen(true);
                    }}
                    aria-label="Create new post"
                    >
                    <Plus className="h-6 w-6 md:h-7 md:w-7" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="mr-2">
                 <p>Create new post</p>
            </TooltipContent>
        </Tooltip>


        <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                <DialogTitle className="font-headline text-xl flex items-center">
                    <StickyNote className="mr-2 h-6 w-6 text-primary" /> Create New Post
                </DialogTitle>
                <DialogDescription>Share your thoughts, notes, or questions with the community.</DialogDescription>
                </DialogHeader>
                <CreatePostForm
                    onPostCreate={(postData) => {
                        handlePostCreate(postData);
                        setIsCreatePostDialogOpen(false); 
                    }}
                />
            </DialogContent>
        </Dialog>
        
        <Separator className="my-6"/>

        <div className="w-full md:max-w-2xl md:mx-auto mb-6">
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

        <div className="w-full md:max-w-2xl md:mx-auto space-y-6 pb-20">
          {activePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {activePosts.length === 0 && (
            <Card className="text-center py-6 sm:py-10 shadow-sm bg-card">
              <CardContent className="flex flex-col items-center gap-3 sm:gap-4">
                <MessagesSquare className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                <p className="text-lg sm:text-xl font-medium text-card-foreground">It's quiet in here...</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {posts.length > 0 ? "No active posts. Old posts might have expired." : "No posts yet. Why not be the first to share something?"}
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
      {isCreateStoryDialogOpen && authUser && (
        <CreateStoryDialog
            isOpen={isCreateStoryDialogOpen}
            onClose={() => setIsCreateStoryDialogOpen(false)}
            onStoryCreate={handleActualStoryCreate}
            currentUserName={authUser.displayName || authUser.email?.split('@')[0] || "Your"}
        />
      )}
    </TooltipProvider>
  );
}
    
