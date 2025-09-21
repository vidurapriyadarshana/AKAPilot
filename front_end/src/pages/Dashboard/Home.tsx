import { useState, useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useStudySessionStore } from "@/store/studysessionStore";
import { useMemoryCardStore } from "@/store/memorycardStore";
import { useCardReviewStore } from "@/store/cardReviewStore";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Brain, 
  TrendingUp, 
  Calendar,
  Target,
  Zap,
  BarChart3,
  Activity
} from "lucide-react";

const Home = () => {
  const { todos, fetchTodos } = useTodoStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const { todaySessions, fetchTodaySessions, summary, fetchSummary } = useStudySessionStore();
  const { memoryCards, fetchMemoryCards } = useMemoryCardStore();
  const { reviewSummary, fetchReviewSummary } = useCardReviewStore();
  const { allPomodoros, fetchAllPomodorosByUser } = usePomodoroStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTodos(),
          fetchSubjects(),
          fetchTodaySessions(),
          fetchMemoryCards(),
          fetchReviewSummary(),
          fetchAllPomodorosByUser()
        ]);
        
        // Fetch summary for current user (assuming user ID 1 for now)
        await fetchSummary(1);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchTodos, fetchSubjects, fetchTodaySessions, fetchMemoryCards, fetchReviewSummary, fetchAllPomodorosByUser, fetchSummary]);

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const totalSubjects = subjects.length;
  const totalCards = memoryCards.length;
  
  // Today's statistics
  const today = new Date().toDateString();
  const todayPomodoros = allPomodoros.filter(pomodoro => {
    if (!pomodoro.createdAt) return false;
    return new Date(pomodoro.createdAt).toDateString() === today;
  });
  
  const completedPomodoros = todayPomodoros.filter(p => p.completed).length;
  const totalStudyTime = todaySessions.reduce((total, session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
  }, 0);


  const upcomingTodos = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your study overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTodos}</div>
            <p className="text-xs text-muted-foreground">
              {completedTodos} completed, {pendingTodos} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalStudyTime)}m</div>
            <p className="text-xs text-muted-foreground">
              {todaySessions.length} sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Cards</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalSubjects} subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pomodoros Today</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPomodoros}</div>
            <p className="text-xs text-muted-foreground">
              {completedPomodoros * 25} minutes focused
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                upcomingTodos.map((todo) => {
                  const subject = subjects.find(s => s.id === todo.subjectId);
                  return (
                    <div key={todo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject?.color || "#6b7280" }}
                        />
                        <div>
                          <p className="font-medium">{todo.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={todo.priority === 'HIGH' ? 'destructive' : todo.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                        {todo.priority}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Study Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Today's Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No study sessions today</p>
              ) : (
                todaySessions.slice(0, 5).map((session) => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  const duration = Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60));
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject?.color || "#6b7280" }}
                        />
                        <div>
                          <p className="font-medium">{subject?.name || "Unknown Subject"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.startTime).toLocaleTimeString()} - {duration}m
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">
                        {duration}m
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Study Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Study Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No study data available</p>
              ) : (
                summary.slice(0, 5).map((item, index) => {
                  const subject = subjects.find(s => s.id === item.subjectId);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject?.color || "#6b7280" }}
                        />
                        <span className="font-medium">{subject?.name || "Unknown Subject"}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.totalStudyMinutes}m</p>
                        <p className="text-xs text-muted-foreground">Study time</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Memory Card Review Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Review Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewSummary ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Reviews</span>
                    <Badge variant="secondary">{reviewSummary.totalReviews || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="default">
                      {reviewSummary.successRate ? `${Math.round(reviewSummary.successRate * 100)}%` : "0%"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cards Mastered</span>
                    <Badge variant="default">{reviewSummary.masteredCards || 0}</Badge>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-4">No review data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Start Study Session
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Review Cards
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Start Pomodoro
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Add Todo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;