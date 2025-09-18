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
import { Checkbox } from "@/components/ui/checkbox";
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
        <Button>Add Todo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Todo</DialogTitle>
          <DialogDescription>
            Fill in the details for your new study task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Finish math homework"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Solve algebra exercises"
            />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </div>

          <div>
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(val) => handleChange("priority", val as Priority)}
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
              value={form.subjectId ? String(form.subjectId) : ""}
              onValueChange={(val) => handleChange("subjectId", Number(val))}
            >
              <SelectTrigger>
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

        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
