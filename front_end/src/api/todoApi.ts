import type { ApiResponse } from "@/types/apiResponse";
import api from "./api";
import type { Todo } from "@/types/todo";

// Get all todos
export const getTodos = async () => {
  const res = await api.get<ApiResponse<Todo[]>>("/todo");
  return res.data;
};

// Get single todo by ID
export const getTodoById = async (id: number) => {
  const res = await api.get<ApiResponse<Todo>>(`/todo/${id}`);
  return res.data;
};

// Create new todo
export const createTodo = async (todo: Todo) => {
  const res = await api.post<ApiResponse<Todo>>("/todo/save", todo);
  return res.data;
};

// Update todo
export const updateTodo = async (id: number, todo: Todo) => {
  const res = await api.put<ApiResponse<Todo>>(`/todo/update/${id}`, todo);
  return res.data;
};

// Delete todo
export const deleteTodo = async (id: number) => {
  const res = await api.delete<ApiResponse<null>>(`/todo/delete/${id}`);
  return res.data;
};
