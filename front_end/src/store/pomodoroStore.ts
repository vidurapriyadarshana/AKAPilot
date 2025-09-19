import { create } from "zustand";
import { toast } from "sonner";
import type { Pomodoro } from "@/types/pomodoro";
import {
  getPomodorosBySession,
  createPomodoro,
  updatePomodoro,
  deletePomodoro,
} from "@/api/pomodoroApi";

interface PomodoroState {
  pomodoros: Pomodoro[];
  loading: boolean;
  error: string | null;

  fetchPomodorosBySession: (sessionId: number) => Promise<void>;
  addPomodoro: (pomodoro: Pomodoro) => Promise<void>;
  editPomodoro: (id: number, pomodoro: Pomodoro) => Promise<void>;
  removePomodoro: (id: number) => Promise<void>;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  pomodoros: [],
  loading: false,
  error: null,

  fetchPomodorosBySession: async (sessionId) => {
    try {
      set({ loading: true });
      const res = await getPomodorosBySession(sessionId);
      set({ pomodoros: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load pomodoros");
      set({ loading: false });
    }
  },

  addPomodoro: async (pomodoro) => {
    try {
      const res = await createPomodoro(pomodoro);
      set((state) => ({ pomodoros: [...state.pomodoros, res.data] }));
      toast.success("Pomodoro created successfully");
    } catch (err) {
      toast.error("Failed to create pomodoro");
    }
  },

  editPomodoro: async (id, pomodoro) => {
    try {
      const res = await updatePomodoro(id, pomodoro);
      set((state) => ({
        pomodoros: state.pomodoros.map((p) => (p.id === id ? res.data : p)),
      }));
      toast.success("Pomodoro updated successfully");
    } catch (err) {
      toast.error("Failed to update pomodoro");
    }
  },

  removePomodoro: async (id) => {
    try {
      await deletePomodoro(id);
      set((state) => ({
        pomodoros: state.pomodoros.filter((p) => p.id !== id),
      }));
      toast.success("Pomodoro deleted successfully");
    } catch (err) {
      toast.error("Failed to delete pomodoro");
    }
  },
}));
