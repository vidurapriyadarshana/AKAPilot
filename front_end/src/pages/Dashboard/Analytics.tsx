import { useState, useEffect } from "react";
import { useStudySessionStore } from "@/store/studySessionStore";
import { useCardReviewStore } from "@/store/cardReviewStore";
import { useSubjectStore } from "@/store/subjectStore";
import { useMemoryCardStore } from "@/store/memorycardStore";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { useTodoStore } from "@/store/todoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Brain, 
  Activity,
  Zap,
  CheckCircle,
  PieChart,
  LineChart
} from "lucide-react";

const Analytics = () => {
  const { sessions, summary, fetchSessions, fetchSummary } = useStudySessionStore();
  const { reviewSummary, fetchCardReviewsForUser, fetchReviewSummary } = useCardReviewStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const { memoryCards, fetchMemoryCards } = useMemoryCardStore();
  const { allPomodoros, fetchAllPomodorosByUser } = usePomodoroStore();
  const { todos, fetchTodos } = useTodoStore();

  const [selectedTimeframe, setSelectedTimeframe] = useState("7");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSessions(),
          fetchSummary(1), // Assuming user ID 1
          fetchCardReviewsForUser(),
          fetchReviewSummary(),
          fetchSubjects(),
          fetchMemoryCards(),
          fetchAllPomodorosByUser(),
          fetchTodos()
        ]);
      } catch (error) {
        console.error("Failed to load analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchSessions, fetchSummary, fetchCardReviewsForUser, fetchReviewSummary, fetchSubjects, fetchMemoryCards, fetchAllPomodorosByUser, fetchTodos]);

  // Filter data based on selected timeframe
  const getFilteredData = () => {
    const days = parseInt(selectedTimeframe);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredSessions = sessions.filter(session => 
      new Date(session.startTime) >= cutoffDate &&
      (selectedSubject === "all" || session.subjectId === parseInt(selectedSubject))
    );

    const filteredPomodoros = allPomodoros.filter(pomodoro => 
      pomodoro.createdAt && new Date(pomodoro.createdAt) >= cutoffDate &&
      (selectedSubject === "all" || pomodoro.subjectId === parseInt(selectedSubject))
    );

    const filteredTodos = todos.filter(todo => 
      new Date(todo.dueDate) >= cutoffDate &&
      (selectedSubject === "all" || todo.subjectId === parseInt(selectedSubject))
    );

    return { filteredSessions, filteredPomodoros, filteredTodos };
  };

  const { filteredSessions, filteredPomodoros, filteredTodos } = getFilteredData();

  // Calculate analytics
  const totalStudyTime = filteredSessions.reduce((total, session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
  }, 0);

  const completedPomodoros = filteredPomodoros.filter(p => p.completed).length;
  const completedTodos = filteredTodos.filter(t => t.completed).length;
  const totalCards = memoryCards.filter(card => 
    selectedSubject === "all" || card.subjectId === parseInt(selectedSubject)
  ).length;

  // Study sessions by day
  const sessionsByDay = filteredSessions.reduce((acc, session) => {
    const date = new Date(session.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = { count: 0, duration: 0 };
    }
    acc[date].count += 1;
    const duration = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60);
    acc[date].duration += duration;
    return acc;
  }, {} as Record<string, { count: number; duration: number }>);

  // Subject performance
  const subjectPerformance = subjects.map(subject => {
    const subjectSessions = filteredSessions.filter(s => s.subjectId === subject.id);
    const subjectPomodoros = filteredPomodoros.filter(p => p.subjectId === subject.id);
    const subjectTodos = filteredTodos.filter(t => t.subjectId === subject.id);
    const subjectCards = memoryCards.filter(c => c.subjectId === subject.id);

    const totalTime = subjectSessions.reduce((total, session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      return total + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    return {
      ...subject,
      sessions: subjectSessions.length,
      pomodoros: subjectPomodoros.filter(p => p.completed).length,
      todos: subjectTodos.filter(t => t.completed).length,
      cards: subjectCards.length,
      totalTime: Math.round(totalTime)
    };
  }).sort((a, b) => b.totalTime - a.totalTime);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
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
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your study performance</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalStudyTime)}m</div>
            <p className="text-xs text-muted-foreground">
              {filteredSessions.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pomodoros</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPomodoros}</div>
            <p className="text-xs text-muted-foreground">
              {completedPomodoros * 25} minutes focused
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Todos Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTodos}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTodos.length} total todos
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
              {reviewSummary?.totalReviews || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Sessions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Study Sessions Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(sessionsByDay).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No study sessions in selected period</p>
              ) : (
                Object.entries(sessionsByDay)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, data]) => (
                    <div key={date} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{data.count} sessions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Math.round(data.duration)}m</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (data.duration / 120) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectPerformance.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No data available</p>
              ) : (
                subjectPerformance.slice(0, 5).map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.sessions} sessions, {subject.pomodoros} pomodoros
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{subject.totalTime}m</p>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (subject.totalTime / Math.max(...subjectPerformance.map(s => s.totalTime))) * 100)}%`,
                            backgroundColor: subject.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Performance */}
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Attempts</span>
                    <Badge variant="secondary">
                      {reviewSummary.averageAttempts ? reviewSummary.averageAttempts.toFixed(1) : "0"}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">No review data available</p>
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
                <p className="text-muted-foreground text-center py-8">No study data available</p>
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
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Study Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredSessions.slice(0, 8).map((session) => {
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
                          {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">{duration}m</Badge>
                  </div>
                );
              })}
              {filteredSessions.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No study sessions in selected period</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Pomodoros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Pomodoros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPomodoros.slice(0, 8).map((pomodoro) => {
                const subject = subjects.find(s => s.id === pomodoro.subjectId);
                return (
                  <div key={pomodoro.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: subject?.color || "#6b7280" }}
                      />
                      <div>
                        <p className="font-medium">{subject?.name || "Unknown Subject"}</p>
                        <p className="text-sm text-muted-foreground">
                          {pomodoro.createdAt && new Date(pomodoro.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={pomodoro.completed ? "default" : "secondary"}>
                      {pomodoro.completed ? "Completed" : "Incomplete"}
                    </Badge>
                  </div>
                );
              })}
              {filteredPomodoros.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No pomodoros in selected period</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;