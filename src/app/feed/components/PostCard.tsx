
"use client";

import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Heart, Share2, LinkIcon as LinkIconLucide, Image as ImageIconLucide, StickyNote, HelpCircle, Smile, Send, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, memo } from 'react'; // Added memo
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PostCardProps {
  post: Post;
}

interface LocalComment {
  id: string;
  text: string;
  author: string;
  avatar: string;
  likes: number;
  isLikedByCurrentUser: boolean;
  replies: LocalComment[];
  showReplyInput: boolean;
  createdAt: number;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.round((now - timestamp) / 1000);

  if (seconds < 5) return `just now`;
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

// Wrapped PostCard with memo
export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(post.createdAt));
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(post.expiresAt));
  const { toast } = useToast();

  const [isPostLiked, setIsPostLiked] = useState(false);
  const [localPostLikes, setLocalPostLikes] = useState(post.likes);
  const [animateLike, setAnimateLike] = useState(false);
  
  const [topLevelCommentText, setTopLevelCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({}); 
  const [newComments, setNewComments] = useState<LocalComment[]>([]); 
  
  const calculateTotalComments = (comments: LocalComment[]): number => {
    let count = comments.length;
    comments.forEach(comment => {
      count += comment.replies.length;
    });
    return count;
  };
  const localCommentsCount = post.commentsCount + calculateTotalComments(newComments);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(post.createdAt));
      setTimeLeft(formatTimeLeft(post.expiresAt));
    }, 5000); 
    return () => clearInterval(interval);
  }, [post.createdAt, post.expiresAt]);
  
  const PostIcon = typeIcons[post.type];
  const hasContent = post.content && post.content.trim() !== '';
  const hasImage = post.imageUrl;
  const hasLink = post.type === 'link' && post.linkUrl;

  const handlePostLikeClick = () => {
    setIsPostLiked(!isPostLiked);
    setLocalPostLikes(prevLikes => isPostLiked ? prevLikes - 1 : prevLikes + 1);
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 300); 
  };

  const handlePostTopLevelComment = () => {
    if (topLevelCommentText.trim() === '') {
      toast({ title: "Cannot post empty comment", variant: "destructive" });
      return;
    }
    const newComment: LocalComment = {
      id: `comment-${Date.now()}`,
      text: topLevelCommentText,
      author: "You",
      avatar: "https://placehold.co/32x32.png?text=U",
      likes: 0,
      isLikedByCurrentUser: false,
      replies: [],
      showReplyInput: false,
      createdAt: Date.now(),
    };
    setNewComments(prev => [newComment, ...prev]); 
    toast({ title: "Comment posted!", variant: "default" });
    setTopLevelCommentText('');
  };

  const toggleReplyInput = (commentId: string) => {
    setNewComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
        ? { ...comment, showReplyInput: !comment.showReplyInput }
        : comment
      )
    );
  };

  const handleReplyTextChange = (commentId: string, text: string) => {
    setReplyText(prev => ({ ...prev, [commentId]: text }));
  };

  const handlePostReply = (parentCommentId: string) => {
    const currentReplyText = replyText[parentCommentId]?.trim();
    if (!currentReplyText) {
      toast({ title: "Cannot post empty reply", variant: "destructive" });
      return;
    }
    const newReply: LocalComment = {
      id: `reply-${Date.now()}`,
      text: currentReplyText,
      author: "You",
      avatar: "https://placehold.co/28x28.png?text=U",
      likes: 0,
      isLikedByCurrentUser: false,
      replies: [], 
      showReplyInput: false,
      createdAt: Date.now(),
    };
    setNewComments(prevComments => 
      prevComments.map(comment => 
        comment.id === parentCommentId 
        ? { ...comment, replies: [newReply, ...comment.replies], showReplyInput: false } 
        : comment
      )
    );
    setReplyText(prev => ({ ...prev, [parentCommentId]: '' })); 
    toast({ title: "Reply posted!", variant: "default" });
  };

  const handleLikeComment = (commentId: string, isReply: boolean, parentId?: string) => {
    setNewComments(prevComments => 
      prevComments.map(comment => {
        if (!isReply && comment.id === commentId) {
          return { 
            ...comment, 
            likes: comment.isLikedByCurrentUser ? comment.likes - 1 : comment.likes + 1,
            isLikedByCurrentUser: !comment.isLikedByCurrentUser 
          };
        }
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
              ? { ...reply, 
                  likes: reply.isLikedByCurrentUser ? reply.likes - 1 : reply.likes + 1,
                  isLikedByCurrentUser: !reply.isLikedByCurrentUser 
                } 
              : reply
            )
          };
        }
        return comment;
      })
    );
  };
  
  const renderComment = (comment: LocalComment, isReply = false, parentId?: string) => (
    <div key={comment.id} className={cn("flex items-start gap-2.5", isReply ? "ml-8 mt-2" : "mt-3")}>
      <Avatar className={cn("border text-xs shrink-0", isReply ? "h-7 w-7" : "h-8 w-8")}>
        <AvatarImage src={comment.avatar} alt={comment.author} data-ai-hint="user avatar generic"/>
        <AvatarFallback>{comment.author.substring(0,1)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className={cn("p-2.5 rounded-lg bg-background shadow-sm", isReply ? "text-xs" : "text-sm")}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-card-foreground text-xs">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap break-words text-card-foreground/90 mt-1">{comment.text}</p>
        </div>
        <div className="flex items-center gap-2 mt-1.5 pl-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "h-auto px-1.5 py-0.5 text-xs text-muted-foreground hover:text-primary", 
              comment.isLikedByCurrentUser && "text-rose-500 hover:text-rose-600"
            )}
            onClick={() => handleLikeComment(comment.id, isReply, parentId)}
          >
            <Heart className={cn("h-3.5 w-3.5 mr-1", comment.isLikedByCurrentUser ? "fill-rose-500 text-rose-500" : "")} /> 
            {comment.likes > 0 ? comment.likes : 'Like'}
          </Button>
          {!isReply && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto px-1.5 py-0.5 text-xs text-muted-foreground hover:text-primary"
              onClick={() => toggleReplyInput(comment.id)}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Reply
            </Button>
          )}
        </div>
        {!isReply && comment.showReplyInput && (
          <div className="mt-2 flex items-start gap-2">
            <Avatar className="h-7 w-7 border shrink-0 mt-0.5">
              <AvatarImage src="https://placehold.co/28x28.png?text=Me" alt="Current User" data-ai-hint="user avatar current"/>
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder={`Replying to ${comment.author}...`}
              value={replyText[comment.id] || ''}
              onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
              rows={1}
              className="flex-1 resize-none bg-background focus:border-primary transition-colors text-xs min-h-[36px] h-9 leading-tight"
            />
            <Button 
              onClick={() => handlePostReply(comment.id)} 
              disabled={!replyText[comment.id]?.trim()} 
              size="icon" 
              className="self-start bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-9"
              aria-label="Post reply"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        {comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    </div>
  );


  return (
    <TooltipProvider>
      <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={post.userAvatar} alt={post.userName} data-ai-hint="user avatar" />
            <AvatarFallback>{post.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
              <Link href={`/profile/${encodeURIComponent(post.userName)}`} className="hover:underline">
                <CardTitle className="text-base font-semibold text-foreground">{post.userName}</CardTitle>
              </Link>
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
                "flex items-center gap-1.5 hover:text-primary transition-colors duration-150",
                isPostLiked && "text-rose-500 hover:text-rose-600"
              )}
              onClick={handlePostLikeClick}
            >
              <Heart className={cn(
                  "h-4 w-4 transition-all duration-300 ease-out", 
                  isPostLiked ? "fill-rose-500 text-rose-500" : "text-muted-foreground",
                  animateLike && "transform scale-125"
                )}
              />
              <span className="text-xs">{localPostLikes}</span>
            </Button>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{localCommentsCount}</span>
            </div>
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

        <div className="px-6 pt-4 pb-4 border-t bg-muted/20">
          {(newComments.length > 0 || post.commentsCount > 0) && (
            <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">
              Comments ({localCommentsCount})
            </h4>
          )}
          
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mb-3">
            {post.commentsCount > 0 && newComments.length === 0 && (
              <div className="text-xs text-muted-foreground pb-2 mb-2 border-b border-border/50 text-center">
                {post.commentsCount} older comment(s) not shown in this prototype. Add a new comment to see it here!
              </div>
            )}
             {newComments.length > 0 && post.commentsCount > 0 && (
              <div className="text-xs text-muted-foreground pb-1 mb-1 text-center">
                Displaying {newComments.length} new comment(s). {post.commentsCount} older comment(s) not shown.
              </div>
            )}

            {newComments.length > 0 ? (
              newComments.map(comment => renderComment(comment))
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
              placeholder="Add a public comment..."
              value={topLevelCommentText}
              onChange={(e) => setTopLevelCommentText(e.target.value)}
              rows={1}
              className="flex-1 resize-none bg-background focus:border-primary transition-colors text-sm min-h-[40px] h-10 leading-tight"
            />
            <Button 
              onClick={handlePostTopLevelComment} 
              disabled={!topLevelCommentText.trim()} 
              size="icon" 
              className="self-start bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10"
              aria-label="Post comment"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
});
PostCard.displayName = 'PostCard';

