import { create } from "zustand";
import { toast } from "sonner";
import type { Pomodoro } from "@/types/pomodoro";
import {
  getPomodorosBySubject,
  getAllPomodorosByUser,
  createPomodoro,
  updatePomodoro,
  deletePomodoro,
} from "@/api/pomodoroApi";

interface PomodoroState {
  pomodoros: Pomodoro[];
  allPomodoros: Pomodoro[];
  loading: boolean;
  error: string | null;

  fetchPomodorosBySubject: (subjectId: number) => Promise<void>;
  fetchAllPomodorosByUser: () => Promise<void>;
  addPomodoro: (pomodoro: Pomodoro) => Promise<void>;
  editPomodoro: (id: number, pomodoro: Pomodoro) => Promise<void>;
  removePomodoro: (id: number) => Promise<void>;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  pomodoros: [],
  allPomodoros: [],
  loading: false,
  error: null,

  fetchPomodorosBySubject: async (subjectId) => {
    try {
      set({ loading: true });
      const res = await getPomodorosBySubject(subjectId);
      set({ pomodoros: res.data, loading: false });
    } catch (_err) {
      toast.error("Failed to load pomodoros");
      set({ loading: false });
    }
  },

  fetchAllPomodorosByUser: async () => {
    try {
      set({ loading: true });
      const res = await getAllPomodorosByUser();
      set({ allPomodoros: res.data, loading: false });
    } catch (_err) {
      toast.error("Failed to load pomodoros");
      set({ loading: false });
    }
  },

  addPomodoro: async (pomodoro) => {
    try {
      const res = await createPomodoro(pomodoro);
      set((state) => ({ pomodoros: [...state.pomodoros, res.data] }));
      toast.success("Pomodoro created successfully");
    } catch (_err) {
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
    } catch (_err) {
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
    } catch (_err) {
      toast.error("Failed to delete pomodoro");
    }
  },
}));
