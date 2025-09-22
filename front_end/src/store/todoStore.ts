import { create } from "zustand";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/api/todoApi";
import { toast } from "sonner";
import type { Todo } from "@/types/todo";

interface TodoState {
  todos: Todo[];
  currentTodo: Todo | null;
  loading: boolean;
  error: string | null;

  fetchTodos: () => Promise<void>;
  fetchTodoById: (id: number) => Promise<void>;
  addTodo: (todo: Todo) => Promise<void>;
  editTodo: (id: number, todo: Todo) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  completeTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  currentTodo: null,
  loading: false,
  error: null,

  // Fetch all todos
  fetchTodos: async () => {
    try {
      set({ loading: true });
      const res = await getTodos();
      set({ todos: res.data, loading: false });
    } catch (_err) {
      toast.error("Failed to load todos");
      set({ loading: false });
    }
  },

  // Fetch a single todo by ID
  fetchTodoById: async (id) => {
    try {
      set({ loading: true });
      const res = await getTodoById(id);
      set({ currentTodo: res.data, loading: false });
    } catch (_err) {
      toast.error("Failed to load todo");
      set({ loading: false });
    }
  },

  // Add new todo
  addTodo: async (todo) => {
    try {
      const res = await createTodo(todo);
      set((state) => ({ todos: [...state.todos, res.data] }));
      toast.success("Todo created successfully");
    } catch (_err) {
      toast.error("Failed to create todo");
    }
  },

  // Update todo
  editTodo: async (id, todo) => {
    try {
      const res = await updateTodo(id, todo);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? res.data : t)),
        currentTodo: state.currentTodo?.id === id ? res.data : state.currentTodo,
      }));
      toast.success("Todo updated successfully");
    } catch (_err) {
      toast.error("Failed to update todo");
    }
  },

  // Delete todo
  removeTodo: async (id) => {
    try {
      await deleteTodo(id);
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
        currentTodo: state.currentTodo?.id === id ? null : state.currentTodo,
      }));
      toast.success("Todo deleted successfully");
    } catch (_err) {
      toast.error("Failed to delete todo");
    }
  },

  // Complete todo
  completeTodo: async (id) => {
    try {
      const todo = await getTodoById(id);
      const updatedTodo = { ...todo.data, completed: true };
      const res = await updateTodo(id, updatedTodo);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? res.data : t)),
        currentTodo: state.currentTodo?.id === id ? res.data : state.currentTodo,
      }));
      toast.success("Todo completed successfully");
    } catch (_err) {
      toast.error("Failed to complete todo");
    }
  },
}));
