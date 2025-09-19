import api from "./api";
import type { StudySessionsDTO, StudySummaryDTO } from "@/types/studysession";
import type { ApiResponse } from "@/types/apiResponse";

// Create a new study session
export const createStudySession = async (session: StudySessionsDTO) => {
  const res = await api.post<ApiResponse<StudySessionsDTO>>("/sessions/create", session);
  return res.data;
};

// Get all sessions
export const getAllStudySessions = async () => {
  const res = await api.get<ApiResponse<StudySessionsDTO[]>>("/sessions");
  return res.data;
};

// Get session by ID
export const getStudySessionById = async (id: number) => {
  const res = await api.get<ApiResponse<StudySessionsDTO>>(`/sessions/${id}`);
  return res.data;
};

// Update session
export const updateStudySession = async (id: number, session: StudySessionsDTO) => {
  const res = await api.put<ApiResponse<StudySessionsDTO>>(`/sessions/update/${id}`, session);
  return res.data;
};

// Delete session
export const deleteStudySession = async (id: number) => {
  const res = await api.delete<ApiResponse<null>>(`/sessions/delete/${id}`);
  return res.data;
};

// Get study summary by user ID
export const getStudySummary = async (userId: number) => {
  const res = await api.get<ApiResponse<StudySummaryDTO[]>>(`/sessions/summary/${userId}`);
  return res.data;
};

// Get today's sessions
export const getTodaysSessions = async () => {
  const res = await api.get<ApiResponse<StudySessionsDTO[]>>("/sessions/today");
  return res.data;
};
