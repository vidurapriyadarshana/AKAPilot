"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudySessionForm from "./StudySessionForm";
import { useStudySessionStore } from "@/store/studySessionStore";

interface StudySessionCardProps {
  session: any;
}

export default function StudySessionCard({ session }: StudySessionCardProps) {
  const { removeSession } = useStudySessionStore();

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {new Date(session.startTime).toLocaleString()} →{" "}
          {new Date(session.endTime).toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{session.notes}</p>
        <div className="flex gap-2">
          <StudySessionForm sessionId={session.id} />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeSession(session.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
