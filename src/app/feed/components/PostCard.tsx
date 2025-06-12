
"use client";

import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Heart, Share2, LinkIcon as LinkIconLucide, Image as ImageIconLucide, StickyNote, HelpCircle, Smile } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PostCardProps {
  post: Post;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.round((now - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatTimeLeft(timestamp: number): string {
  const now = Date.now();
  const secondsLeft = Math.round((timestamp - now) / 1000);

  if (secondsLeft <= 0) return "Expired";
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);

  if (hours > 0) return `~${hours}h ${minutes}m left`;
  return `~${minutes}m left`;
}

const typeIcons = {
  note: StickyNote,
  question: HelpCircle,
  meme: Smile,
  link: LinkIconLucide,
  image: ImageIconLucide,
};

export function PostCard({ post }: PostCardProps) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(post.createdAt));
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(post.expiresAt));
  const { toast } = useToast();

  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount);

  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(post.createdAt));
      setTimeLeft(formatTimeLeft(post.expiresAt));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [post.createdAt, post.expiresAt]);
  
  const PostIcon = typeIcons[post.type];
  const hasContent = post.content && post.content.trim() !== '';
  const hasImage = post.imageUrl;
  const hasLink = post.type === 'link' && post.linkUrl;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLocalLikes(prevLikes => isLiked ? prevLikes - 1 : prevLikes + 1);
  };

  const openCommentDialog = () => {
    setIsCommentDialogOpen(true);
  };

  const handlePostComment = () => {
    if (commentText.trim() === '') {
      toast({
        title: "Cannot post empty comment",
        variant: "destructive",
      });
      return;
    }
    setLocalCommentsCount(prevCount => prevCount + 1);
    toast({
      title: "Comment posted! (prototype)",
      description: "Full comment viewing is coming soon!",
      variant: "default",
    });
    setCommentText('');
    setIsCommentDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={post.userAvatar} alt={post.userName} data-ai-hint="user avatar" />
            <AvatarFallback>{post.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/profile/${post.userName}`} onClick={(e) => e.preventDefault()} className="hover:underline">
                  <CardTitle className="text-base font-semibold text-foreground">{post.userName}</CardTitle>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Viewing other user profiles - Coming Soon!</p>
              </TooltipContent>
            </Tooltip>
            <CardDescription className="text-xs text-muted-foreground">
              {timeAgo} &bull; Expires in {timeLeft}
            </CardDescription>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
                <div className="bg-primary/10 p-1.5 rounded-full">
                    <PostIcon className="h-5 w-5 text-primary" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Type: {post.type}</p>
            </TooltipContent>
          </Tooltip>
        </CardHeader>
        <CardContent className="pb-4">
          {hasContent && (
            <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{post.content}</p>
          )}

          {hasImage && (
            <div className={`rounded-lg overflow-hidden border ${hasContent ? 'mt-3' : ''}`}>
              <Image 
                src={post.imageUrl!} 
                alt={post.type === 'meme' ? "Meme image" : "Post image"} 
                width={600} 
                height={400} 
                className="object-cover w-full aspect-video"
                data-ai-hint={post.type === 'meme' ? "funny meme" : "social media image"}
              />
            </div>
          )}

          {hasLink && (
            <div className={`text-sm mt-2 ${(!hasImage && !hasContent) ? '' : 'pt-1'}`}>
              <Link href={post.linkUrl!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 break-all">
                <LinkIconLucide className="h-4 w-4 flex-shrink-0" /> 
                <span>{post.linkUrl!.length > 60 ? post.linkUrl!.substring(0, 60) + "..." : post.linkUrl}</span>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-3 border-t">
          <div className="flex gap-4 text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "flex items-center gap-1.5 hover:text-primary",
                isLiked && "text-rose-500 hover:text-rose-600"
              )}
              onClick={handleLikeClick}
            >
              <Heart className={cn("h-4 w-4", isLiked ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
              <span className="text-xs">{localLikes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 hover:text-primary" 
              onClick={openCommentDialog}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{localCommentsCount}</span>
            </Button>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary" disabled>
                <Share2 className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Sharing coming soon!</p></TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>

      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card">
          <DialogHeader>
            <DialogTitle className="font-headline text-lg text-primary">Add a comment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment-text" className="text-sm font-medium text-card-foreground">
                Your comment
              </Label>
              <Textarea
                id="comment-text"
                placeholder="Write your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="focus:border-primary transition-colors bg-background"
              />
            </div>
            {/* Placeholder for future display of existing comments */}
            {/* <div className="max-h-48 overflow-y-auto space-y-2 p-2 border rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Viewing comments coming soon...</p>
            </div> */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCommentDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handlePostComment} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Post Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
