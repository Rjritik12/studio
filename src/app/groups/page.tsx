
"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, PlusCircle, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MockStudyGroup } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialMockGroups: MockStudyGroup[] = [
  { id: 'group-jee-physics', name: 'JEE Physics Advanced', description: 'Focused preparation for JEE Advanced Physics concepts and problem-solving.', memberCount: 23, avatarUrl: 'https://placehold.co/64x64.png?text=JP', createdBy: "Admin" },
  { id: 'group-neet-biology', name: 'NEET Biology Champions', description: 'Comprehensive study for NEET Biology, covering Botany and Zoology.', memberCount: 45, avatarUrl: 'https://placehold.co/64x64.png?text=NB', createdBy: "MentorConnect" },
  { id: 'group-class10-math', name: 'Class 10 Maths Masters', description: 'Mastering Class 10 mathematics syllabus with daily practice.', memberCount: 18, avatarUrl: 'https://placehold.co/64x64.png?text=M10', createdBy: "EduVerseBot" },
  { id: 'group-coding-club', name: 'Coding & DSA Club', description: 'Learning data structures, algorithms, and competitive programming.', memberCount: 32, avatarUrl: 'https://placehold.co/64x64.png?text=CD', createdBy: "DevTeam" },
];

export default function GroupsPage() {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<MockStudyGroup[]>(initialMockGroups);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const { toast } = useToast();

  const handleCreateGroup = (event: FormEvent) => {
    event.preventDefault();
    if (!newGroupName.trim()) {
      toast({ title: "Group Name Required", description: "Please enter a name for your group.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to create a group.", variant: "destructive" });
      return;
    }

    const newGroup: MockStudyGroup = {
      id: `group-${newGroupName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription || `A study group for ${newGroupName}.`,
      memberCount: 1,
      avatarUrl: `https://placehold.co/64x64.png?text=${newGroupName.substring(0,2).toUpperCase()}`,
      createdBy: user.displayName || user.email?.split('@')[0] || "You"
    };
    setGroups(prevGroups => [newGroup, ...prevGroups]);
    toast({ title: "Group Created (Mock)!", description: `"${newGroupName}" has been added to your list.` });
    setIsCreateDialogOpen(false);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  if (authLoading) {
    return <div className="container mx-auto py-8 px-4 text-center"><Users className="mx-auto h-12 w-12 animate-pulse text-primary" /><p>Loading groups...</p></div>;
  }

  if (!user && !authLoading) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6 text-center">
            <Alert variant="destructive" className="max-w-lg mx-auto">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-headline">Access Denied</AlertTitle>
                <AlertDescription>
                    You need to be logged in to view and create study groups.
                </AlertDescription>
            </Alert>
            <Button asChild className="mt-6">
                <Link href="/login?redirect=/groups">Log In to View Groups</Link>
            </Button>
        </div>
    );
  }


  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="text-center mb-10">
          <Users className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Study Groups</h1>
          <p className="text-xl text-foreground/80 max-w-xl mx-auto">
            Collaborate, discuss doubts, and prepare together with fellow learners.
          </p>
        </header>

        <div className="text-center mb-8">
          <Button size="lg" onClick={() => setIsCreateDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Group (Mock)
          </Button>
        </div>

        {groups.length === 0 ? (
          <Card className="text-center py-10 shadow-sm">
            <CardContent className="flex flex-col items-center gap-3">
              <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-xl font-medium">No groups yet.</p>
              <p className="text-sm text-muted-foreground">Why not create the first one?</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={group.avatarUrl} alt={group.name} data-ai-hint="group study logo"/>
                    <AvatarFallback>{group.name.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="font-headline text-lg text-primary">{group.name}</CardTitle>
                     <CardDescription className="text-xs text-muted-foreground">Created by: {group.createdBy}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/80 mb-2 line-clamp-3 min-h-[60px]">{group.description}</p>
                  <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/groups/${group.id}`} passHref className="w-full">
                    <Button variant="outline" className="w-full">
                      View Group <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
         <Alert variant="default" className="mt-10 max-w-3xl mx-auto bg-primary/10 border-primary/30">
            <Users className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Mock Group Feature</AlertTitle>
            <AlertDescription className="text-foreground/80">
                The Study Groups feature is currently a prototype. Groups created are stored locally for your session only and are not shared. Full backend functionality for persistent groups, invitations, and real-time collaboration is planned for the future.
            </AlertDescription>
        </Alert>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Physics Enthusiasts"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Group Description (Optional)</Label>
                <Input
                  id="group-description"
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
