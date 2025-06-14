
"use client";

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, HelpCircle, LayoutGrid, Swords, Users, Camera, Upload, Trash2, Lightbulb, VideoOff, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { solveImageProblem, type SolveImageProblemOutput } from '@/ai/flows/solve-image-problem-flow';
import { cn } from "@/lib/utils";

export default function HomePage() {
  const features = [
    { title: "KBC Quiz", description: "Test your knowledge with exciting quizzes.", href: "/quiz", icon: HelpCircle, dataAiHint: "quiz graduation" },
    { title: "Online Battles", description: "Challenge friends or random opponents.", href: "/battles", icon: Swords, dataAiHint: "gaming competition" },
    { title: "AI Study Room", description: "Collaborate and learn with an AI tutor.", href: "/study-room", icon: Users, dataAiHint: "students studying" },
    { title: "Social Feed", description: "Share and discover study materials.", href: "/feed", icon: LayoutGrid, dataAiHint: "social media" },
    { title: "Study Library", description: "Access a vast collection of resources.", href: "/library", icon: BookOpenCheck, dataAiHint: "library books" },
  ];

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null); // null initially, true if granted, false if denied
  const [problemDescription, setProblemDescription] = useState("");
  const [isProcessingSolution, setIsProcessingSolution] = useState(false);
  const [solutionText, setSolutionText] = useState<string | null>(null);
  const [solutionError, setSolutionError] = useState<string | null>(null);


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const clearWebcamStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    // Cleanup stream on component unmount
    return () => {
      clearWebcamStream();
    };
  }, []);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please select an image under 5MB.',
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a JPG, PNG, or WEBP image.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSolutionText(null);
        setSolutionError(null);
        if (isWebcamOpen) { // If webcam was open, close it as we are now using an uploaded image
          closeWebcam();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const requestCameraPermission = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
        return null;
      }
    } else {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      return null;
    }
  };

  const openWebcam = async () => {
    clearPreview(); // Clear any uploaded image and previous solutions

    // If permission is already granted and stream is active, just ensure it's visible
    if (hasCameraPermission && streamRef.current) {
      if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current; // Re-attach if necessary
      }
      setIsWebcamOpen(true);
      return;
    }

    // If permission was previously denied, or not yet determined, or stream is lost
    const stream = await requestCameraPermission(); // This updates hasCameraPermission and attaches stream
    setIsWebcamOpen(true); // Set to true to show webcam view or permission denied alert
  };


  const closeWebcam = () => {
    clearWebcamStream();
    setIsWebcamOpen(false);
    // Note: We don't reset hasCameraPermission here. If granted, it remains granted.
    // If denied, it remains denied. User might just want to close the feed.
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && streamRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/webp'); // Use webp for better compression
        setImagePreview(dataUrl);
        setSolutionText(null);
        setSolutionError(null);
      }
      closeWebcam(); // Close webcam after capture
    }
  };

  const clearPreview = () => {
    setImagePreview(null);
    setSolutionText(null);
    setSolutionError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    // Note: This function no longer closes the webcam directly.
    // The "Clear Image" button will have its own handler if it needs to close an open webcam.
  };
  
  const handleClearImageAndWebcam = () => {
    clearPreview();
    if (isWebcamOpen) {
      closeWebcam();
    }
  }


  const handleGetSolution = async (event: FormEvent) => {
    event.preventDefault();
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload or capture an image first.',
      });
      return;
    }
    setIsProcessingSolution(true);
    setSolutionText(null);
    setSolutionError(null);

    try {
      const result: SolveImageProblemOutput = await solveImageProblem({
        imageDataUri: imagePreview,
        description: problemDescription || undefined,
      });
      setSolutionText(result.solution);
    } catch (error: any) {
      console.error("Error getting solution:", error);
      setSolutionError(error.message || "Failed to get solution from AI. Please try again.");
      toast({
        variant: 'destructive',
        title: 'AI Solution Error',
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsProcessingSolution(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center ">
      <header className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary to-accent/80 rounded-lg shadow-xl mb-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary-foreground mb-4">
            Welcome to EduVerse
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Your all-in-one platform for gamified learning, AI-powered study, and social connection.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6">
        <section className="mb-16">
          <h2 className="font-headline text-3xl font-semibold text-center mb-10 text-foreground">Explore Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <feature.icon className="w-10 h-10 text-primary" />
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-foreground/80 mb-4">{feature.description}</CardDescription>
                   <Image 
                    src={`https://placehold.co/600x400.png`} 
                    alt={feature.title} 
                    width={600} 
                    height={400} 
                    className="rounded-md mb-4 object-cover aspect-video"
                    data-ai-hint={feature.dataAiHint}
                    />
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Link href={feature.href} passHref>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        <section className="mb-16" id="snap-solve">
            <Card className="shadow-xl border-accent/50">
                <CardHeader className="text-center">
                    <Lightbulb className="mx-auto h-12 w-12 text-accent mb-3" />
                    <CardTitle className="font-headline text-3xl text-accent">Snap & Solve</CardTitle>
                    <CardDescription className="text-lg text-foreground/80 max-w-xl mx-auto">
                        Got a tricky problem? Upload an image or use your webcam, and let AI help you out!
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleGetSolution}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button type="button" variant="outline" onClick={triggerFileUpload} disabled={isWebcamOpen || isProcessingSolution}>
                                <Upload className="mr-2 h-5 w-5" /> Upload Image
                            </Button>
                            <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
                            
                            {isWebcamOpen && hasCameraPermission ? (
                                <Button type="button" variant="destructive" onClick={closeWebcam} disabled={isProcessingSolution}>
                                    <VideoOff className="mr-2 h-5 w-5" /> Close Webcam
                                </Button>
                            ) : (
                                <Button type="button" variant="outline" onClick={openWebcam} disabled={isProcessingSolution}>
                                    <Camera className="mr-2 h-5 w-5" /> Open Webcam
                                </Button>
                            )}
                        </div>
                        
                        {/* Container for webcam and its controls */}
                        <div className="flex flex-col items-center w-full max-w-md mx-auto">
                            <video
                                ref={videoRef}
                                className={cn(
                                    "w-full aspect-video rounded-md border bg-muted",
                                    isWebcamOpen && hasCameraPermission ? "block" : "hidden"
                                )}
                                autoPlay
                                muted
                                playsInline
                            />
                            {isWebcamOpen && hasCameraPermission && (
                                <Button
                                    type="button"
                                    onClick={captureImage}
                                    className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={isProcessingSolution}
                                >
                                    <Camera className="mr-2 h-5 w-5" /> Capture Photo
                                </Button>
                            )}
                            {/* Alert if user tried to open webcam (isWebcamOpen=true) but permission is denied (hasCameraPermission=false) */}
                            {isWebcamOpen && hasCameraPermission === false && (
                                <Alert variant="destructive" className="w-full mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Camera Access Denied</AlertTitle>
                                    <AlertDescription>
                                        To capture an image, EduVerse needs camera access. Please enable camera permissions in your browser settings and try again.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden"></canvas>

                        {imagePreview && (
                            <div className="space-y-3 flex flex-col items-center">
                                <Label className="text-lg font-medium">Image Preview:</Label>
                                <div className="relative w-full max-w-md border rounded-md overflow-hidden shadow-md bg-muted">
                                    <Image src={imagePreview} alt="Problem preview" width={600} height={400} className="object-contain aspect-video w-full" data-ai-hint="problem preview" />
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={handleClearImageAndWebcam} disabled={isProcessingSolution}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Clear Image
                                </Button>
                            </div>
                        )}
                        
                        <div>
                            <Label htmlFor="problemDescription" className="text-lg font-medium">Optional: Add a description or question</Label>
                            <Textarea
                                id="problemDescription"
                                value={problemDescription}
                                onChange={(e) => setProblemDescription(e.target.value)}
                                placeholder="e.g., 'Help me solve question 3b' or 'What is this diagram about?'"
                                rows={3}
                                className="mt-1 focus:border-primary transition-colors"
                                disabled={isProcessingSolution}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-3">
                        <Button 
                            type="submit" 
                            className="w-full max-w-md bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" 
                            disabled={!imagePreview || isProcessingSolution}
                        >
                            {isProcessingSolution ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />}
                            Get AI Solution
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {isProcessingSolution && (
                <Card className="mt-6 shadow-md">
                    <CardContent className="p-6 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
                        <p className="text-lg text-muted-foreground">AI is analyzing your problem, please wait...</p>
                    </CardContent>
                </Card>
            )}

            {solutionError && !isProcessingSolution && (
                 <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Getting Solution</AlertTitle>
                    <AlertDescription>{solutionError}</AlertDescription>
                </Alert>
            )}

            {solutionText && !isProcessingSolution && (
                <Card className="mt-6 shadow-xl border-green-500/50">
                    <CardHeader className="bg-green-500/10 dark:bg-green-700/20">
                        <CardTitle className="font-headline text-2xl text-green-700 dark:text-green-400 flex items-center">
                            <Sparkles className="mr-2 h-7 w-7" /> AI Generated Solution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
                            {solutionText}
                        </div>
                    </CardContent>
                </Card>
            )}
        </section>


        <section className="py-12 bg-card rounded-lg shadow-md">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl font-semibold mb-6 text-card-foreground">Ready to Elevate Your Learning?</h2>
            <p className="text-lg text-card-foreground/80 mb-8 max-w-2xl mx-auto">
              Join EduVerse today and unlock a universe of knowledge and fun.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/profile">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

