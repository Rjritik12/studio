
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, TimerIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const POMODORO_DURATION = 25 * 60; // 25 minutes
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export function MockPomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const getDuration = useCallback((currentMode: TimerMode) => {
    switch (currentMode) {
      case 'pomodoro':
        return POMODORO_DURATION;
      case 'shortBreak':
        return SHORT_BREAK_DURATION;
      case 'longBreak':
        return LONG_BREAK_DURATION;
      default:
        return POMODORO_DURATION;
    }
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) { // Timer finished
        setIsRunning(false);
        if (mode === 'pomodoro') {
          const newCompleted = pomodorosCompleted + 1;
          setPomodorosCompleted(newCompleted);
          if (newCompleted % 4 === 0) {
            setMode('longBreak');
            setTimeLeft(LONG_BREAK_DURATION);
          } else {
            setMode('shortBreak');
            setTimeLeft(SHORT_BREAK_DURATION);
          }
        } else { // Break finished
          setMode('pomodoro');
          setTimeLeft(POMODORO_DURATION);
        }
        // Optionally, play a sound here
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, mode, pomodorosCompleted, getDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) setIsRunning(false); // Pause if running
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
  }

  const modeTitles: Record<TimerMode, string> = {
    pomodoro: "Focus Session",
    shortBreak: "Short Break",
    longBreak: "Long Break"
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-3 pt-4 text-center">
        <CardTitle className="font-headline text-lg flex items-center justify-center">
          <TimerIcon className="mr-2 h-5 w-5 text-accent" /> Pomodoro Timer (Mock)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-2 w-full sm:w-auto">
          <Button size="sm" variant={mode === 'pomodoro' ? 'default' : 'outline'} onClick={() => handleModeChange('pomodoro')} className="w-full sm:w-auto">Focus</Button>
          <Button size="sm" variant={mode === 'shortBreak' ? 'default' : 'outline'} onClick={() => handleModeChange('shortBreak')} className="w-full sm:w-auto">Short Break</Button>
          <Button size="sm" variant={mode === 'longBreak' ? 'default' : 'outline'} onClick={() => handleModeChange('longBreak')} className="w-full sm:w-auto">Long Break</Button>
        </div>
         <p className="text-sm text-muted-foreground -mt-1 mb-1">{modeTitles[mode]}</p>
        <div className="text-5xl font-mono font-bold text-primary tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
          <Button onClick={handleStartPause} className={cn("w-full sm:w-24", isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600")}>
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full sm:w-24">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Pomodoros completed: {pomodorosCompleted}</p>
      </CardContent>
    </Card>
  );
}
