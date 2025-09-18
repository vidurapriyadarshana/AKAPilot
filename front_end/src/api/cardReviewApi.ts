import type { ApiResponse } from "@/types/apiResponse";
import api from "./api";
import type { CardReview } from "@/types/cardReview";

// Create a new card review
export const createCardReview = async (cardReview: CardReview) => {
  const res = await api.post<ApiResponse<CardReview>>("/reviews/save", cardReview);
  return res.data;
};
