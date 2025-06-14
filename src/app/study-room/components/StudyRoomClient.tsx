
"use client";

import { useState, type FormEvent, useRef, type ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Lightbulb, AlertCircle, Camera, Upload, Trash2, VideoOff } from 'lucide-react';
import { handleStudySession } from '@/lib/actions';
import type { Flashcard, StudyRoomData } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PracticeQuestionCard } from './PracticeQuestionCard';
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { Separator } from '@/components/ui/separator';


export function StudyRoomClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyData, setStudyData] = useState<StudyRoomData | null>(null);

  // States for image handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imageDataUriForAI, setImageDataUriForAI] = useState<string | null>(null);

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
    return () => {
      clearWebcamStream();
    };
  }, []);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File Too Large', description: 'Please select an image under 5MB.' });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please select a JPG, PNG, or WEBP image.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUriForAI(dataUri);
        if (isWebcamOpen) closeWebcam();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const requestCameraPermission = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        return stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        toast({ variant: 'destructive', title: 'Camera Access Denied', description: 'Please enable camera permissions.' });
        return null;
      }
    } else {
      setHasCameraPermission(false);
      toast({ variant: 'destructive', title: 'Camera Not Supported', description: 'Browser does not support camera access.' });
      return null;
    }
  };

  const openWebcam = async () => {
    clearImagePreview(); // Clear uploaded image
    const stream = await requestCameraPermission();
    if (stream) setIsWebcamOpen(true);
    else setIsWebcamOpen(false); // Explicitly set to false if stream failed
  };

  const closeWebcam = () => {
    clearWebcamStream();
    setIsWebcamOpen(false);
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
        const dataUrl = canvas.toDataURL('image/webp');
        setImagePreview(dataUrl);
        setImageDataUriForAI(dataUrl);
      }
      closeWebcam();
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageDataUriForAI(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleClearImageAndWebcam = () => {
    clearImagePreview();
    if (isWebcamOpen) closeWebcam();
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStudyData(null);

    const form = event.currentTarget;
    const notesValue = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
    const doubtValue = (form.elements.namedItem('doubt') as HTMLTextAreaElement).value;

    if (!notesValue.trim() && !imageDataUriForAI && !doubtValue.trim()) {
       setError("Please provide notes, an image, or a doubt to get help.");
       setIsLoading(false);
       return;
    }
     if (!doubtValue.trim()){
        setError("Your Doubt/Question field cannot be empty.");
        setIsLoading(false);
        return;
    }


    const formData = new FormData();
    formData.append('notes', notesValue);
    formData.append('doubt', doubtValue);
    if (imageDataUriForAI) {
      formData.append('imageDataUri', imageDataUriForAI);
    }

    const result = await handleStudySession(formData);
    setIsLoading(false);

    if ('error' in result) {
      setError(result.error);
    } else {
      setStudyData(result);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-2 h-7 w-7 text-primary" /> Ask Your AI Tutor</CardTitle>
          <CardDescription>Enter your notes, your specific doubt, and optionally upload an image for context. Gemini will help you out!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground/90 text-lg">Your Notes (Text and/or Image)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Paste your study notes here, or describe the image if you upload one..."
                rows={6}
                className="border-input focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            
            {/* Visual Context Elements Moved Here */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Button type="button" variant="outline" onClick={triggerFileUpload} disabled={isWebcamOpen || isLoading}>
                        <Upload className="mr-2 h-5 w-5" /> Upload Image
                    </Button>
                    <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
                    
                    {isWebcamOpen && hasCameraPermission ? (
                        <Button type="button" variant="destructive" onClick={closeWebcam} disabled={isLoading}>
                            <VideoOff className="mr-2 h-5 w-5" /> Close Webcam
                        </Button>
                    ) : (
                        <Button type="button" variant="outline" onClick={openWebcam} disabled={isLoading}>
                            <Camera className="mr-2 h-5 w-5" /> Open Webcam
                        </Button>
                    )}
                </div>
                
                <div className="flex flex-col items-center w-full max-w-md mx-auto">
                    <video
                        ref={videoRef}
                        className={cn("w-full aspect-video rounded-md border bg-muted", isWebcamOpen && hasCameraPermission ? "block" : "hidden")}
                        autoPlay muted playsInline
                    />
                    {isWebcamOpen && hasCameraPermission && (
                        <Button type="button" onClick={captureImage} className="mt-3 bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                            <Camera className="mr-2 h-5 w-5" /> Capture Photo
                        </Button>
                    )}
                    {isWebcamOpen && hasCameraPermission === false && (
                        <Alert variant="destructive" className="w-full mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Access Denied</AlertTitle>
                            <AlertDescription>
                                Please enable camera permissions in your browser settings and try again.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>

                {imagePreview && (
                    <div className="space-y-3 flex flex-col items-center mt-4">
                        <div className="relative w-full max-w-md border rounded-md overflow-hidden shadow-md bg-muted">
                            <Image src={imagePreview} alt="Notes/Problem preview" width={600} height={400} className="object-contain aspect-video w-full" data-ai-hint="study image preview"/>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={handleClearImageAndWebcam} disabled={isLoading}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear Image
                        </Button>
                    </div>
                )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <Label htmlFor="doubt" className="text-foreground/90 text-lg">Your Doubt/Question (Required)</Label>
              <Textarea
                id="doubt"
                name="doubt"
                placeholder="What are you stuck on? Ask Gemini..."
                rows={3}
                className="border-input focus:border-primary transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-destructive mt-4">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Get AI Help"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <div className="text-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-lg text-muted-foreground">Gemini is thinking...</p>
        </div>
      )}

      {studyData && (
        <Card className="shadow-xl border-primary/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center"><Sparkles className="mr-2 h-7 w-7 text-accent" /> AI Tutor Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-xl text-foreground mb-2">Answer to Your Doubt:</h3>
              <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none p-4 bg-foreground/5 rounded-md shadow">
                <p className="text-foreground/90 whitespace-pre-wrap">{studyData.answer}</p>
              </div>
            </div>

            <div>
                <h3 className="font-semibold text-xl text-foreground mb-2">Flashcard Status:</h3>
                <Alert>
                    <Lightbulb className="h-5 w-5" />
                    <AlertTitle className="font-semibold">Recommendation & Outcome</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap mt-1">
                        {studyData.flashcardRecommendation}
                    </AlertDescription>
                </Alert>
            </div>
            
            {studyData.flashcards && studyData.flashcards.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl text-foreground mb-3">Generated Flashcards:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {studyData.flashcards.map((flashcard: Flashcard, index: number) => (
                    <Card key={index} className="bg-card shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-base font-semibold text-primary">Q: {flashcard.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm text-foreground/80">A: {flashcard.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {studyData.flashcards && typeof studyData.flashcards === 'string' && ( 
                 <div>
                    <h3 className="font-semibold text-xl text-foreground mb-3">Generated Flashcards (Raw Data):</h3>
                    <Alert variant="default" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">Flashcard Parsing Issue</AlertTitle>
                        <AlertDescription className="text-amber-700/90 dark:text-amber-300/90 mt-1">
                            The AI provided flashcard data as a string, but we expected a structured array of question/answer pairs.
                            You can see the raw data below to copy or format it manually. This usually happens if the notes are not well-suited for distinct flashcard generation or if the AI could not extract clear pairs.
                        </AlertDescription>
                    </Alert>
                    <Textarea value={studyData.flashcards} readOnly rows={8} className="bg-muted/50 text-sm mt-3 focus-visible:ring-0 focus-visible:ring-offset-0" />
                 </div>
            )}
             {studyData.practiceQuestions && studyData.practiceQuestions.length > 0 && (
              <div>
                <h3 className="font-semibold text-xl text-foreground mb-3">Practice Questions:</h3>
                <div className="space-y-4">
                  {studyData.practiceQuestions.map((pq, index) => (
                    <PracticeQuestionCard key={index} questionItem={pq} index={index} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

