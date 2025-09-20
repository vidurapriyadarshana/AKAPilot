"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import TodoForm from "./TodoForm";
import { useTodoStore } from "@/store/todoStore";

interface TodoCardProps {
  todo: any;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const { removeTodo } = useTodoStore();

  const priorityColor =
    todo.priority === "HIGH"
      ? "destructive"
      : todo.priority === "MEDIUM"
      ? "default"
      : "secondary";

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{todo.title}</CardTitle>
          <Badge variant={priorityColor}>{todo.priority}</Badge>
        </div>
        <CardDescription>{todo.subjectName || "No subject"}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{todo.description}</p>

        {todo.dueDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={16} />
            {new Date(todo.dueDate).toLocaleString()}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="default">
            Start Study Session
          </Button>
          <TodoForm todoId={todo.id} />
          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeTodo(todo.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
