
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface StoryItem {
  id: string;
  username: string;
  avatarUrl: string;
  storyImageUrl: string; // URL for the main story image
  duration?: number; // Optional: duration for this specific story item if part of a sequence
}

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: StoryItem[];
  startIndex?: number;
  onNextStorySet: () => void; // Callback when current user's stories end, to move to next user
  onPrevStorySet: () => void; // Callback when current user's stories end (prev), to move to prev user
}

export function StoryViewer({
  isOpen,
  onClose,
  stories,
  startIndex = 0,
  onNextStorySet,
  onPrevStorySet,
}: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentStoryIndex(startIndex);
  }, [startIndex, stories]);

  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isOpen || !currentStory) {
      setProgress(0);
      return;
    }

    setProgress(0); // Reset progress when story changes

    const storyDuration = currentStory.duration || 5000; // Default 5 seconds
    let startTime: number;
    let animationFrameId: number;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const currentProgress = Math.min((elapsedTime / storyDuration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        handleNext();
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      setProgress(0);
    };
  }, [currentStoryIndex, isOpen, stories, currentStory]);


  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onNextStorySet(); // Signal to parent to move to next user's stories or close
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      onPrevStorySet(); // Signal to parent to move to previous user's stories or close
    }
  };

  if (!currentStory) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 m-0 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl w-screen h-screen sm:h-[90vh] sm:max-h-[700px] sm:rounded-lg flex flex-col overflow-hidden bg-black">
        <div className="relative flex-grow w-full h-full flex items-center justify-center">
          {/* Story Image */}
          <Image
            src={currentStory.storyImageUrl}
            alt={`${currentStory.username}'s story`}
            layout="fill"
            objectFit="contain" // Changed to contain to show full image
            className="z-0"
            data-ai-hint="user story image"
          />

          {/* Overlay for header and progress */}
          <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-10">
            {/* Progress Bars */}
            <div className="flex items-center gap-1 mb-2">
              {stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? `${progress}%` : '0%' }}
                  />
                </div>
              ))}
            </div>
            {/* Header: Avatar, Username, Close button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={currentStory.avatarUrl} alt={currentStory.username} data-ai-hint="user avatar story"/>
                  <AvatarFallback>{currentStory.username.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-white font-semibold text-sm">{currentStory.username}</span>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                  <X className="w-6 h-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 z-20 h-10 w-10 rounded-full"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-7 h-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 z-20 h-10 w-10 rounded-full"
            aria-label="Next story"
          >
            <ChevronRight className="w-7 h-7" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
