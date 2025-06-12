
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
    const nextQuestionIndex = currentQuestionIndex + 1; // Recalculate based on potentially changed currentQuestionIndex
    if (questions[nextQuestionIndex]) {
       setDisplayedOptions(questions[nextQuestionIndex].options);
    }
  }, [currentQuestionIndex, questions]); // Ensure `questions` is a dependency

  // Effect to handle game end transition
  useEffect(() => {
    if (gameOver) {
      const timerId = setTimeout(() => {
        onGameEnd(score); // Pass the final score
      }, 2000); // Delay to allow user to see feedback on the last question
      return () => clearTimeout(timerId);
    }
  }, [gameOver, score, onGameEnd]);


  const handleAnswer = useCallback((answer: string | null) => {
    if (selectedAnswer || gameOver) return; // Prevent re-entry

    setSelectedAnswer(answer || "Time's up"); // Mark "Time's up" if null answer
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setAnswerStatus('correct');

      // Check if it's the last question
      if (currentQuestionIndex >= questions.length - 1) {
        setTimeout(() => setGameOver(true), 0); // Game ends after this correct answer (timeout 0 to ensure state updates batch)
      } else {
        // Not the last question, prepare for next after a delay
        setTimeout(() => {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          resetForNextQuestion();
        }, 2000);
      }
    } else {
      // Incorrect answer
      setAnswerStatus('incorrect');
      setTimeout(() => setGameOver(true), 0); // Game ends on incorrect answer
    }
  }, [selectedAnswer, gameOver, currentQuestion, currentQuestionIndex, questions.length, resetForNextQuestion]);

  // Timer effect
  useEffect(() => {
    if (gameOver || selectedAnswer) return; // Stop timer if game over or answer selected

    if (timeLeft === 0) {
      setSelectedAnswer("Time's up"); // Visually indicate time's up
      setAnswerStatus('incorrect'); // Treat as incorrect
      setGameOver(true); // Trigger game over
      return; // Stop further timer processing for this cycle
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, selectedAnswer]);


  const handleLifeline = async (type: Lifeline) => {
    if (lifelines[type].used || gameOver || selectedAnswer || lifelines[type].isLoading) return;

    setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: true }}));

    try {
      switch (type) {
        case '50-50':
          {
            const correctAnswer = currentQuestion.correctAnswer;
            let wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
            wrongOptions.sort(() => Math.random() - 0.5);
            const optionToKeep = wrongOptions.length > 0 ? wrongOptions[0] : undefined;
            const newDisplayedOptions = [correctAnswer];
            if (optionToKeep) newDisplayedOptions.push(optionToKeep);
            setDisplayedOptions([...new Set(newDisplayedOptions)].sort(() => Math.random() - 0.5));
            setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            break;
          }
        case 'AI_Hint':
          {
            const hintInput: HintInput = { question: currentQuestion.question, options: currentQuestion.options, correctAnswer: currentQuestion.correctAnswer };
            const hintResult = await handleGetQuizHint(hintInput);
            if ('error' in hintResult) {
              toast({ title: "Error", description: hintResult.error, variant: "destructive" });
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }}));
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
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }})); 
            } else {
              const newQuestionData = { ...flipResult.question, topic: flipInput.topic, difficulty: flipInput.difficulty };
              const updatedQuestions = [...questions];
              updatedQuestions[currentQuestionIndex] = newQuestionData;
              setQuestions(updatedQuestions);
              
              // Reset states for the new question at the current index
              setSelectedAnswer(null);
              setAnswerStatus(null);
              setTimeLeft(TIME_PER_QUESTION);
              setHintText(null);
              setAudiencePollResults(null);
              setDisplayedOptions(newQuestionData.options); 
              
              toast({ title: "Question Flipped!", description: "A new question has been loaded." });
              setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            }
            break;
          }
        case 'Audience_Poll':
          {
            const poll: Record<string, number> = {};
            const optionsToPoll = displayedOptions.length > 0 ? displayedOptions : currentQuestion.options;
            const numOptions = optionsToPoll.length;

            if (numOptions === 0) {
                setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
                break;
            }
            
            let percentages = new Array(numOptions).fill(0);
            let totalPercentage = 100;
            
            const correctAnswerIndex = optionsToPoll.indexOf(currentQuestion.correctAnswer);
            if (correctAnswerIndex !== -1) {
                percentages[correctAnswerIndex] = Math.floor(Math.random() * 21) + 30; // 30 to 50
            } else {
                const randomIndex = Math.floor(Math.random() * numOptions);
                percentages[randomIndex] = Math.floor(Math.random() * 21) + 30;
            }

            let remainingPercentage = totalPercentage - percentages.reduce((a, b) => a + b, 0);
            
            const otherIndices = optionsToPoll.map((_,i) => i).filter(i => percentages[i] === 0);
            otherIndices.forEach((idx, arrIdx) => {
                if (arrIdx === otherIndices.length - 1) {
                    percentages[idx] = remainingPercentage;
                } else {
                    const randomShare = Math.floor(Math.random() * (remainingPercentage / (otherIndices.length - arrIdx)));
                    percentages[idx] = randomShare;
                    remainingPercentage -= randomShare;
                }
            });
            
            let currentSum = percentages.reduce((a, b) => a + b, 0);
            if (currentSum !== totalPercentage && numOptions > 0) {
                const diff = totalPercentage - currentSum;
                const adjustIdx = correctAnswerIndex !== -1 ? correctAnswerIndex : percentages.indexOf(Math.max(...percentages));
                 if (adjustIdx >= 0 && adjustIdx < percentages.length) { percentages[adjustIdx] += diff; }
            }
            
            percentages = percentages.map(p => Math.max(0, p)); 
            currentSum = percentages.reduce((a,b) => a+b, 0);
            if (currentSum !== totalPercentage && numOptions > 0) { 
                 const primaryIdx = correctAnswerIndex !== -1 ? correctAnswerIndex : 0;
                 if (primaryIdx >= 0 && primaryIdx < percentages.length) { percentages[primaryIdx] += (totalPercentage - currentSum); }
            }


            optionsToPoll.forEach((opt, idx) => {
                poll[opt] = percentages[idx] || 0; // Ensure poll[opt] is a number
            });

            setAudiencePollResults(poll);
            setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
            break;
          }
      }
    } catch (error) {
        console.error("Lifeline error:", error);
        toast({ title: "Error", description: `Could not use ${type} lifeline.`, variant: "destructive" });
        setLifelines(prev => ({ ...prev, [type]: { ...prev[type], isLoading: false }})); 
    }
  };

  const renderKBCLadder = () => {
    const ladderSteps = Array.from({ length: questions.length }, (_, i) => i + 1);
    const safeHavens = questions.length >= 10 ? [Math.floor(questions.length * 0.3), Math.floor(questions.length * 0.6)] : 
                       questions.length >= 5 ? [Math.floor(questions.length * 0.4)] : [];

    return (
      <Card className="mb-4 shadow-md">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="font-headline text-md text-center text-primary">Progress Ladder</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-1.5 px-2 py-2">
          {ladderSteps.map((step) => (
            <div
              key={step}
              className={cn(
                "w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full text-xs font-semibold border-2 transition-all duration-300",
                currentQuestionIndex + 1 === step ? "bg-primary text-primary-foreground border-primary-foreground scale-110 shadow-lg" : 
                currentQuestionIndex + 1 > step ? "bg-green-500 text-white border-green-700 opacity-75" : 
                safeHavens.includes(step) ? "bg-yellow-400 border-yellow-600 text-yellow-900" : 
                "bg-card border-border text-muted-foreground" 
              )}
              title={`Question ${step}`}
            >
              {step}
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
                  "p-4 h-auto text-base justify-start text-left whitespace-normal break-words relative flex-col items-start", 
                  "border-2 rounded-lg transition-all duration-200 ease-in-out", 
                  selectedAnswer === option && answerStatus === 'correct' && 'bg-green-500 border-green-700 text-white hover:bg-green-600',
                  selectedAnswer === option && answerStatus === 'incorrect' && 'bg-red-500 border-red-700 text-white hover:bg-red-600',
                  selectedAnswer && selectedAnswer !== option && option === currentQuestion.correctAnswer && 'bg-green-200 border-green-400 text-green-800 dark:bg-green-700 dark:text-green-100 dark:border-green-600', 
                  !selectedAnswer && 'hover:bg-primary/10 hover:border-primary',
                  (selectedAnswer || gameOver) && 'cursor-not-allowed' // Disable if answer selected or game over
                )}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer || gameOver}
              >
                <div className="w-full flex items-center justify-between"> 
                  <span>{option}</span> 
                  <span className="flex items-center">
                    {selectedAnswer === option && answerStatus === 'correct' && <CheckCircle className="ml-2 h-5 w-5 text-white" />}
                    {selectedAnswer === option && answerStatus === 'incorrect' && <XCircle className="ml-2 h-5 w-5 text-white" />}
                    {selectedAnswer && selectedAnswer !== option && option === currentQuestion.correctAnswer && <CheckCircle className="ml-2 h-5 w-5 text-green-700 dark:text-green-200" />}
                    {audiencePollResults && audiencePollResults[option] !== undefined && !selectedAnswer && ( 
                      <span className="ml-2 text-xs font-bold bg-accent/80 text-accent-foreground px-2 py-0.5 rounded">
                        {audiencePollResults[option]}%
                      </span>
                    )}
                  </span>
                </div>
                {audiencePollResults && audiencePollResults[option] !== undefined && (
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-accent/70 transition-all duration-500 ease-out"
                      style={{ width: `${audiencePollResults[option]}%` }}
                    />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
        {answerStatus && ( // Show feedback only if an answer has been processed
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

      {gameOver && answerStatus === 'incorrect' && ( // Only show this specific "Game Over" card on incorrect answer
        <Card className="text-center p-6 mt-6 bg-destructive/10 border-destructive dark:bg-destructive/20 dark:border-destructive/50 shadow-xl">
          <CardTitle className="font-headline text-2xl mb-3 text-destructive flex items-center justify-center"><AlertCircle className="mr-2" />Game Over!</CardTitle>
          <CardDescription className="text-lg mb-4 text-destructive/80 dark:text-destructive/70">
            You answered incorrectly. Your final score is {score} / {questions.length}.
          </CardDescription>
          {/* Button removed as transition is automatic */}
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

