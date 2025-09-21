"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import { useSubjectStore } from "@/store/subjectStore";
import TodoCard from "./TodoCard";
import TodoForm from "./TodoForm";

export default function TodoList() {
  const { todos, fetchTodos, loading, error } = useTodoStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    fetchTodos();
    fetchSubjects();
  }, [fetchTodos, fetchSubjects]);

  // Group by subject, filtering out todos without proper subjects
  const grouped = todos.reduce((acc: any, todo: any) => {
    const subject = subjects.find((s) => s.id === todo.subjectId);
    if (subject) {
      const key = subject.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(todo);
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Todos</h2>
        <TodoForm />
      </div>

      {loading && <p>Loading todos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {todos.length === 0 ? (
        <p className="text-muted-foreground">No todos yet.</p>
      ) : (
        Object.keys(grouped).map((group) => (
          <div key={group} className="space-y-3">
            <h3 className="text-lg font-semibold">{group}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[group].map((todo: any) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
