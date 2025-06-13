
"use client";

import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Paperclip, Smile, AlertCircle, IndianRupee } from "lucide-react";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock message structure
interface MockMessage {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const username = typeof params.username === 'string' ? decodeURIComponent(params.username) : "User";

  const mockMessages: MockMessage[] = [
    { id: "1", text: `Hey ${username}! How's it going?`, sender: 'me', timestamp: "10:00 AM" },
    { id: "2", text: "Hi there! I'm doing well, thanks for asking. Just working on some study notes.", sender: 'other', timestamp: "10:01 AM" },
    { id: "3", text: "Cool! Need any help with that?", sender: 'me', timestamp: "10:02 AM" },
    { id: "4", text: "Maybe later, thanks! This is just a demo chat for now. 😉", sender: 'other', timestamp: "10:03 AM" },
  ];

  const otherUserAvatarFallback = username.substring(0, 1).toUpperCase();
  const otherUserAvatarUrl = `https://placehold.co/40x40.png?text=${otherUserAvatarFallback}`;
  const currentUserAvatarUrl = `https://placehold.co/40x40.png?text=Me`;


  return (
    <div className="container mx-auto py-4 h-[calc(100vh-5rem)] flex flex-col">
      <Card className="flex-1 flex flex-col shadow-xl w-full max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-3 p-3 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={otherUserAvatarUrl} alt={username} data-ai-hint="user avatar"/>
            <AvatarFallback>{otherUserAvatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">{username}</CardTitle>
            <p className="text-xs text-green-500">Online (Demo)</p>
          </div>
          {/* Future: Add options like call, video call, profile view */}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'other' && (
                <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarImage src={otherUserAvatarUrl} alt={username} data-ai-hint="user avatar"/>
                  <AvatarFallback>{otherUserAvatarFallback}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[70%] p-3 rounded-xl shadow ${
                  msg.sender === 'me' 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-card text-card-foreground rounded-bl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
              {msg.sender === 'me' && (
                 <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarImage src={currentUserAvatarUrl} alt="Current User" data-ai-hint="user avatar current"/>
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="p-3 border-t bg-card">
          <div className="flex items-center w-full gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
                <Smile className="h-5 w-5" /> <span className="sr-only">Emoji</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
                <Paperclip className="h-5 w-5" /> <span className="sr-only">Attach</span>
            </Button>
            <Input 
              type="text" 
              placeholder="Type a message... (disabled)" 
              className="flex-1 bg-input focus:border-primary"
              disabled 
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
              <Send className="h-5 w-5" /> <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Alert variant="default" className="mt-4 max-w-3xl mx-auto bg-primary/10 border-primary/30">
        <AlertCircle className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Feature Under Development</AlertTitle>
        <AlertDescription className="text-foreground/80">
          This is a placeholder chat interface. Full real-time messaging capabilities are planned.
          The first month of general messaging is free. After that, to initiate a new chat with a specific person, 
          it will cost <IndianRupee className="inline h-3 w-3" />19 for one month of access. This payment by the initiator enables the chat for both users.
        </AlertDescription>
      </Alert>
    </div>
  );
}
