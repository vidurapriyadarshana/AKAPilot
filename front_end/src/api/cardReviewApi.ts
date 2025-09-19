import type { ApiResponse } from "@/types/apiResponse";
import api from "./api";
import type { CardReview } from "@/types/cardReview";

// Create a new card review
export const createCardReview = async (cardReview: CardReview) => {
  const res = await api.post<ApiResponse<CardReview>>("/reviews/save", cardReview);
  return res.data;
};

// Get all reviews for logged-in user
export const getAllCardReviewsForUser = async () => {
  const res = await api.get<ApiResponse<CardReview[]>>("/reviews");
  return res.data;
};

// Get reviews for a specific card
export const getCardReviewsByCardId = async (cardId: number) => {
  const res = await api.get<ApiResponse<CardReview[]>>(`/reviews/card/${cardId}`);
  return res.data;
};

// Get reviews for a specific user
export const getCardReviewsByUserId = async (userId: number) => {
  const res = await api.get<ApiResponse<CardReview[]>>(`/reviews/user/${userId}`);
  return res.data;
};

// Get review summary
export const getCardReviewSummary = async () => {
  const res = await api.get<ApiResponse<any>>("/reviews/summary");
  return res.data;
};
