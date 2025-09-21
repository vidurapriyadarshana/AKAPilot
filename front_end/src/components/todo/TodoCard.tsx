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
import TodoForm from "./TodoForm";
import { useTodoStore } from "@/store/todoStore";
import { Checkbox } from "@/components/ui/checkbox";
import StartSessionModal from "../studysession/StartSessionModal";
import { CalendarDays } from "lucide-react";
import { useSubjectStore } from "@/store/subjectStore";
import { useEffect } from "react";
import { toast } from "sonner";

interface TodoCardProps {
  todo: any;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const { removeTodo, editTodo } = useTodoStore();
  const { subjects, fetchSubjects } = useSubjectStore();


  useEffect(() => {
    if (subjects.length === 0) {
      fetchSubjects().catch(() => toast.error("Failed to load subjects"));
    }
  }, [subjects, fetchSubjects]);

  const subject = subjects.find((s) => s.id === todo.subjectId);

  const priorityColor =
    todo.priority === "HIGH"
      ? "destructive"
      : todo.priority === "MEDIUM"
        ? "default"
        : "secondary";

  // Due date countdown
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  let dueLabel = "No due date";
  let dueClass = "text-muted-foreground";

  if (dueDate) {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      dueLabel = `Overdue (${Math.abs(days)}d ago)`;
      dueClass = "text-red-500 font-medium";
    } else if (days === 0) {
      dueLabel = "Due today";
      dueClass = "text-yellow-500 font-medium";
    } else {
      dueLabel = `Due in ${days}d`;
      dueClass = "text-green-500 font-medium";
    }
  }

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) =>
                editTodo(todo.id, { ...todo, completed: checked })
              }
            />
            <CardTitle
              className={`text-lg font-semibold ${todo.completed ? "line-through text-muted-foreground" : ""
                }`}
            >
              {todo.title}
            </CardTitle>
          </div>
          <Badge variant={priorityColor}>{todo.priority}</Badge>
        </div>
        <CardDescription>{subject?.name || "No subject"}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {todo.description && (
          <p className="text-sm text-muted-foreground">{todo.description}</p>
        )}

        {dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays size={16} />
            <span className={dueClass}>{dueLabel}</span>
          </div>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          {/* Start Study Session with todo preselected */}
          <StartSessionModal todo={todo} />

          {/* Edit Todo */}
          <TodoForm todoId={todo.id} />

          {/* Delete Todo */}
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
