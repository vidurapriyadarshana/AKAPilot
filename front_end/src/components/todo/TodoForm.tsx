"use client";

import { useState, useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import { useSubjectStore } from "@/store/subjectStore";
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

interface TodoFormProps {
  todoId?: number;
}

export default function TodoForm({ todoId }: TodoFormProps) {
  const { todos, addTodo, editTodo } = useTodoStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  const editingTodo = todos.find((t) => t.id === todoId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editingTodo?.title || "");
  const [description, setDescription] = useState(
    editingTodo?.description || ""
  );
  const [dueDate, setDueDate] = useState(editingTodo?.dueDate || "");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(editingTodo?.priority || "MEDIUM");
  const [subjectId, setSubjectId] = useState<number | undefined>(
    editingTodo?.subjectId
  );

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      dueDate,
      priority,
      subjectId,
      completed: editingTodo?.completed ?? false,
    };

    if (todoId) {
      await editTodo(todoId, payload as any);
    } else {
      await addTodo(payload as any);
    }

    setOpen(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("MEDIUM");
    setSubjectId(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={todoId ? "outline" : "default"}>
          {todoId ? "Edit" : "Add Todo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{todoId ? "Edit Todo" : "New Todo"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Enter details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(val) => setPriority(val as "LOW" | "MEDIUM" | "HIGH")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
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

          <Button className="w-full" onClick={handleSubmit}>
            {todoId ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
