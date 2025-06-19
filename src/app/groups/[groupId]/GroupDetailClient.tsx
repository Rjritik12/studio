
"use client";

import { useParams, useRouter } from 'next/navigation'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Users, Settings, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GroupDetailClientProps {
  params: { groupId: string };
}

export default function GroupDetailClient({ params }: GroupDetailClientProps) {
  const router = useRouter();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId || "unknown-group";

  const mockGroupName = groupId.replace('group-', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/-\d+$/, '').replace(/-msg$/,'');

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Groups
        </Button>
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-10 w-10 text-primary" />
            </div>
            <div>
                <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                {mockGroupName || `Group: ${groupId}`}
                </h1>
                <p className="text-lg text-foreground/80">Welcome to your study group space!</p>
            </div>
        </div>
      </header>

      <Card className="shadow-xl border-accent/30">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-accent">Group Features (Coming Soon)</CardTitle>
          <CardDescription>
            This is where dedicated features for "{mockGroupName}" will be available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FeaturePlaceholder icon={MessageSquare} title="Group Chat" description="Real-time messaging with group members." />
            <FeaturePlaceholder icon={Users} title="Member List" description="See who's in the group and manage members (admin)." />
            <FeaturePlaceholder icon={Settings} title="Group Settings" description="Manage group name, description, and privacy (admin)." />
            <FeaturePlaceholder icon={Users} title="Invite Members" description="Add new learners to your study group." />
          </div>
           <Alert variant="default" className="mt-6 bg-primary/10 border-primary/30">
            <AlertCircle className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Under Construction</AlertTitle>
            <AlertDescription className="text-foreground/80">
                The features for individual study groups are currently under development. This page serves as a placeholder.
                In a full implementation, you would find tools for collaboration, discussion, and resource sharing specific to this group.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeaturePlaceholderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeaturePlaceholder({ icon: Icon, title, description }: FeaturePlaceholderProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-foreground/5 rounded-lg shadow-sm">
      <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
        <p className="text-sm text-foreground/70">{description} (Coming Soon)</p>
      </div>
    </div>
  );
}
    
