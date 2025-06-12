
"use client";

import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Heart, Share2, LinkIcon as LinkIconLucide, Image as ImageIconLucide, StickyNote, HelpCircle, Smile, Send } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
  
  const [commentText, setCommentText] = useState('');
  const [newComments, setNewComments] = useState<string[]>([]); 
  // localCommentsCount will now be derived from post.commentsCount + newComments.length
  const localCommentsCount = post.commentsCount + newComments.length;


  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(post.createdAt));
      setTimeLeft(formatTimeLeft(post.expiresAt));
    }, 60000); 
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

  const handlePostComment = () => {
    if (commentText.trim() === '') {
      toast({
        title: "Cannot post empty comment",
        variant: "destructive",
      });
      return;
    }
    setNewComments(prev => [...prev, commentText]);
    // localCommentsCount is now derived, so no need to set it directly
    toast({
      title: "Comment posted! (prototype)",
      description: "Your new comment is visible below for this session.",
      variant: "default",
    });
    setCommentText('');
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
              // onClick could focus the input field or scroll to comments
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

        {/* Inline Comment Section */}
        <div className="px-6 pt-4 pb-4 border-t bg-muted/20">
          {(newComments.length > 0 || post.commentsCount > 0) && (
            <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">
              Comments ({localCommentsCount})
            </h4>
          )}
          
          <div className="max-h-48 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mb-3">
            {post.commentsCount > 0 && (
              <div className="text-xs text-muted-foreground pb-2 mb-2 border-b border-border/50 text-center">
                {post.commentsCount} older comment(s) not shown in this prototype.
              </div>
            )}
            {newComments.length > 0 ? (
              newComments.map((comment, index) => (
                <div key={index} className="flex items-start gap-2.5 text-sm">
                  <Avatar className="h-8 w-8 border text-xs shrink-0">
                    <AvatarImage src="https://placehold.co/40x40.png?text=U" alt="User" data-ai-hint="user avatar generic"/>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="p-2.5 rounded-md bg-background shadow-sm flex-1">
                    <span className="font-semibold text-card-foreground text-xs">You</span>
                    <p className="whitespace-pre-wrap break-words text-sm text-card-foreground/90 mt-0.5">{comment}</p>
                  </div>
                </div>
              ))
            ) : (
              post.commentsCount === 0 && <p className="text-xs text-muted-foreground text-center py-3">No comments yet. Be the first to comment!</p>
            )}
          </div>

          <div className="flex items-start gap-2 pt-3 border-t border-border/50">
            <Avatar className="h-8 w-8 border shrink-0 mt-0.5">
              <AvatarImage src="https://placehold.co/40x40.png?text=Me" alt="Current User" data-ai-hint="user avatar current"/>
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={1}
              className="flex-1 resize-none bg-background focus:border-primary transition-colors text-sm min-h-[40px] h-10 leading-tight"
            />
            <Button 
              onClick={handlePostComment} 
              disabled={!commentText.trim()} 
              size="sm" 
              className="self-start bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="Post comment"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
