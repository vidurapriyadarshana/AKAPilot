"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePomodoroStore } from "@/store/pomodoroStore";

interface PomodoroTimerProps {
  sessionId: number;
}

export default function PomodoroTimer({ sessionId }: PomodoroTimerProps) {
  const { addPomodoro } = usePomodoroStore();

  const WORK_DURATION = 25 * 60; // 25 minutes
  const BREAK_DURATION = 5 * 60; // 5 minutes

  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (!onBreak) {
        // Work session finished → save pomodoro
        handleComplete();
      }
      // auto switch between work/break
      setOnBreak(!onBreak);
      setTimeLeft(onBreak ? WORK_DURATION : BREAK_DURATION);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onBreak]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTimeLeft(WORK_DURATION);
  };

  const handleComplete = async () => {
    await addPomodoro({
      sessionId,
      durationMinutes: 25,
      breakMinutes: 5,
      completed: true,
      createdAt: new Date().toISOString(),
    } as any);
  };

  const handleInterrupt = async () => {
    setIsRunning(false);
    await addPomodoro({
      sessionId,
      durationMinutes: Math.floor((WORK_DURATION - timeLeft) / 60),
      breakMinutes: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    } as any);
    handleReset();
  };

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="text-4xl font-bold">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-muted-foreground">
          {onBreak ? "Break Time" : "Focus Time"}
        </p>
        <div className="flex gap-2">
          <Button onClick={handleStartStop}>
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          {isRunning && (
            <Button variant="destructive" onClick={handleInterrupt}>
              Interrupt
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
