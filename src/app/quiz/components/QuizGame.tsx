
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion, Lifeline, HintInput, FlipQuestionInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, XCircle, Loader2, LightbulbIcon } from 'lucide-react';
import { LifelineButton } from './LifelineButton';
import { cn } from '@/lib/utils';
import { handleGetQuizHint, handleFlipQuestion } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';


interface QuizGameProps {
  questions: QuizQuestion[];
  onGameEnd: (score: number) => void;
}

const TIME_PER_QUESTION = 30; // seconds

export function QuizGame({ questions: initialQuestions, onGameEnd }: QuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();
  
  const initialLifelines = {
    "50-50": { used: false, isLoading: false },
    "Flip": { used: false, isLoading: false },
    "AI_Hint": { used: false, isLoading: false },
    "Audience_Poll": { used: false, isLoading: false },
  };
  const [lifelines, setLifelines] = useState(initialLifelines);
  const [displayedOptions, setDisplayedOptions] = useState<string[]>([]);
  
  const [hintText, setHintText] = useState<string | null>(null);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [audiencePollResults, setAudiencePollResults] = useState<Record<string, number> | null>(null);
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentTopic = questions[0]?.topic || "general knowledge";
  const currentDifficulty = questions[0]?.difficulty || "medium";

  useEffect(() => {
    if (currentQuestion) {
      setDisplayedOptions(currentQuestion.options);
      setAudiencePollResults(null); 
    }
  }, [currentQuestion]);
  
  const resetForNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setTimeLeft(TIME_PER_QUESTION);
    setHintText(null);
    setAudiencePollResults(null);
    // Ensure displayedOptions are reset for the next question, if it exists
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (questions[nextQuestionIndex]) {
       setDisplayedOptions(questions[nextQuestionIndex].options);
    }
  }, [currentQuestionIndex, questions]);

  // Effect to handle game end transition
  useEffect(() => {
    if (gameOver) {
      const timerId = setTimeout(() => {
        onGameEnd(score); 
      }, 2000); 
      return () => clearTimeout(timerId);
    }
  }, [gameOver, score, onGameEnd]);


  const handleAnswer = useCallback((answer: string | null) => {
    if (selectedAnswer || gameOver) return; 

    setSelectedAnswer(answer || "Time's up"); 
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setAnswerStatus('correct');
      if (currentQuestionIndex >= questions.length - 1) {
        setTimeout(() => setGameOver(true), 0); 
      } else {
        setTimeout(() => {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          resetForNextQuestion();
        }, 2000);
      }
    } else {
      setAnswerStatus('incorrect');
      setTimeout(() => setGameOver(true), 0); 
    }
  }, [selectedAnswer, gameOver, currentQuestion, currentQuestionIndex, questions.length, resetForNextQuestion]);

  // Timer effect
  useEffect(() => {
    if (gameOver || selectedAnswer) return; 

    if (timeLeft === 0) {
      handleAnswer(null); // Pass null to indicate time's up
      return; 
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, selectedAnswer, handleAnswer]);


  const handleLifeline = async (type: Lifeline) => {
    if (lifelines[type].used || gameOver || selectedAnswer || lifelines[type].isLoading) return;

    setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: true }}));

    try {
      switch (type) {
        case '50-50':
          {
            const correctAnswer = currentQuestion.correctAnswer;
            let wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
            wrongOptions.sort(() => Math.random() - 0.5); // Shuffle wrong options
            const optionToKeep = wrongOptions.length > 0 ? wrongOptions[0] : undefined; // Pick one random wrong option
            
            const newDisplayedOptions = [correctAnswer];
            if (optionToKeep) {
                newDisplayedOptions.push(optionToKeep);
            }
            // Shuffle the final two options
            setDisplayedOptions(newDisplayedOptions.sort(() => Math.random() - 0.5));
            setLifelines(prev => ({ ...prev, [type]: { used: true, isLoading: false }}));
            break;
          }
        case 'AI_Hint':
          {
            const hintInput: HintInput = { question: currentQuestion.question, options: currentQuestion.options, correctAnswer: currentQuestion.correctAnswer };
            const hintResult = await handleGetQuizHint(hintInput);
            if ('error' in hintResult) {
              toast({ title: "Error Getting Hint", description: hintResult.error, variant: "destructive" });
            } else {
              setHintText(hintResult.hint);
              setShowHintDialog(true);
            }
            setLifelines(prev => ({ ...prev, [type]: { used: true, isLoading: false }}));
            break;
          }
        case 'Flip':
          {
            const flipInput: FlipQuestionInput = { 
              topic: currentQuestion.topic || currentTopic, 
              difficulty: currentQuestion.difficulty || currentDifficulty,
              existingQuestions: questions.map(q => q.question) 
            };
            const flipResult = await handleFlipQuestion(flipInput);
            if ('error' in flipResult || !flipResult.question) {
              toast({ title: "Error Flipping Question", description: flipResult.error || "Failed to flip question.", variant: "destructive" });
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }})); 
            } else {
              const newQuestionData = { ...flipResult.question, topic: flipInput.topic, difficulty: flipInput.difficulty };
              const updatedQuestions = [...questions];
              updatedQuestions[currentQuestionIndex] = newQuestionData;
              setQuestions(updatedQuestions); // This will trigger useEffect for currentQuestion
              
              // Reset states for the new question
              setSelectedAnswer(null);
              setAnswerStatus(null);
              setTimeLeft(TIME_PER_QUESTION);
              setHintText(null);
              setAudiencePollResults(null);
              // setDisplayedOptions will be updated by the useEffect watching currentQuestion
              
              toast({ title: "Question Flipped!", description: "A new question has been loaded." });
              setLifelines(prev => ({ ...prev, [type]: { used: true, isLoading: false }}));
            }
            break;
          }
        case 'Audience_Poll':
          {
            const poll: Record<string, number> = {};
            const optionsToPoll = displayedOptions.length > 0 ? displayedOptions : currentQuestion.options;
            const numOptions = optionsToPoll.length;

            if (numOptions === 0) {
                setLifelines(prev => ({ ...prev, [type]: { used: true, isLoading: false }}));
                break;
            }
            
            let percentages = new Array(numOptions).fill(0);
            let totalPercentage = 100;
            
            // Give correct answer a higher base
            const correctAnswerIndex = optionsToPoll.indexOf(currentQuestion.correctAnswer);
            if (correctAnswerIndex !== -1) {
                percentages[correctAnswerIndex] = Math.floor(Math.random() * 31) + 40; // 40% to 70% for correct answer
            } else {
                // If correct answer not in options (e.g. after 50-50, though poll should ideally be before)
                // distribute somewhat evenly or pick a random high one
                const randomIndex = Math.floor(Math.random() * numOptions);
                percentages[randomIndex] = Math.floor(Math.random() * 21) + 30; // 30 to 50
            }

            let remainingPercentage = totalPercentage - percentages.reduce((a, b) => a + b, 0);
            
            const otherIndices = optionsToPoll.map((_,i) => i).filter(i => percentages[i] === 0);
            otherIndices.forEach((idx, arrIdx) => {
                if (arrIdx === otherIndices.length - 1) { // Last one gets the remainder
                    percentages[idx] = Math.max(0, remainingPercentage); // Ensure not negative
                } else {
                    // Distribute remaining percentage among other options
                    const randomShare = Math.max(0, Math.floor(Math.random() * (remainingPercentage / (otherIndices.length - arrIdx) + 1)));
                    percentages[idx] = randomShare;
                    remainingPercentage -= randomShare;
                }
            });
             // Normalize if sum is not 100
            let currentSum = percentages.reduce((a,b) => a+b,0);
            if (currentSum !== totalPercentage && numOptions > 0) {
                const diff = totalPercentage - currentSum;
                // Add/remove difference to/from the correct answer or highest polled option
                const adjustIdx = correctAnswerIndex !== -1 ? correctAnswerIndex : percentages.indexOf(Math.max(...percentages));
                if(adjustIdx >= 0 && adjustIdx < percentages.length) {
                  percentages[adjustIdx] += diff;
                  percentages[adjustIdx] = Math.max(0, percentages[adjustIdx]); // ensure not negative
                }
            }
            // Final check to ensure sum is 100 and no negative values
             percentages = percentages.map(p => Math.max(0, Math.round(p)));
             currentSum = percentages.reduce((a,b) => a+b,0);
             if (currentSum !== totalPercentage && numOptions > 0) {
                 const primaryIdx = correctAnswerIndex !== -1 ? correctAnswerIndex : 0;
                 if (primaryIdx >= 0 && primaryIdx < percentages.length) {
                     percentages[primaryIdx] += (totalPercentage - currentSum);
                     percentages[primaryIdx] = Math.max(0, percentages[primaryIdx]);
                 }
             }


            optionsToPoll.forEach((opt, idx) => {
                poll[opt] = percentages[idx] || 0; 
            });

            setAudiencePollResults(poll);
            setLifelines(prev => ({ ...prev, [type]: { used: true, isLoading: false }}));
            break;
          }
      }
    } catch (error) {
        console.error("Lifeline error:", error);
        toast({ title: "Error", description: `Could not use ${type} lifeline.`, variant: "destructive" });
    } finally {
        // Ensure isLoading is set to false even if not explicitly set in every case
        if (lifelines[type]?.isLoading) {
             setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }}));
        }
    }
  };

  const renderKBCLadder = () => {
    const ladderSteps = Array.from({ length: questions.length }, (_, i) => i + 1);
    const safeHavens = questions.length >= 10 ? [Math.floor(questions.length * 0.3), Math.floor(questions.length * 0.6)] : 
                       questions.length >= 5 ? [Math.floor(questions.length * 0.4)] : [];

    return (
      <Card className="mb-6 shadow-lg border-2 border-primary/30">
        <CardHeader className="pb-2 pt-3 bg-primary/5 rounded-t-lg">
          <CardTitle className="font-headline text-md text-center text-primary">Question Ladder</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-2 p-3">
          {ladderSteps.map((step) => (
            <div
              key={step}
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-xs font-semibold border-2 transition-all duration-300",
                currentQuestionIndex + 1 === step ? "bg-primary text-primary-foreground border-white scale-110 shadow-xl ring-2 ring-primary ring-offset-1" : 
                currentQuestionIndex + 1 > step ? "bg-green-500 text-white border-green-600 opacity-80" : 
                safeHavens.includes(step) ? "bg-accent/80 border-accent text-accent-foreground font-bold shadow-md ring-1 ring-accent/50 transform scale-105" : 
                "bg-card border-border text-muted-foreground hover:bg-muted/50" 
              )}
              title={`Question ${step}`}
            >
              Q{step}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };


  if (!currentQuestion) {
    return (
      <Card className="text-center p-8 shadow-lg">
        <CardTitle className="font-headline text-2xl">Loading Quiz...</CardTitle>
        <CardDescription>Preparing your challenge.</CardDescription>
         {questions.length === 0 && <p className="text-destructive mt-2">No questions loaded. There might have been an issue generating them.</p>}
      </Card>
    );
  }

  const overallProgressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {renderKBCLadder()}
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
          <CardTitle className="font-headline text-xl md:text-2xl text-primary">Question {currentQuestionIndex + 1} / {questions.length}</CardTitle>
          <div className="flex items-center text-lg font-semibold text-accent">
            <Clock className="mr-2 h-6 w-6" /> {timeLeft}s
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-lg md:text-xl text-foreground/90 mb-6 min-h-[60px]">{currentQuestion.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "p-4 h-auto text-base justify-start text-left whitespace-normal break-words relative overflow-hidden", // Added overflow-hidden
                  "border-2 rounded-lg transition-all duration-200 ease-in-out", 
                  selectedAnswer === option && answerStatus === 'correct' && 'bg-green-500 border-green-700 text-white hover:bg-green-600',
                  selectedAnswer === option && answerStatus === 'incorrect' && 'bg-red-500 border-red-700 text-white hover:bg-red-600',
                  selectedAnswer && selectedAnswer !== option && option === currentQuestion.correctAnswer && 'bg-green-200 border-green-400 text-green-800 dark:bg-green-700 dark:text-green-100 dark:border-green-600', 
                  !selectedAnswer && 'hover:bg-primary/10 hover:border-primary',
                  (selectedAnswer || gameOver) && 'cursor-not-allowed' 
                )}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer || gameOver || lifelines['50-50'].isLoading || lifelines['Flip'].isLoading || lifelines['AI_Hint'].isLoading || lifelines['Audience_Poll'].isLoading}
              >
                {audiencePollResults && audiencePollResults[option] !== undefined && !selectedAnswer && (
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-accent/20 dark:bg-accent/40 transition-all duration-500 ease-out z-0"
                    style={{ width: `${audiencePollResults[option]}%` }}
                  />
                )}
                <div className="w-full flex items-center justify-between relative z-10"> {/* Content on top */}
                  <span>{option}</span> 
                  <span className="flex items-center">
                    {selectedAnswer === option && answerStatus === 'correct' && <CheckCircle className="ml-2 h-5 w-5 text-white" />}
                    {selectedAnswer === option && answerStatus === 'incorrect' && <XCircle className="ml-2 h-5 w-5 text-white" />}
                    {selectedAnswer && selectedAnswer !== option && option === currentQuestion.correctAnswer && <CheckCircle className="ml-2 h-5 w-5 text-green-700 dark:text-green-200" />}
                    {audiencePollResults && audiencePollResults[option] !== undefined && !selectedAnswer && ( 
                      <span className="ml-2 text-xs font-bold bg-accent/90 text-accent-foreground px-2 py-0.5 rounded shadow-sm">
                        {audiencePollResults[option]}%
                      </span>
                    )}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        {answerStatus && ( 
          <CardFooter className="mt-4 border-t pt-4">
            {answerStatus === 'correct' && <p className="text-green-600 font-semibold flex items-center"><CheckCircle className="mr-2"/>Correct! {currentQuestionIndex < questions.length - 1 ? 'Moving to next question...' : 'Quiz completed!'}</p>}
            {answerStatus === 'incorrect' && <p className="text-red-600 font-semibold flex items-center"><XCircle className="mr-2"/>Incorrect! Correct answer was: {currentQuestion.correctAnswer}</p>}
          </CardFooter>
        )}
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-lg text-primary">Lifelines</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(lifelines) as Lifeline[]).map(type => (
            <LifelineButton 
              key={type} 
              type={type} 
              onClick={() => handleLifeline(type)} 
              disabled={!!selectedAnswer || gameOver || lifelines[type].isLoading || lifelines[type].used}
              used={lifelines[type].used} 
            />
          ))}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground min-h-[20px] pt-3">
            {lifelines['Flip'].isLoading && <span>Flipping question... <Loader2 className="inline h-3 w-3 animate-spin" /></span>}
            {lifelines['AI_Hint'].isLoading && <span>Getting hint... <Loader2 className="inline h-3 w-3 animate-spin" /></span>}
            {lifelines['50-50'].isLoading && <span>Applying 50-50... <Loader2 className="inline h-3 w-3 animate-spin" /></span>}
            {lifelines['Audience_Poll'].isLoading && <span>Polling audience... <Loader2 className="inline h-3 w-3 animate-spin" /></span>}
        </CardFooter>
      </Card>
      
      <div>
        <Label className="text-sm text-muted-foreground">Overall Quiz Progress</Label>
        <Progress value={overallProgressPercentage} className="w-full h-3 mt-1" />
        <p className="text-xs text-right text-muted-foreground mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>

      {gameOver && answerStatus === 'incorrect' && ( 
        <Card className="text-center p-6 mt-6 bg-destructive/10 border-destructive dark:bg-destructive/20 dark:border-destructive/50 shadow-xl">
          <CardTitle className="font-headline text-2xl mb-3 text-destructive flex items-center justify-center"><AlertCircle className="mr-2" />Game Over!</CardTitle>
          <CardDescription className="text-lg mb-4 text-destructive/80 dark:text-destructive/70">
            You answered incorrectly. Your final score is {score} / {questions.length}.
          </CardDescription>
        </Card>
      )}

      <AlertDialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><LightbulbIcon className="mr-2 text-primary h-5 w-5" /> AI Hint</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-wrap">
              {hintText || "Loading hint..."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowHintDialog(false)}>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

