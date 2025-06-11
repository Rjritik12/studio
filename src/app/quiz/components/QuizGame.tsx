
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
    "50-50": { used: false, available: true, isLoading: false },
    "Flip": { used: false, available: true, isLoading: false },
    "AI_Hint": { used: false, available: true, isLoading: false },
    "Audience_Poll": { used: false, available: true, isLoading: false },
  };
  const [lifelines, setLifelines] = useState(initialLifelines);
  const [displayedOptions, setDisplayedOptions] = useState<string[]>([]);
  
  const [hintText, setHintText] = useState<string | null>(null);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [audiencePollResults, setAudiencePollResults] = useState<Record<string, number> | null>(null);
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentTopic = questions[0]?.topic || "general knowledge"; // Fallback topic
  const currentDifficulty = questions[0]?.difficulty || "medium"; // Fallback difficulty


  useEffect(() => {
    if (currentQuestion) {
      setDisplayedOptions(currentQuestion.options);
      setAudiencePollResults(null); // Reset poll results for new question
    }
  }, [currentQuestion]);
  
  useEffect(() => {
    if (gameOver || selectedAnswer) return;

    if (timeLeft === 0) {
      handleAnswer(null); 
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, selectedAnswer]);

  const resetForNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setAnswerStatus(null);
    setTimeLeft(TIME_PER_QUESTION);
    setHintText(null);
    setAudiencePollResults(null);
    if (questions[currentQuestionIndex + 1]) {
       setDisplayedOptions(questions[currentQuestionIndex + 1].options);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (answer: string | null) => {
    if (selectedAnswer || gameOver) return;

    setSelectedAnswer(answer || "Time's up");
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
      setGameOver(true); 
    }

    setTimeout(() => {
      if (isCorrect && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        resetForNextQuestion();
      } else {
        setGameOver(true);
        onGameEnd(score + (isCorrect ? 1 : 0));
      }
    }, 2000); 
  };

  const handleLifeline = async (type: Lifeline) => {
    if (lifelines[type].used || gameOver || selectedAnswer || lifelines[type].isLoading) return;

    setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: true }}));

    try {
      switch (type) {
        case '50-50':
          {
            const correctAnswer = currentQuestion.correctAnswer;
            let wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
            const optionToKeep = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
            setDisplayedOptions([correctAnswer, optionToKeep].sort(() => Math.random() - 0.5));
            setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            break;
          }
        case 'AI_Hint':
          {
            const hintInput: HintInput = { question: currentQuestion.question, options: currentQuestion.options, correctAnswer: currentQuestion.correctAnswer };
            const hintResult = await handleGetQuizHint(hintInput);
            if ('error' in hintResult) {
              toast({ title: "Error", description: hintResult.error, variant: "destructive" });
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }})); // Don't mark as used if error
            } else {
              setHintText(hintResult.hint);
              setShowHintDialog(true);
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            }
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
              toast({ title: "Error", description: flipResult.error || "Failed to flip question", variant: "destructive" });
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }})); // Don't mark as used if error
            } else {
              const newQuestion = { ...flipResult.question, topic: flipInput.topic, difficulty: flipInput.difficulty };
              const updatedQuestions = [...questions];
              updatedQuestions[currentQuestionIndex] = newQuestion;
              setQuestions(updatedQuestions);
              setSelectedAnswer(null);
              setAnswerStatus(null);
              setTimeLeft(TIME_PER_QUESTION);
              setHintText(null);
              setAudiencePollResults(null);
              setDisplayedOptions(newQuestion.options);
              toast({ title: "Question Flipped!", description: "A new question has been loaded." });
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            }
            break;
          }
        case 'Audience_Poll':
          {
            const poll: Record<string, number> = {};
            const options = currentQuestion.options;
            const numOptions = options.length;
            if (numOptions === 0) {
                 setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }})); // Mark as used even if no options
                 break;
            }

            const rawVotes: Record<string, number> = {};

            options.forEach(opt => {
              rawVotes[opt] = Math.random() * 20 + 5; // Base votes (e.g., 5 to 25)
            });

            // Give correct answer a significant boost
            rawVotes[currentQuestion.correctAnswer] += Math.random() * 30 + 40; // Add 40-70 to correct answer's votes

            let totalRawVotes = 0;
            options.forEach(opt => {
              totalRawVotes += rawVotes[opt];
            });
            
            if (totalRawVotes === 0) { // Highly unlikely with current logic but safe to handle
                 options.forEach((opt, index) => {
                    poll[opt] = index === 0 ? 100 : 0; // Assign 100% to first if total is 0
                 });
                 // And then re-distribute if more than one option
                 if (numOptions > 0) {
                    const equalShare = Math.floor(100 / numOptions);
                    let remainder = 100 % numOptions;
                    options.forEach((opt, index) => {
                        poll[opt] = equalShare + (remainder > 0 ? 1 : 0);
                        if (remainder > 0) remainder--;
                    });
                 }

            } else {
                 options.forEach(opt => {
                    poll[opt] = Math.round((rawVotes[opt] / totalRawVotes) * 100);
                 });
            }
            
            // Adjust sum to be exactly 100 due to rounding
            let currentSum = 0;
            options.forEach(opt => currentSum += poll[opt]);
            let diff = 100 - currentSum;

            // Distribute/collect the difference
            // Add to highest or remove from lowest (but not below 0)
            if (diff !== 0) {
                const sortedOptionsByVote = [...options].sort((a, b) => poll[b] - poll[a]);
                if (diff > 0) { // Need to add to sum
                    for (let i = 0; i < diff; i++) {
                        poll[sortedOptionsByVote[i % numOptions]]++;
                    }
                } else { // Need to subtract from sum (diff is negative)
                    for (let i = 0; i < Math.abs(diff); i++) {
                        const optToAdjust = sortedOptionsByVote[numOptions - 1 - (i % numOptions)]; // Start from lowest
                        if (poll[optToAdjust] > 0) {
                            poll[optToAdjust]--;
                        } else {
                             // If lowest is 0, try next lowest; this might require more complex loop
                             // For simplicity, if we hit 0, just add it back to the highest to keep sum 100
                             poll[sortedOptionsByVote[0]]--;
                        }
                    }
                }
            }
            // Final check if sum is still not 100, can happen with all 0s or complex adjustments
            currentSum = 0;
            options.forEach(opt => currentSum += poll[opt]);
            if (currentSum !== 100 && numOptions > 0) {
                poll[options[0]] += (100-currentSum); // Add any discrepancy to the first option
            }


            setAudiencePollResults(poll);
            setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            break;
          }
      }
    } catch (error) {
        console.error("Lifeline error:", error);
        toast({ title: "Error", description: `Could not use ${type} lifeline.`, variant: "destructive" });
        setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }})); // Reset loading on error
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="text-center p-8">
        <CardTitle className="font-headline text-2xl">Loading Quiz...</CardTitle>
        <CardDescription>Preparing your challenge.</CardDescription>
         {questions.length === 0 && <p className="text-destructive mt-2">No questions loaded. There might have been an issue generating them.</p>}
      </Card>
    );
  }

  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-headline text-xl md:text-2xl">Question {currentQuestionIndex + 1} / {questions.length}</CardTitle>
          <div className="flex items-center text-lg font-semibold text-primary">
            <Clock className="mr-2 h-6 w-6" /> {timeLeft}s
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg md:text-xl text-foreground/90 mb-6 min-h-[60px]">{currentQuestion.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={cn(
                  "p-4 h-auto text-base justify-start text-left whitespace-normal break-words relative",
                  "border-2 rounded-lg transition-all duration-200 ease-in-out",
                  selectedAnswer === option && answerStatus === 'correct' && 'bg-green-500 border-green-700 text-white hover:bg-green-600',
                  selectedAnswer === option && answerStatus === 'incorrect' && 'bg-red-500 border-red-700 text-white hover:bg-red-600',
                  selectedAnswer && selectedAnswer !== option && option === currentQuestion.correctAnswer && 'bg-green-200 border-green-400 text-green-800', 
                  !selectedAnswer && 'hover:bg-primary/10 hover:border-primary',
                  selectedAnswer && 'cursor-not-allowed'
                )}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer || gameOver}
              >
                {option}
                {audiencePollResults && audiencePollResults[option] !== undefined && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-accent/80 text-accent-foreground px-2 py-0.5 rounded">
                    {audiencePollResults[option]}%
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
        {answerStatus && (
          <CardFooter className="mt-4">
            {answerStatus === 'correct' && <p className="text-green-600 font-semibold flex items-center"><CheckCircle className="mr-2"/>Correct!</p>}
            {answerStatus === 'incorrect' && <p className="text-red-600 font-semibold flex items-center"><XCircle className="mr-2"/>Incorrect! Correct answer: {currentQuestion.correctAnswer}</p>}
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">Lifelines</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(lifelines) as Lifeline[]).map(type => (
            <LifelineButton 
              key={type} 
              type={type} 
              onClick={handleLifeline} 
              disabled={!!selectedAnswer || gameOver || lifelines[type].isLoading}
              used={lifelines[type].used} 
            />
          ))}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground">
            {lifelines['Flip'].isLoading && <span>Flipping question... <Loader2 className="inline h-3 w-3 animate-spin" /></span>}
            {lifelines['AI_Hint'].isLoading && <span>Getting hint... <Loader2 className="inline h-3 w-3 animate-spin" /></span>}
        </CardFooter>
      </Card>
      
      <div>
        <Label className="text-sm text-muted-foreground">Quiz Progress</Label>
        <Progress value={progressPercentage} className="w-full h-3 mt-1" />
        <p className="text-xs text-right text-muted-foreground mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>

      {gameOver && answerStatus && ( 
        <Card className="text-center p-6 mt-6 bg-destructive/10 border-destructive">
          <CardTitle className="font-headline text-2xl mb-3 text-destructive flex items-center justify-center"><AlertCircle className="mr-2" />Game Over!</CardTitle>
          <CardDescription className="text-lg mb-4">Your final score: {score} / {questions.length}</CardDescription>
          <Button onClick={onGameEnd.bind(null, score)} className="bg-primary hover:bg-primary/90 text-primary-foreground">View Results</Button>
        </Card>
      )}

      <AlertDialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center"><LightbulbIcon className="mr-2 text-primary h-5 w-5" /> AI Hint</AlertDialogTitle>
            <AlertDialogDescription>
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
