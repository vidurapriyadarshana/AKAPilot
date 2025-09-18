// memorycardApi.ts
import type { ApiResponse } from "@/types/apiResponse";
import api from "./api"; // axios instance
import type { MemoryCard, MemoryCardResponse } from "@/types/memorycards";

// Get all memory cards
export const getMemoryCards = async () => {
  const res = await api.get<ApiResponse<MemoryCardResponse[]>>("/memory");
  return res.data;
};

// Get a single memory card by ID
export const getMemoryCardById = async (id: number) => {
  const res = await api.get<ApiResponse<MemoryCardResponse>>(`/memory/${id}`);
  return res.data;
};

// Create a new memory card
export const createMemoryCard = async (card: MemoryCard) => {
  const res = await api.post<ApiResponse<MemoryCardResponse>>("/memory/save", card);
  return res.data;
};

// Update a memory card by ID
export const updateMemoryCard = async (id: number, card: MemoryCard) => {
  const res = await api.put<ApiResponse<MemoryCardResponse>>(`/memory/update/${id}`, card);
  return res.data;
};

// Delete a memory card by ID
export const deleteMemoryCard = async (id: number) => {
  const res = await api.delete<ApiResponse<null>>(`/memory/delete/${id}`);
  return res.data;
};
