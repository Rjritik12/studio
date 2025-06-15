
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface StoryBubbleProps {
  username: string;
  avatarUrl: string;
  hasUnread?: boolean;
  isAddStory?: boolean;
  onClick: () => void;
}

export function StoryBubble({
  username,
  avatarUrl,
  hasUnread = false,
  isAddStory = false,
  onClick,
}: StoryBubbleProps) {
  const avatarFallback = username ? username.substring(0, 1).toUpperCase() : "U";

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center w-[70px] sm:w-20 text-center group focus:outline-none"
      aria-label={isAddStory ? "Add to your story" : `View ${username}'s story`}
    >
      <div
        className={cn(
          "relative rounded-full p-0.5 transition-all duration-300",
          isAddStory ? "bg-transparent" : 
          hasUnread
            ? "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-hover:from-yellow-500 group-hover:via-red-600 group-hover:to-purple-700"
            : "bg-muted group-hover:bg-muted/80",
           !isAddStory && "hover:scale-105"
        )}
      >
        <Avatar className={cn("h-14 w-14 sm:h-16 sm:w-16 border-2", isAddStory ? "border-border hover:border-primary/50" : "border-background")}>
          <AvatarImage src={avatarUrl} alt={username} data-ai-hint="user story avatar" />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        {isAddStory && (
          <div className="absolute bottom-0 right-0 bg-background rounded-full p-0.5">
            <PlusCircle className="h-5 w-5 sm:h-6 sm-6 text-primary group-hover:text-primary/80 transition-colors" />
          </div>
        )}
      </div>
      <p className={cn("mt-1 text-xs font-medium truncate w-full", isAddStory ? "text-muted-foreground group-hover:text-foreground" : "text-foreground/90")}>
        {isAddStory ? "Your Story" : username}
      </p>
    </button>
  );
}

