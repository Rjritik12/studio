"use client";

import { Button } from "@/components/ui/button";
import type { Lifeline } from "@/lib/types";
import { HandHelping, Lightbulb, Shuffle, Users } from "lucide-react";
import type { Icon } from "lucide-react";

interface LifelineButtonProps {
  type: Lifeline;
  onClick: (type: Lifeline) => void;
  disabled: boolean;
  used: boolean;
}

const lifelineIcons: Record<Lifeline, Icon> = {
  "50-50": HandHelping,
  "Flip": Shuffle,
  "AI_Hint": Lightbulb,
  "Audience_Poll": Users,
};

const lifelineLabels: Record<Lifeline, string> = {
  "50-50": "50-50",
  "Flip": "Flip Question",
  "AI_Hint": "AI Hint",
  "Audience_Poll": "Audience Poll",
}

export function LifelineButton({ type, onClick, disabled, used }: LifelineButtonProps) {
  const IconComponent = lifelineIcons[type];
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onClick(type)}
      disabled={disabled || used}
      className={`flex flex-col items-center justify-center h-20 w-20 md:h-24 md:w-24 p-2 rounded-lg shadow-md transition-all duration-200 ease-in-out
                  ${used ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed' : 'hover:bg-accent/20 hover:shadow-lg'}
                  ${disabled && !used ? 'opacity-70 cursor-not-allowed' : ''}
                  border-primary/50 text-primary`}
      title={lifelineLabels[type]}
    >
      <IconComponent className={`h-6 w-6 md:h-8 md:w-8 mb-1 ${used ? '' : 'text-primary'}`} />
      <span className="text-xs md:text-sm text-center font-medium">{lifelineLabels[type]}</span>
      {used && <span className="text-xs absolute bottom-1">(Used)</span>}
    </Button>
  );
}
