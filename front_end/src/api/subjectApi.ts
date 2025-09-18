import type { ApiResponse } from "@/types/apiResponse";
import api from "./api";
import type { Subject } from "@/types/subject";

export const getSubjects = async () => {
  const res = await api.get<ApiResponse<Subject[]>>("/subject");
  return res.data; 
};

export const getSubject = async (id: number) => {
  const res = await api.get<ApiResponse<Subject>>(`/subject/${id}`);
  return res.data;
};

export const createSubject = async (subject: Subject) => {
  const res = await api.post<ApiResponse<Subject>>("/subject/save", subject);
  return res.data;
};

export const updateSubject = async (id: number, subject: Subject) => {
  const res = await api.put<ApiResponse<Subject>>(`/subject/update/${id}`, subject);
  return res.data;
};

export const deleteSubject = async (id: number) => {
  const res = await api.delete<ApiResponse<null>>(`/subject/delete/${id}`);
  return res.data;
};
