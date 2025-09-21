"use client";

import { useState, useEffect } from "react";
import { useStudySessionStore } from "@/store/studysessionStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useTodoStore } from "@/store/todoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, Square, BookOpen, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import TodoList from "@/components/todo/TodoList";
import type { StudySessionsDTO } from "@/types/studysession";

export default function StudySessionPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentTodoId, setCurrentTodoId] = useState<number | null>(null);

  const { 
    sessions, 
    addSession, 
    fetchSessions
  } = useStudySessionStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const { todos, fetchTodos, completeTodo } = useTodoStore();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (sessionActive && !sessionPaused && sessionStartTime) {
        setSessionDuration(Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive, sessionPaused, sessionStartTime]);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchSessions();
        await fetchSubjects();
        await fetchTodos();
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchSessions, fetchSubjects, fetchTodos]);

  // Listen for session start events from todo cards
  useEffect(() => {
    const handleSessionStart = (event: CustomEvent) => {
      const { todoId } = event.detail;
      setCurrentTodoId(todoId);
      setSessionActive(true);
      setSessionPaused(false);
      setSessionStartTime(new Date());
      setSessionDuration(0);
      toast.success("Study session started!");
    };

    window.addEventListener('startStudySession', handleSessionStart as EventListener);
    return () => window.removeEventListener('startStudySession', handleSessionStart as EventListener);
  }, []);

  // Get subject name by ID
  const getSubjectName = (subjectId: number): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || "Unknown Subject";
  };

  // Get subject color by ID
  const getSubjectColor = (subjectId: number): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || "#6b7280";
  };

  // Format time duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pause session
  const handlePauseSession = () => {
    setSessionPaused(!sessionPaused);
    toast.info(sessionPaused ? "Study session resumed!" : "Study session paused!");
  };

  // End session
  const handleEndSession = async () => {
    if (sessionStartTime) {
      try {
        const endTime = new Date();
        
        // Get the current todo to extract subjectId
        const currentTodo = todos.find(todo => todo.id === currentTodoId);
        const subjectId = currentTodo?.subjectId || 1; // fallback to 1 if no todo found
        
        const sessionData: StudySessionsDTO = {
          startTime: sessionStartTime.toISOString(),
          endTime: endTime.toISOString(),
          notes: `Study session - ${formatDuration(sessionDuration)}${currentTodo ? ` for "${currentTodo.title}"` : ''}`,
          subjectId: subjectId,
          todoId: currentTodoId || undefined,
        };
        
        console.log('Creating session with data:', sessionData); // Debug log
        
        await addSession(sessionData);
        
        // Mark todo as completed if there's a current todo
        if (currentTodoId) {
          await completeTodo(currentTodoId);
        }
        
        toast.success("Study session ended and saved!");
        
        // Refresh sessions and todos
        fetchSessions();
        fetchTodos();
      } catch (error) {
        console.error('Session creation error:', error); // Debug log
        toast.error("Failed to save study session");
      }
    }
    
    setSessionActive(false);
    setSessionPaused(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    setCurrentTodoId(null);
  };

  // Get recent sessions (last 5)
  const recentSessions = sessions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  // Debug: Log sessions data
  useEffect(() => {
    console.log('Sessions data:', sessions);
    console.log('Recent sessions:', recentSessions);
  }, [sessions, recentSessions]);

  // Get upcoming todos (not completed, sorted by due date)
  const upcomingTodos = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Study Sessions</h1>

      {/* Current Time and Session Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {currentTime.toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {sessionActive && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Active Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-mono font-bold mb-4">
                {formatDuration(sessionDuration)}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {sessionPaused ? "Paused" : "Active"}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePauseSession} 
                  variant={sessionPaused ? "default" : "secondary"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {sessionPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {sessionPaused ? "Resume" : "Pause"}
                </Button>
                <Button 
                  onClick={handleEndSession} 
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent and Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent sessions</p>
              ) : (
                recentSessions.map((session) => {
                  const startTime = new Date(session.startTime);
                  const endTime = new Date(session.endTime);
                  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
                  
                  return (
                    <div key={session.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {getSubjectName(session.subjectId)}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {session.notes}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="outline" 
                              style={{ 
                                borderColor: getSubjectColor(session.subjectId),
                                color: getSubjectColor(session.subjectId)
                              }}
                            >
                              {getSubjectName(session.subjectId)}
                            </Badge>
                            <Badge variant="secondary">
                              {formatDuration(duration)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Todos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Todos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTodos.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No upcoming todos</p>
              ) : (
                upcomingTodos.map((todo) => (
                  <div key={todo.id} className="border rounded-lg p-3 bg-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-700">{todo.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            style={{ 
                              borderColor: getSubjectColor(todo.subjectId),
                              color: getSubjectColor(todo.subjectId)
                            }}
                          >
                            {getSubjectName(todo.subjectId)}
                          </Badge>
                          <Badge 
                            variant={todo.priority === "HIGH" ? "destructive" : todo.priority === "MEDIUM" ? "default" : "secondary"}
                          >
                            {todo.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List */}
      <Card>
        <CardHeader>
          <CardTitle>Todo Management</CardTitle>
        </CardHeader>
        <CardContent>
      <TodoList />
        </CardContent>
      </Card>
    </div>
  );
}
