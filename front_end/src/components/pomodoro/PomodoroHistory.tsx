"use client";

import { useEffect } from "react";
import { usePomodoroStore } from "@/store/pomodoroStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PomodoroHistoryProps {
  sessionId: number;
}

export default function PomodoroHistory({ sessionId }: PomodoroHistoryProps) {
  const { pomodoros, fetchPomodorosBySubject, loading } = usePomodoroStore();

  // Fetch on mount and whenever sessionId changes
  useEffect(() => {
    fetchPomodorosBySubject(sessionId);
  }, [fetchPomodorosBySubject, sessionId]);

  if (loading) return <p>Loading pomodoros...</p>;

  if (pomodoros.length === 0) return <p className="text-muted-foreground">No pomodoros yet.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pomodoro History</h3>
      {pomodoros.map((p) => (
        <Card key={p.id} className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              {p.completed ? "✅ Completed" : "⏹️ Interrupted"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Duration: {p.durationMinutes} min</p>
            {p.breakMinutes > 0 && <p>Break: {p.breakMinutes} min</p>}
            <p className="text-xs text-muted-foreground">
              {p.createdAt ? new Date(p.createdAt).toLocaleString() : "Unknown date"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
