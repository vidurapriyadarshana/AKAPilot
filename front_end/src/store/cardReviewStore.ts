import { create } from "zustand";
import {
  createCardReview,
  getAllCardReviewsForUser,
  getCardReviewsByCardId,
  getCardReviewsByUserId,
  getCardReviewSummary,
} from "@/api/cardReviewApi";
import type { CardReview } from "@/types/cardReview";
import { toast } from "sonner";

interface CardReviewState {
  cardReviews: CardReview[];
  reviewSummary: any;
  loading: boolean;
  error: string | null;

  addCardReview: (review: CardReview) => Promise<void>;
  fetchCardReviewsForUser: () => Promise<void>;
  fetchCardReviewsByCardId: (cardId: number) => Promise<void>;
  fetchCardReviewsByUserId: (userId: number) => Promise<void>;
  fetchReviewSummary: () => Promise<void>;
}

export const useCardReviewStore = create<CardReviewState>((set) => ({
  cardReviews: [],
  reviewSummary: null,
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

  fetchCardReviewsForUser: async () => {
    try {
      set({ loading: true });
      const res = await getAllCardReviewsForUser();
      set({ cardReviews: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load card reviews");
      set({ loading: false });
    }
  },

  fetchCardReviewsByCardId: async (cardId) => {
    try {
      set({ loading: true });
      const res = await getCardReviewsByCardId(cardId);
      set({ cardReviews: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load reviews for card");
      set({ loading: false });
    }
  },

  fetchCardReviewsByUserId: async (userId) => {
    try {
      set({ loading: true });
      const res = await getCardReviewsByUserId(userId);
      set({ cardReviews: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load reviews for user");
      set({ loading: false });
    }
  },

  fetchReviewSummary: async () => {
    try {
      set({ loading: true });
      const res = await getCardReviewSummary();
      set({ reviewSummary: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load review summary");
      set({ loading: false });
    }
  },
}));
