export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id?: number; // optional when creating a new todo
  title: string;
  description: string;
  dueDate: string; // ISO string
  completed: boolean;
  priority: Priority;
  subjectId: number;
}

