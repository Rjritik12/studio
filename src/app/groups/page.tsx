
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function GroupsRedirectPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 text-center">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="font-headline text-2xl md:text-3xl text-primary">Study Groups Have Moved!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-foreground/80 mb-6">
            To make things simpler, Study Groups are now part of the "Messages & Groups" section.
          </CardDescription>
          <Alert>
            <AlertTitle className="font-semibold">Looking for your groups?</AlertTitle>
            <AlertDescription>
              You can find and manage your study groups, along with your 1-on-1 chats, directly on the Messages page.
            </AlertDescription>
          </Alert>
          <Button asChild size="lg" className="mt-8">
            <Link href="/messages">
              Go to Messages & Groups <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
