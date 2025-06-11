
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
            if (wrongOptions.length === 0) { 
                wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
            }
            const optionToKeep = wrongOptions.length > 0 ? wrongOptions[Math.floor(Math.random() * wrongOptions.length)] : currentQuestion.options.find(opt => opt !== correctAnswer); 
            
            const newDisplayedOptions = [correctAnswer];
            if (optionToKeep) {
                newDisplayedOptions.push(optionToKeep);
            }
            
            while (newDisplayedOptions.length < 2 && currentQuestion.options.length > newDisplayedOptions.length) {
                const randomOption = currentQuestion.options[Math.floor(Math.random() * currentQuestion.options.length)];
                if (!newDisplayedOptions.includes(randomOption)) {
                    newDisplayedOptions.push(randomOption);
                }
            }

            setDisplayedOptions(newDisplayedOptions.sort(() => Math.random() - 0.5));
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
            const optionsToPoll = displayedOptions.length > 0 ? displayedOptions : currentQuestion.options;
            const numOptions = optionsToPoll.length;

            if (numOptions === 0) {
                setLifelines(prev => ({ ...prev, [type]: { ...prev[type], used: true, isLoading: false }}));
                break;
            }
            
            let totalPercentage = 100;
            let assignedPercentages = 0;

            // Give correct answer a significantly higher chance
            const correctAnswerIndex = optionsToPoll.indexOf(currentQuestion.correctAnswer);
            
            const votes = optionsToPoll.map((option, index) => {
                let voteShare = Math.random() * (100 / numOptions); // basic random share
                if (index === correctAnswerIndex) {
                    voteShare += Math.random() * 20 + 20; // Add a boost of 20-40% to correct answer
                }
                return { option, voteShare };
            });

            const totalVoteShare = votes.reduce((sum, v) => sum + v.voteShare, 0);

            if (totalVoteShare === 0) { // Extremely unlikely, but handle
                 optionsToPoll.forEach((opt, idx) => {
                    poll[opt] = idx === 0 ? 100 : 0;
                 });
            } else {
                for (let i = 0; i < optionsToPoll.length; i++) {
                    const option = optionsToPoll[i];
                    if (i === optionsToPoll.length - 1) {
                        poll[option] = totalPercentage - assignedPercentages;
                    } else {
                        const calculatedPercent = Math.round((votes[i].voteShare / totalVoteShare) * totalPercentage);
                        // Ensure not to over-assign due to rounding on last few items
                        const maxPossible = totalPercentage - assignedPercentages - (optionsToPoll.length - 1 - i); // Leave at least 1% for remaining
                        const actualPercent = Math.min(calculatedPercent, maxPossible > 0 ? maxPossible : calculatedPercent );
                        
                        poll[option] = actualPercent > 0 ? actualPercent : (calculatedPercent > 0 ? 1: 0); // Ensure at least 1 if calculated >0 and can afford
                        if (totalPercentage - (assignedPercentages + poll[option]) < (optionsToPoll.length -1 -i)) {
                           // if assigning this makes it impossible for others to get at least 1%
                           poll[option] = Math.max(0, (totalPercentage - assignedPercentages) - (optionsToPoll.length -1 - i));
                        }
                        assignedPercentages += poll[option];
                    }
                }
            }

            // Final sanity check to ensure sum is 100
            let currentSum = Object.values(poll).reduce((sum, p) => sum + p, 0);
            if (currentSum !== 100 && optionsToPoll.length > 0) {
                const diff = 100 - currentSum;
                // Add/remove difference from the (first available or correct if possible) option
                const adjustOption = correctAnswerIndex !== -1 ? optionsToPoll[correctAnswerIndex] : optionsToPoll[0];
                if (poll[adjustOption] !== undefined) {
                   poll[adjustOption] += diff;
                   // Ensure no negative percentages
                   if(poll[adjustOption] < 0) {
                        // This case means poll[adjustOption] was small and diff was very negative.
                        // Redistribute the negativity if possible or set to 0.
                        // For simplicity, if it goes negative, reset and distribute diff among others
                        // This part can get complex; aiming for 'good enough' simulation
                        poll[adjustOption] = 0;
                        currentSum = Object.values(poll).reduce((sum, p) => sum + p, 0);
                        if(currentSum !== 100){
                             const remainingDiff = 100 - currentSum;
                             const otherOptions = optionsToPoll.filter(opt => opt !== adjustOption);
                             if(otherOptions.length > 0 && poll[otherOptions[0]] !== undefined){
                                poll[otherOptions[0]] += remainingDiff;
                             } else if (optionsToPoll.length > 0 && poll[optionsToPoll[0]] !== undefined && optionsToPoll[0] !== adjustOption){
                                poll[optionsToPoll[0]] += remainingDiff;
                             }
                             // final fallback if all else fails (e.g. single option poll)
                             else if (poll[adjustOption] !== undefined) poll[adjustOption] = 100;
                        }
                   }
                } else if (poll[optionsToPoll[0]] !== undefined){ // fallback to first option
                    poll[optionsToPoll[0]] += diff;
                }
            }


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
        <Label className="text-sm text-muted-foreground">KBC Ladder Progress</Label>
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
