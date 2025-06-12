
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { NotebookPen } from 'lucide-react';

export function MockSharedNotepad() {
  const [text, setText] = useState("");

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-3 pt-4 text-center">
        <CardTitle className="font-headline text-lg flex items-center justify-center">
            <NotebookPen className="mr-2 h-5 w-5 text-accent" /> Shared Notepad (Mock)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your shared notes here... (locally stored for this demo)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="focus:border-primary transition-colors"
        />
         <p className="text-xs text-muted-foreground mt-2 text-center">Changes are not synced with other users in this mock.</p>
      </CardContent>
    </Card>
  );
}
