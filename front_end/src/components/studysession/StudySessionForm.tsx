"use client";

import { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { useTodoStore } from "@/store/todoStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudySessionStore } from "@/store/studysessionStore";

interface StudySessionFormProps {
  sessionId?: number; // optional for edit
}

export default function StudySessionForm({ sessionId }: StudySessionFormProps) {
  const { addSession, editSession, sessions } = useStudySessionStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const { todos, fetchTodos } = useTodoStore();

  const editingSession = sessions.find((s) => s.id === sessionId);

  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(editingSession?.startTime || "");
  const [endTime, setEndTime] = useState(editingSession?.endTime || "");
  const [notes, setNotes] = useState(editingSession?.notes || "");
  const [subjectId, setSubjectId] = useState<number | undefined>(
    editingSession?.subjectId
  );
  const [todoId, setTodoId] = useState<number | undefined>(
    editingSession?.todoId
  );

  useEffect(() => {
    fetchSubjects();
    fetchTodos();
  }, [fetchSubjects, fetchTodos]);

  const handleSubmit = async () => {
    const payload = { startTime, endTime, notes, subjectId, todoId };

    if (sessionId) {
      await editSession(sessionId, payload as any);
    } else {
      await addSession(payload as any);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={sessionId ? "outline" : "default"}>
          {sessionId ? "Edit" : "Add Session"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {sessionId ? "Edit Study Session" : "New Study Session"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <Label>End Time</Label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this session..."
            />
          </div>

          <div>
            <Label>Subject</Label>
            <Select
              value={subjectId ? subjectId.toString() : ""}
              onValueChange={(val) => setSubjectId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj.id} value={subj.id.toString()}>
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Todo</Label>
            <Select
              value={todoId ? todoId.toString() : ""}
              onValueChange={(val) => setTodoId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select todo" />
              </SelectTrigger>
              <SelectContent>
                {todos
                  .filter((todo) => todo.id !== undefined)
                  .map((todo) => (
                    <SelectItem key={todo.id} value={todo.id!.toString()}>
                      {todo.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            {sessionId ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
