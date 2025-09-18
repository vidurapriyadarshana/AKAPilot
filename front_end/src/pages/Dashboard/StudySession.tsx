"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoCard from "@/components/todo/TodoCard";
import AddTodoDialog from "@/components/todo/AddTodoDialog";

const StudySession = () => {
  const { todos, fetchTodos, loading, error } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Study Sessions</h1>
          <p className="text-muted-foreground">
            Organize and manage your study sessions
          </p>
        </div>
      </div>

      {/* Error + Loading */}
      {loading && <p>Loading todos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Todos Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Todos</h1>
          <AddTodoDialog />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudySession;
