import {
  createMemoryCard,
  deleteMemoryCard,
  getMemoryCardById,
  getMemoryCards,
  updateMemoryCard,
} from "@/api/memorycardApi";
import type { MemoryCard, MemoryCardResponse } from "@/types/memorycards";
import { create } from "zustand";
import { toast } from "sonner";

interface MemoryCardState {
  memoryCards: MemoryCardResponse[];
  loading: boolean;
  error: string | null;

  fetchMemoryCards: () => Promise<void>;
  fetchMemoryCardById: (id: number) => Promise<MemoryCardResponse | null>;
  addMemoryCard: (card: MemoryCard) => Promise<void>;
  editMemoryCard: (id: number, card: MemoryCard) => Promise<void>;
  removeMemoryCard: (id: number) => Promise<void>;
}

export const useMemoryCardStore = create<MemoryCardState>((set) => ({
  memoryCards: [],
  loading: false,
  error: null,

  // Fetch all memory cards
  fetchMemoryCards: async () => {
    try {
      set({ loading: true, error: null });
      const res = await getMemoryCards();
      set({ memoryCards: res.data, loading: false });
    } catch (_err) {
      set({ error: "Failed to load memory cards", loading: false });
      toast.error("Failed to load memory cards");
    }
  },

  // Fetch one memory card by ID
  fetchMemoryCardById: async (id) => {
    try {
      const res = await getMemoryCardById(id);
      return res.data;
    } catch {
      toast.error("Failed to load memory card");
      return null;
    }
  },

  // Create a memory card
  addMemoryCard: async (card) => {
    try {
      const res = await createMemoryCard(card);
      set((state) => ({ memoryCards: [...state.memoryCards, res.data] }));
      toast.success("Memory card created successfully");
    } catch {
      toast.error("Failed to create memory card");
    }
  },

  // Update a memory card
  editMemoryCard: async (id, card) => {
    try {
      const res = await updateMemoryCard(id, card);
      set((state) => ({
        memoryCards: state.memoryCards.map((mc) =>
          mc.id === id ? res.data : mc
        ),
      }));
      toast.success("Memory card updated successfully");
    } catch {
      toast.error("Failed to update memory card");
    }
  },

  // Delete a memory card
  removeMemoryCard: async (id) => {
    try {
      await deleteMemoryCard(id);
      set((state) => ({
        memoryCards: state.memoryCards.filter((mc) => mc.id !== id),
      }));
      toast.success("Memory card deleted successfully");
    } catch {
      toast.error("Failed to delete memory card");
    }
  },
}));
