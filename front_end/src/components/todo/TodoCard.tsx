"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Todo } from "@/types/todo";
import { useSubjectStore } from "@/store/subjectStore";
import { useTodoStore } from "@/store/todoStore";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  CircleCheck,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodoCardProps {
  todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { subjects, fetchSubjects } = useSubjectStore();
  const { removeTodo, editTodo } = useTodoStore();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects().catch(() => toast.error("Failed to load subjects"));
    }
  }, [subjects, fetchSubjects]);

  const subject = subjects.find((s) => s.id === todo.subjectId);

  const getStatusVariant = (completed: boolean) =>
    completed ? "default" : "outline";

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
      default:
        return "default";
    }
  };

  const handleDelete = async () => {
    if (todo.id) {
      await removeTodo(todo.id);
    }
  };

  const handleToggleComplete = async () => {
    if (todo.id) {
      await editTodo(todo.id, { ...todo, completed: !todo.completed });
    }
  };

  return (
    <Card className="hover:shadow-lg transition relative flex flex-col justify-between">
      {/* Dropdown Menu */}
      

      <CardHeader className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base md:text-lg">{todo.title}</CardTitle>
          <div className="ml-2 flex gap-2">
            <Badge variant={getPriorityVariant(todo.priority)} className="text-xs">
              {todo.priority}
            </Badge>
            <Badge variant={getStatusVariant(todo.completed)} className="text-xs">
              {todo.completed ? "Completed" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600">{todo.description}</p>
        <p className="text-xs text-muted-foreground">
          Subject: {subject ? subject.name : "Loading..."}
        </p>
        <p className="text-xs text-muted-foreground">
          Due: {new Date(todo.dueDate).toLocaleString()}
        </p>
      </CardContent>

      {/* Bottom Action Buttons */}
      <CardFooter className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleToggleComplete}
        >
          {todo.completed ? (
            <>
              <CircleCheckBig size={20} className="mr-1 text-green-600" /> Done
            </>
          ) : (
            <>
              <CircleCheck size={20} className="mr-1" /> Mark as Completed
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TodoCard;
