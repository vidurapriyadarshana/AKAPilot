"use client";

import StudySessionList from "@/components/studysession/StudySessionList";
import TodoList from "@/components/todo/TodoList";

export default function StudySessionPage() {
  return (
    <div className="p-6 space-y-10">
      <StudySessionList />
      <TodoList />
    </div>
  );
}
