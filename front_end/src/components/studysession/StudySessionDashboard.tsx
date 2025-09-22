"use client";

import { useEffect } from "react";
import { useStudySessionStore } from "@/store/studySessionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudySessionDashboard() {
  const { sessions, summary, fetchSessions, fetchSummary } =
    useStudySessionStore();

  useEffect(() => {
    fetchSessions();
    // Replace with actual userId from auth
    fetchSummary(2);
  }, [fetchSessions, fetchSummary]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Study Session Dashboard</h2>

      {/* Individual sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>
                {new Date(s.startTime).toLocaleString()} →{" "}
                {new Date(s.endTime).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{s.notes}</p>
              <p className="text-xs text-muted-foreground">
                {s.todoId ? `Todo #${s.todoId}` : "No todo"} | Subject #{s.subjectId}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary from API */}
      <Card>
        <CardHeader>
          <CardTitle>Study Summary (per Subject)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={summary.map((s) => ({
                subject: s.subjectName,
                hours: s.totalStudyMinutes / 60,
              }))}
            >
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
