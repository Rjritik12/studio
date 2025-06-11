
"use client";

import type { Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Heart, Share2, LinkIcon, Image as ImageIcon, StickyNote, HelpCircle, Smile } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  link: LinkIcon,
  image: ImageIcon,
};

export function PostCard({ post }: PostCardProps) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(post.createdAt));
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(post.expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(post.createdAt));
      setTimeLeft(formatTimeLeft(post.expiresAt));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [post.createdAt, post.expiresAt]);
  
  const PostIcon = typeIcons[post.type];

  return (
    <TooltipProvider>
      <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={post.userAvatar} alt={post.userName} data-ai-hint="user avatar" />
            <AvatarFallback>{post.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-foreground">{post.userName}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {timeAgo} &bull; Expires in {timeLeft}
            </CardDescription>
          </div>
          <PostIcon className="h-5 w-5 text-muted-foreground" title={`Type: ${post.type}`} />
        </CardHeader>
        <CardContent className="pb-4">
          {post.type === 'link' && !post.imageUrl ? (
             <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                {post.content.startsWith('http') ? (
                    <>
                        Shared a link: <Link href={post.content} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{post.content}</Link>
                    </>
                ) : post.content}
            </p>
          ) : (
            <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words mb-3">{post.content}</p>
          )}
          {post.imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border">
              <Image 
                src={post.imageUrl} 
                alt="Post image" 
                width={600} 
                height={400} 
                className="object-cover w-full aspect-video"
                data-ai-hint="social media image"
              />
            </div>
          )}
          {post.type === 'link' && post.imageUrl && ( // if it's a link with an image, display the link below the image
             <Link href={post.content} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm mt-2">
                <LinkIcon className="h-4 w-4" /> Visit Link
            </Link>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-3 border-t">
          <div className="flex gap-4 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary" disabled>
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">{post.likes}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Liking coming soon!</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 hover:text-primary" disabled>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.commentsCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Commenting coming soon!</p></TooltipContent>
            </Tooltip>
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
    </TooltipProvider>
  );
}
