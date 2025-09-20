"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoCard from "./TodoCard";
import TodoForm from "./TodoForm";

export default function TodoList() {
  const { todos, fetchTodos, loading, error } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
}
