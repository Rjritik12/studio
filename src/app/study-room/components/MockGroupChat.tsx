
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquareText, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export function MockGroupChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "Alex", avatar: "https://placehold.co/40x40.png?text=A", text: "Hey everyone, ready to study?", timestamp: "10:00 AM", isCurrentUser: false },
    { id: "2", sender: "You", avatar: "https://placehold.co/40x40.png?text=Me", text: "Yep, let's do this!", timestamp: "10:01 AM", isCurrentUser: true },
    { id: "3", sender: "Bella", avatar: "https://placehold.co/40x40.png?text=B", text: "I'm focusing on Chapter 3 today.", timestamp: "10:02 AM", isCurrentUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg: Message = {
      id: String(Date.now()),
      sender: "You",
      avatar: "https://placehold.co/40x40.png?text=Me",
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <Card className="shadow-md w-full flex flex-col max-h-[500px]">
      <CardHeader className="pb-3 pt-4 text-center">
        <CardTitle className="font-headline text-lg flex items-center justify-center">
            <MessageSquareText className="mr-2 h-5 w-5 text-accent" /> Group Chat (Mock)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[250px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex items-end gap-2", msg.isCurrentUser ? "justify-end" : "justify-start")}>
                {!msg.isCurrentUser && (
                  <Avatar className="h-8 w-8 border shrink-0">
                    <AvatarImage src={msg.avatar} alt={msg.sender} data-ai-hint="user avatar"/>
                    <AvatarFallback>{msg.sender.substring(0,1)}</AvatarFallback>
                  </Avatar>
                )}
                 <div className={cn(
                    "max-w-[70%] p-2.5 rounded-lg shadow-sm text-sm",
                    msg.isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                 )}>
                    {!msg.isCurrentUser && <p className="text-xs font-semibold mb-0.5">{msg.sender}</p>}
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <p className={cn("text-xs mt-1", msg.isCurrentUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left")}>
                      {msg.timestamp}
                    </p>
                 </div>
                {msg.isCurrentUser && (
                  <Avatar className="h-8 w-8 border shrink-0">
                    <AvatarImage src={msg.avatar} alt={msg.sender} data-ai-hint="user avatar current"/>
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center w-full gap-2">
          <Input
            type="text"
            placeholder="Type a message... (local demo)"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-input focus:border-primary"
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
