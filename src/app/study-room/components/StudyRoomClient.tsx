
"use client";

import { useState, type FormEvent, useRef, type ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Lightbulb, AlertCircle, Camera, Upload, Trash2, VideoOff, HelpCircleIcon, BookOpen, FileText, ListChecks } from 'lucide-react';
import { handleStudySession } from '@/lib/actions';
import type { Flashcard, StudyRoomData } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PracticeQuestionCard } from './PracticeQuestionCard';
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import { Separator } from '@/components/ui/separator';
import { FlashcardDisplay } from './FlashcardDisplay'; 


export function StudyRoomClient() {
  const [notesText, setNotesText] = useState("");
  const [doubtText, setDoubtText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyData, setStudyData] = useState<StudyRoomData | null>(null);

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

  const clearImagePreviewAndData = () => {
    setImagePreview(null);
    setImageDataUriForAI(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      if (isWebcamOpen) { // If webcam was open, close it
          closeWebcam();
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUriForAI(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    if (isWebcamOpen) {
        closeWebcam();
    }
    fileInputRef.current?.click()
  };

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
    clearImagePreviewAndData(); 
    const stream = await requestCameraPermission();
    if (stream) setIsWebcamOpen(true);
    else setIsWebcamOpen(false); 
  };

  const closeWebcam = () => {
    clearWebcamStream();
    setIsWebcamOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && streamRef.current && videoRef.current.readyState >= videoRef.current.HAVE_METADATA) {
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
    } else {
        toast({
            variant: "destructive",
            title: "Webcam Error",
            description: "Could not capture image. Webcam might not be ready."
        });
    }
  };
  
  const handleClearImageAndWebcam = () => {
    clearImagePreviewAndData();
    if (isWebcamOpen) {
      closeWebcam();
    }
  }

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    if (!doubtText.trim()) return true;
    if (!notesText.trim() && !imageDataUriForAI) return true;
    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStudyData(null);

    if (!doubtText.trim()){
        setError("Your Doubt/Question field cannot be empty.");
        toast({ variant: "destructive", title: "Input Error", description: "Your Doubt/Question field cannot be empty." });
        return;
    }
    if (!notesText.trim() && !imageDataUriForAI) {
       setError("Please provide either notes or an image (or both) to give context to your doubt.");
       toast({ variant: "destructive", title: "Input Error", description: "Please provide notes and/or an image for your doubt." });
       return;
    }

    setIsLoading(true); 

    const formData = new FormData();
    formData.append('notes', notesText);
    formData.append('doubt', doubtText);
    if (imageDataUriForAI) {
      formData.append('imageDataUri', imageDataUriForAI);
    }

    try {
      const result = await handleStudySession(formData);
      if ('error' in result) {
        setError(result.error);
      } else {
        setStudyData(result);
      }
    } catch (clientError) {
      console.error("Client error calling handleStudySession:", clientError);
      setError("An unexpected client-side error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl sm:text-2xl flex items-center"><Wand2 className="mr-2 h-6 sm:h-7 w-6 sm:w-7 text-primary" /> Ask Your AI Tutor</CardTitle>
          <CardDescription className="text-sm sm:text-base">Enter your notes, your specific doubt, and optionally upload an image for context. Gemini will help you out!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground/90 text-md sm:text-lg">Your Notes (Text and/or Image)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Paste your study notes here, or describe the image if you upload one..."
                rows={6}
                className="border-input focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Button type="button" variant="outline" onClick={triggerFileUpload} disabled={isWebcamOpen || isLoading} className="text-xs sm:text-sm">
                        <Upload className="mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Upload Image
                    </Button>
                    <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
                    
                    {isWebcamOpen && hasCameraPermission ? (
                        <Button type="button" variant="destructive" onClick={closeWebcam} disabled={isLoading} className="text-xs sm:text-sm">
                            <VideoOff className="mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Close Webcam
                        </Button>
                    ) : (
                        <Button type="button" variant="outline" onClick={openWebcam} disabled={isLoading} className="text-xs sm:text-sm">
                            <Camera className="mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Open Webcam
                        </Button>
                    )}
                </div>
                
                <div className="flex flex-col items-center w-full max-w-md mx-auto">
                    <video
                        ref={videoRef}
                        className={cn("w-full aspect-video rounded-md border bg-muted", isWebcamOpen && hasCameraPermission === true ? "block" : "hidden")}
                        autoPlay muted playsInline
                    />
                    {isWebcamOpen && hasCameraPermission === true && (
                        <Button type="button" onClick={captureImage} className="mt-3 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm" disabled={isLoading}>
                            <Camera className="mr-2 h-4 sm:h-5 w-4 sm:w-5" /> Capture Photo
                        </Button>
                    )}
                    {hasCameraPermission === false && ( 
                        <Alert variant="destructive" className="w-full mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm sm:text-base">Camera Access Denied</AlertTitle>
                            <AlertDescription className="text-xs sm:text-sm">
                                To capture an image, EduVerse needs camera access. Please enable camera permissions in your browser settings and try again. You can still upload an image.
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
                    </div>
                )}
                {(imagePreview || (isWebcamOpen && hasCameraPermission)) && (
                     <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleClearImageAndWebcam} 
                        disabled={isLoading}
                        className="w-full max-w-xs mx-auto mt-3 block text-xs sm:text-sm"
                    >
                        <Trash2 className="mr-2 h-3 sm:h-4 w-3 sm:w-4" /> 
                        {isWebcamOpen && hasCameraPermission ? "Close Webcam & Clear" : "Clear Image"}
                    </Button>
                )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <Label htmlFor="doubt" className="text-foreground/90 text-md sm:text-lg">Your Doubt/Question (Required)</Label>
              <Textarea
                id="doubt"
                name="doubt"
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 sm:py-3 text-base sm:text-lg" disabled={isSubmitDisabled()}>
              {isLoading ? <Loader2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 animate-spin" /> : "Get AI Help"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <div className="text-center py-6">
          <Loader2 className="h-10 sm:h-12 w-10 sm:w-12 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-md sm:text-lg text-muted-foreground">Gemini is thinking...</p>
        </div>
      )}

      {studyData && (
        <Card className="shadow-xl border-primary/50">
          <CardHeader>
            <CardTitle className="font-headline text-xl sm:text-2xl flex items-center"><Sparkles className="mr-2 h-6 sm:h-7 w-6 sm:w-7 text-accent" /> AI Tutor Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-2 flex items-center">
                <FileText className="mr-2 h-5 sm:h-6 w-5 sm:h-6 text-primary" /> Answer to Your Doubt:
              </h3>
              <div className="prose prose-xs sm:prose-sm lg:prose-base dark:prose-invert max-w-none p-3 sm:p-4 bg-foreground/5 rounded-md shadow">
                <p className="text-foreground/90 whitespace-pre-wrap">{studyData.answer}</p>
              </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-2 flex items-center">
                  <Lightbulb className="mr-2 h-5 sm:h-6 w-5 sm:h-6 text-primary" /> Flashcard Status:
                </h3>
                <Alert>
                    <Lightbulb className="h-4 sm:h-5 w-4 sm:h-5" />
                    <AlertTitle className="font-semibold text-sm sm:text-base">Recommendation & Outcome</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap mt-1 text-xs sm:text-sm">
                        {studyData.flashcardRecommendation}
                    </AlertDescription>
                </Alert>
            </div>
            
            {studyData.flashcards && Array.isArray(studyData.flashcards) && studyData.flashcards.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-3 flex items-center">
                  <BookOpen className="mr-2 h-5 sm:h-6 w-5 sm:h-6 text-primary" /> Generated Flashcards:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {studyData.flashcards.map((flashcard: Flashcard, index: number) => (
                    <FlashcardDisplay key={index} flashcard={flashcard} />
                  ))}
                </div>
              </div>
            )}
            {studyData.flashcards && typeof studyData.flashcards === 'string' && ( 
                 <div>
                    <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-3 flex items-center">
                      <BookOpen className="mr-2 h-5 sm:h-6 w-5 sm:h-6 text-primary" /> Generated Flashcards (Raw Data):
                    </h3>
                    <Alert variant="default" className="bg-amber-50 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700">
                        <AlertCircle className="h-4 sm:h-5 w-4 sm:h-5 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="font-semibold text-sm sm:text-base text-amber-700 dark:text-amber-300">Flashcard Parsing Issue</AlertTitle>
                        <AlertDescription className="text-xs sm:text-sm text-amber-700/90 dark:text-amber-300/90 mt-1">
                            The AI provided flashcard data as a string, but we expected a structured array of question/answer pairs.
                            You can see the raw data below to copy or format it manually. This usually happens if the notes are not well-suited for distinct flashcard generation or if the AI could not extract clear pairs.
                        </AlertDescription>
                    </Alert>
                    <Textarea value={studyData.flashcards} readOnly rows={8} className="bg-muted/50 text-sm mt-3 focus-visible:ring-0 focus-visible:ring-offset-0" />
                 </div>
            )}
            
            {studyData.practiceQuestions && studyData.practiceQuestions.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-3 flex items-center">
                  <ListChecks className="mr-2 h-5 sm:h-6 w-5 sm:h-6 text-primary" /> Practice Questions:
                </h3>
                <div className="space-y-4">
                  {studyData.practiceQuestions.map((pq, index) => (
                    <PracticeQuestionCard key={index} questionItem={pq} index={index} />
                  ))}
                </div>
              </div>
            )}
            {(!studyData.practiceQuestions || studyData.practiceQuestions.length === 0) && (
              <div>
                <h3 className="font-semibold text-lg sm:text-xl text-foreground mb-2 flex items-center">
                  <ListChecks className="mr-2 h-5 sm:h-6 w-5 sm:h-6 text-primary" /> Practice Questions Status:
                </h3>
                <Alert>
                  <HelpCircleIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                  <AlertTitle className="font-semibold text-sm sm:text-base">No Practice Questions Generated</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap mt-1 text-xs sm:text-sm">
                    The AI determined that practice questions were not suitable for the provided material, or no material was suitable for them.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

