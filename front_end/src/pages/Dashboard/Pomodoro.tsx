import { useState, useEffect, useRef } from "react";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { useSubjectStore } from "@/store/subjectStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, RotateCcw, Clock, CheckCircle, Brain } from "lucide-react";
import { toast } from "sonner";
import type { Pomodoro as PomodoroType } from "@/types/pomodoro";

const Pomodoro = () => {
  const { allPomodoros, fetchAllPomodorosByUser, addPomodoro } = usePomodoroStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchSubjects();
    fetchAllPomodorosByUser();
  }, [fetchSubjects, fetchAllPomodorosByUser]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedSubjectId) {
      toast.error("Please select a subject first");
      return;
    }
    
    setIsRunning(true);
    setIsPaused(false);
    setSessionStarted(true);
    setStartTime(new Date());
    setElapsedTime(0);
    toast.success("Pomodoro session started!");
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    toast.info("Session paused");
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
    toast.info("Session resumed");
  };

  const handleReset = () => {
    const shouldSave = elapsedTime >= 60; // Save if more than 1 minute elapsed
    
    if (shouldSave && selectedSubjectId) {
      savePomodoroSession(false); // Save as incomplete
    }
    
    resetSession();
    toast.info(shouldSave ? "Session saved and reset" : "Session reset (not saved)");
  };

  const handleStop = () => {
    if (selectedSubjectId) {
      savePomodoroSession(true); // Save as completed
    }
    resetSession();
    toast.success("Session completed and saved!");
  };

  const handleTimerComplete = () => {
    if (selectedSubjectId) {
      savePomodoroSession(true); // Save as completed
    }
    resetSession();
    toast.success("Pomodoro completed! Great work!");
  };

  const resetSession = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSessionStarted(false);
    setTimeLeft(25 * 60);
    setStartTime(null);
    setElapsedTime(0);
  };

  const savePomodoroSession = async (completed: boolean) => {
    if (!selectedSubjectId) return;

    try {
      const pomodoroData: PomodoroType = {
        durationMinutes: 25,
        breakMinutes: 5,
        completed: completed,
        subjectId: selectedSubjectId
      };

      await addPomodoro(pomodoroData);
      fetchAllPomodorosByUser(); // Refresh data
    } catch (_error) {
      toast.error("Failed to save pomodoro session");
    }
  };

  const getSubjectName = (subjectId: number): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || "Unknown Subject";
  };

  const getSubjectColor = (subjectId: number): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || "#6b7280";
  };

  // Calculate today's stats
  const today = new Date().toDateString();
  const todayPomodoros = allPomodoros.filter(pomodoro => {
    if (!pomodoro.createdAt) return false;
    return new Date(pomodoro.createdAt).toDateString() === today;
  });

  const completedSessions = todayPomodoros.filter(p => p.completed).length;
  const focusTime = todayPomodoros.filter(p => p.completed).length * 25; // 25 minutes per completed session

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
        <p className="text-muted-foreground">Focus for 25 minutes, then take a 5-minute break</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                Pomodoro Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              {!sessionStarted && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Subject</label>
                  <Select value={selectedSubjectId?.toString() || ""} onValueChange={(value) => setSelectedSubjectId(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a subject to focus on" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: subject.color }}
                            />
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Selected Subject Display */}
              {sessionStarted && selectedSubjectId && (
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: getSubjectColor(selectedSubjectId) }}
                  />
                  <span className="font-medium">{getSubjectName(selectedSubjectId)}</span>
                </div>
              )}

              {/* Timer Display */}
              <div className="text-6xl font-mono font-bold text-primary">
                {formatTime(timeLeft)}
              </div>

              {/* Status */}
              <div className="text-lg">
                {!sessionStarted && "Ready to start"}
                {sessionStarted && isRunning && !isPaused && "Focus time!"}
                {sessionStarted && isPaused && "Paused"}
                {sessionStarted && !isRunning && !isPaused && "Session ended"}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-3">
                {!sessionStarted ? (
                  <Button 
                    onClick={handleStart} 
                    size="lg" 
                    className="flex items-center gap-2"
                    disabled={!selectedSubjectId}
                  >
                    <Play className="h-5 w-5" />
                    Start
                  </Button>
                ) : !isPaused ? (
                  <>
                    <Button 
                      onClick={handlePause} 
                      variant="secondary" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-5 w-5" />
                      Pause
                    </Button>
                    <Button 
                      onClick={handleReset} 
                      variant="outline" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Reset
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleResume} 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Resume
                    </Button>
                    <Button 
                      onClick={handleStop} 
                      variant="default" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Square className="h-5 w-5" />
                      Stop
                    </Button>
                    <Button 
                      onClick={handleReset} 
                      variant="outline" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Today's Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Completed Sessions</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {completedSessions}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Focus Time</span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {focusTime}m
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayPomodoros.slice(0, 5).map((pomodoro) => (
                  <div key={pomodoro.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: getSubjectColor(pomodoro.subjectId) }}
                      />
                      <span>{getSubjectName(pomodoro.subjectId)}</span>
                    </div>
                    <Badge variant={pomodoro.completed ? "default" : "secondary"}>
                      {pomodoro.completed ? "Completed" : "Incomplete"}
                    </Badge>
                  </div>
                ))}
                {todayPomodoros.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-2">
                    No sessions today
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;