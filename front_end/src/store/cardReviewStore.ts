import { create } from "zustand";
import { createCardReview } from "@/api/cardReviewApi";
import type { CardReview } from "@/types/cardReview";
import { toast } from "sonner";

interface CardReviewState {
  cardReviews: CardReview[];
  loading: boolean;
  error: string | null;

  addCardReview: (review: CardReview) => Promise<void>;
}

export const useCardReviewStore = create<CardReviewState>((set) => ({
  cardReviews: [],
  loading: false,
  error: null,

  addCardReview: async (review) => {
    try {
      const res = await createCardReview(review);
      set((state) => ({ cardReviews: [...state.cardReviews, res.data] }));
      toast.success("Card review added successfully");
    } catch (err) {
      toast.error("Failed to create card review");
    }
  },
}));
