import type { ApiResponse } from "@/types/apiResponse";
import api from "./api";
import type { Pomodoro } from "@/types/pomodoro";

// Get all pomodoros for a subject
export const getPomodorosBySubject = async (subjectId: number) => {
  const res = await api.get<ApiResponse<Pomodoro[]>>(`/pomodoros/subject/${subjectId}`);
  return res.data;
};

// Get all pomodoros for the current user
export const getAllPomodorosByUser = async () => {
  const res = await api.get<ApiResponse<Pomodoro[]>>(`/pomodoros/user`);
  return res.data;
};

// Create a new pomodoro
export const createPomodoro = async (pomodoro: Pomodoro) => {
  const res = await api.post<ApiResponse<Pomodoro>>(`/pomodoros/create`, pomodoro);
  return res.data;
};

// Update a pomodoro
export const updatePomodoro = async (id: number, pomodoro: Pomodoro) => {
  const res = await api.put<ApiResponse<Pomodoro>>(`/pomodoros/update/${id}`, pomodoro);
  return res.data;
};

// Delete a pomodoro
export const deletePomodoro = async (id: number) => {
  const res = await api.delete<ApiResponse<null>>(`/pomodoros/delete/${id}`);
  return res.data;
};
