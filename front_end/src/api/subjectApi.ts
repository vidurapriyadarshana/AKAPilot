import axios from "axios";
import type { Subject } from "../types/subject";
import type { ApiResponse } from "../types/apiResponse";

const API_URL = "http://localhost:8080/subject";

// ✅ Get all subjects
export const getSubjects = async () => {
  const res = await axios.get<ApiResponse<Subject[]>>(API_URL);
  return res.data; // ApiResponse<Subject[]>
};

// ✅ Get a single subject by id
export const getSubject = async (id: number) => {
  const res = await axios.get<ApiResponse<Subject>>(`${API_URL}/${id}`);
  return res.data; // ApiResponse<Subject>
};

// ✅ Create a subject
export const createSubject = async (subject: Subject) => {
  const res = await axios.post<ApiResponse<Subject>>(`${API_URL}/save`, subject);
  return res.data; // ApiResponse<Subject>
};

// ✅ Update subject
export const updateSubject = async (id: number, subject: Subject) => {
  const res = await axios.put<ApiResponse<Subject>>(`${API_URL}/update/${id}`, subject);
  return res.data; // ApiResponse<Subject>
};

// ✅ Delete subject
export const deleteSubject = async (id: number) => {
  const res = await axios.delete<ApiResponse<null>>(`${API_URL}/delete/${id}`);
  return res.data; // ApiResponse<null>
};
