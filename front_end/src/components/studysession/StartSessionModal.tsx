"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStudySessionStore } from "@/store/studySessionStore";

interface StartSessionModalProps {
  todo: any;
}

export default function StartSessionModal({ todo }: StartSessionModalProps) {
  const { addSession } = useStudySessionStore();

  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Start timer when modal opens
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, startTime]);

  const handleStart = () => {
    setStartTime(new Date());
    setElapsed(0);
    
    // Dispatch custom event to notify StudySession page
    const event = new CustomEvent('startStudySession', {
      detail: { todoId: todo.id }
    });
    window.dispatchEvent(event);
  };

  const handleEnd = async () => {
    if (!startTime) return;
    const payload = {
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      notes,
      subjectId: todo.subjectId,
      todoId: todo.id,
    };
    await addSession(payload as any);
    setOpen(false);
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          Start Study Session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Study Session</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <b>Todo:</b> {todo.title} <br />
            <b>Subject:</b> {todo.subjectName || "No subject"}
          </p>

          {startTime ? (
            <p className="text-lg font-semibold text-center">
              Elapsed: {formatElapsed(elapsed)}
            </p>
          ) : (
            <Button onClick={handleStart} className="w-full">
              Start Timer
            </Button>
          )}

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your reflection or thoughts..."
            />
          </div>

          {startTime && (
            <Button className="w-full" onClick={handleEnd}>
              End Session & Save
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
