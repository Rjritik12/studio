// src/app/library/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto text-center shadow-xl border-primary/20">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <BookOpenCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Study Library</CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            This page is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/70">
            The Study Library will be a place to access a vast collection of educational resources, notes, and materials.
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
