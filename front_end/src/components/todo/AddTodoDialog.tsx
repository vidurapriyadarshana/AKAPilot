"use client";

import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { useSubjectStore } from "@/store/subjectStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Priority } from "@/types/todo";

const AddTodoDialog = () => {
  const { addTodo } = useTodoStore();
  const { subjects } = useSubjectStore();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
    priority: "LOW" as Priority,
    subjectId: 0,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.dueDate || !form.subjectId) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      await addTodo(form);
      toast.success("Todo created successfully!");
      setOpen(false);
      setForm({
        title: "",
        description: "",
        dueDate: "",
        completed: false,
        priority: "LOW",
        subjectId: 0,
      });
    } catch (err) {
      toast.error("Failed to create todo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="px-6 py-2">
          Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-card shadow-lg">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl font-bold">Add a New Todo</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details for your study task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Finish math homework"
              className="rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Solve algebra exercises"
              className="rounded-lg"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="rounded-lg"
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(val) => handleChange("priority", val as Priority)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={form.subjectId ? String(form.subjectId) : ""}
              onValueChange={(val) => handleChange("subjectId", Number(val))}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end">
          <Button variant="default" onClick={handleSubmit} className="px-6 py-2 rounded-lg">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
