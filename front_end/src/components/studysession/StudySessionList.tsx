"use client";

import { useEffect } from "react";
import StudySessionCard from "./StudySessionCard";
import StudySessionForm from "./StudySessionForm";
import { useStudySessionStore } from "@/store/studySessionStore";

export default function StudySessionList() {
  const { sessions, fetchSessions, loading } = useStudySessionStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Study Sessions</h2>
        <StudySessionForm />
      </div>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-muted-foreground">No study sessions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <StudySessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
