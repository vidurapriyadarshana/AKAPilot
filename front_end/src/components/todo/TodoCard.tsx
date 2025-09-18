"use client";

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Todo } from "@/types/todo";
import { useSubjectStore } from "@/store/subjectStore";
import { toast } from "sonner";

interface TodoCardProps {
    todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
    const getStatusVariant = (completed: boolean) =>
        completed ? "default" : "outline";

    const { subjects, fetchSubjects } = useSubjectStore();

    useEffect(() => {
        if (subjects.length === 0) {
            fetchSubjects().catch(() => toast.error("Failed to load subjects"));
        }
    }, [subjects, fetchSubjects]);

    const subject = subjects.find((s) => s.id === todo.subjectId);

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

    return (
        <Card className="hover:shadow-lg transition relative">
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
                <p className="text-xs text-muted-foreground">Subject ID: {subject ? subject.name : "Loading..."}</p>
                <p className="text-xs text-muted-foreground">
                    Due: {new Date(todo.dueDate).toLocaleString()}
                </p>
            </CardContent>
        </Card>
    );
};

export default TodoCard;
