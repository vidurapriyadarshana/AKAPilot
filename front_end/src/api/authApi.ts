import axios from "axios";
import type {  AuthDTO, AuthResponseDTO, RegisterDTO } from "../types/auth";
import type { ApiResponse } from "../types/apiResponse";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", 
  headers: { "Content-Type": "application/json" },
});

export async function signup(userData: RegisterDTO) {
  const response = await api.post<ApiResponse<any>>("/signup", userData);
  return response.data;
}

export async function signin(credentials: AuthDTO) {
  const response = await api.post<ApiResponse<AuthResponseDTO>>("/signin", credentials);
  return response.data;
}
