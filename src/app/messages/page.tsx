
"use client"; 

import { useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, MessageCircle, CreditCard, IndianRupee, Users, Clock, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { MockStudyGroup } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';


const initialMockGroups: MockStudyGroup[] = [
  { id: 'group-jee-physics-msg', name: 'JEE Physics Advanced', description: 'Focused preparation for JEE Advanced Physics concepts and problem-solving.', memberCount: 23, avatarUrl: 'https://placehold.co/64x64.png?text=JP', createdBy: "Admin" },
  { id: 'group-neet-biology-msg', name: 'NEET Biology Champions', description: 'Comprehensive study for NEET Biology, covering Botany and Zoology.', memberCount: 45, avatarUrl: 'https://placehold.co/64x64.png?text=NB', createdBy: "MentorConnect" },
  { id: 'group-class10-math-msg', name: 'Class 10 Maths Masters', description: 'Mastering Class 10 mathematics syllabus with daily practice.', memberCount: 18, avatarUrl: 'https://placehold.co/64x64.png?text=M10', createdBy: "EduVerseBot" },
];


export default function MessagesPage() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<MockStudyGroup[]>(initialMockGroups);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const { toast } = useToast();

  const mockConversations = [
    { id: "1", username: "AliceWonder", lastMessage: "Sure, let's discuss the project.", unread: true, avatar: "https://placehold.co/40x40.png?text=AW" },
    { id: "2", username: "BobTheBuilder", lastMessage: "Can you send me the notes?", unread: false, avatar: "https://placehold.co/40x40.png?text=BB" },
    { id: "3", username: "CharlieCode", lastMessage: "Thanks for the help!", unread: false, avatar: "https://placehold.co/40x40.png?text=CC" },
  ];

  const handleMessagingSubscription = () => {
    console.log("Messaging subscription mock purchase successful!");
  };
  
  const handleCreateGroup = (event: FormEvent) => {
    event.preventDefault();
    if (!newGroupName.trim()) {
      toast({ title: "Group Name Required", description: "Please enter a name for your group.", variant: "destructive" });
      return;
    }
    if (!user && !authLoading) {
      toast({ title: "Login Required", description: "Please log in to create a group.", variant: "destructive" });
      return;
    }

    const newGroup: MockStudyGroup = {
      id: `group-${newGroupName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription || `A study group for ${newGroupName}.`,
      memberCount: 1,
      avatarUrl: `https://placehold.co/64x64.png?text=${newGroupName.substring(0,2).toUpperCase()}`,
      createdBy: user?.displayName || user?.email?.split('@')[0] || "You"
    };
    setGroups(prevGroups => [newGroup, ...prevGroups]);
    toast({ title: "Group Created (Mock)!", description: `"${newGroupName}" has been added to your list.` });
    setIsCreateGroupDialogOpen(false);
    setNewGroupName('');
    setNewGroupDescription('');
  };


  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="text-center mb-10">
          <MessageCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Messages & Groups</h1>
          <p className="text-xl text-foreground/80 max-w-xl mx-auto">
            Your conversations and study groups. Messages auto-delete after 48 hours.
          </p>
        </header>

        <Card className="max-w-2xl mx-auto shadow-lg mb-8 border-accent">
          <CardHeader className="bg-accent/10">
            <CardTitle className="font-headline text-xl flex items-center text-accent">
              <CreditCard className="mr-3 h-6 w-6" /> Messaging Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-foreground/90 mb-2">
              Enjoy unlimited messaging <span className="font-semibold text-primary">free for your first month!</span>
            </p>
            <p className="text-foreground/90 mb-3">
              After your trial, unlock new conversations for just <IndianRupee className="inline h-4 w-4" />19 per person for one month of chat. 
              The person starting the chat pays, and the conversation is enabled for both users.
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Secure UPI & Card payments will be supported.
            </p>
            <Button 
              className="w-full" 
              onClick={() => setIsPaymentDialogOpen(true)} 
            >
              Activate Full Messaging (Mock <IndianRupee className="inline h-3.5 w-3.5 ml-1"/>19)
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              (This is a prototype - no actual charges or payments are processed.)
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-2xl mx-auto shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
              <Inbox className="mr-3 h-6 w-6 text-primary" /> Inbox (1-on-1 Chats)
            </CardTitle>
            <CardDescription>
              Select a conversation to view messages. Remember, messages vanish after 48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockConversations.length > 0 ? (
              <ul className="space-y-3">
                {mockConversations.map((convo) => (
                  <li key={convo.id}>
                    <Link href={`/messages/${encodeURIComponent(convo.username)}`} passHref>
                      <Button variant="ghost" className="w-full h-auto justify-start p-3 rounded-md hover:bg-muted/50">
                        <img src={convo.avatar} alt={convo.username} className="h-10 w-10 rounded-full mr-3" data-ai-hint="user avatar"/>
                        <div className="flex-1 text-left">
                          <p className={`font-semibold ${convo.unread ? 'text-primary' : 'text-foreground'}`}>{convo.username}</p>
                          <p className={`text-sm truncate ${convo.unread ? 'text-primary/80' : 'text-muted-foreground'}`}>{convo.lastMessage}</p>
                        </div>
                        {convo.unread && <span className="ml-2 h-3 w-3 rounded-full bg-primary"></span>}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Alert variant="default" className="bg-secondary/30">
                <Inbox className="h-5 w-5 text-secondary-foreground" />
                <AlertTitle className="font-semibold">No Conversations Yet</AlertTitle>
                <AlertDescription>
                  Start messaging users from their profiles to see conversations here. Full messaging functionality is under development.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center">
                <Users className="mr-3 h-6 w-6 text-primary" /> Study Groups
            </CardTitle>
            <CardDescription>
                Collaborate with fellow learners.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="mb-4 text-center sm:text-left">
              <Button onClick={() => {
                if (!user && !authLoading) {
                  toast({ title: "Login Required", description: "Please log in to create a group.", variant: "destructive" });
                  return;
                }
                setIsCreateGroupDialogOpen(true);
              }} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Group (Mock)
              </Button>
            </div>
            {groups.length === 0 && !authLoading ? (
              <Alert variant="default" className="bg-secondary/30">
                <Users className="h-5 w-5 text-secondary-foreground" />
                <AlertTitle className="font-semibold">No Study Groups Joined or Created</AlertTitle>
                <AlertDescription>
                  Why not create one?
                </AlertDescription>
              </Alert>
            ) : authLoading ? (
                <p className="text-center text-muted-foreground">Loading groups...</p>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <Card key={group.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-row items-center p-3">
                    <Avatar className="h-10 w-10 border mr-3">
                      <AvatarImage src={group.avatarUrl} alt={group.name} data-ai-hint="group study logo"/>
                      <AvatarFallback>{group.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary text-sm">{group.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
                      <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
                    </div>
                    <Link href={`/groups/${group.id}`} passHref>
                      <Button variant="outline" size="sm">
                        View <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
             <Alert variant="default" className="w-full bg-primary/10 border-primary/30">
                <MessageCircle className="h-5 w-5 text-primary" />
                <AlertTitle className="font-headline text-primary">Feature Under Development</AlertTitle>
                <AlertDescription className="text-foreground/80 space-y-1">
                  <p>1-on-1 chats and Study Groups are currently prototypes. Group creation and chat listings are local to your session. Full backend functionality for persistent groups, invitations, and real-time collaboration is planned.</p>
                  <p>The initial month of 1-on-1 messaging is free. Afterwards, starting a new 1-on-1 chat with a person will cost <IndianRupee className="inline h-3 w-3" />19 for one month of access with that specific user (one-time payment by initiator enables chat for both).</p>
                  <p className="flex items-center"><Clock className="h-4 w-4 mr-1.5 text-primary/80" /> All 1-on-1 messages will automatically delete after 48 hours.</p>
                </AlertDescription>
              </Alert>
          </CardFooter>
        </Card>

      </div>
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        itemName="1-Month Messaging Access"
        itemPrice={19}
        onPaymentSuccessMock={handleMessagingSubscription}
      />
      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Create New Study Group (Mock)</DialogTitle>
            <DialogDescription>
              Enter a name and optional description for your new group.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGroup}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name-dialog">Group Name</Label>
                <Input
                  id="group-name-dialog"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Physics Enthusiasts"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description-dialog">Group Description (Optional)</Label>
                <Input
                  id="group-description-dialog"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="e.g., Discussing advanced physics topics."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Group</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
