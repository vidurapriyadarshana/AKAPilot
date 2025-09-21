import { create } from "zustand";

import type { StudySessionsDTO, StudySummaryDTO } from "@/types/studysession";
import { toast } from "sonner";
import { createStudySession, deleteStudySession, getAllStudySessions, getStudySessionById, getStudySummary, getTodaysSessions, updateStudySession } from "@/api/studysessionApi";

interface StudySessionState {
  sessions: StudySessionsDTO[];
  todaySessions: StudySessionsDTO[];
  summary: StudySummaryDTO[];
  currentSession: StudySessionsDTO | null;
  loading: boolean;
  error: string | null;

  fetchSessions: () => Promise<void>;
  fetchSessionById: (id: number) => Promise<void>;
  addSession: (session: StudySessionsDTO) => Promise<void>;
  editSession: (id: number, session: StudySessionsDTO) => Promise<void>;
  removeSession: (id: number) => Promise<void>;
  fetchSummary: (userId: number) => Promise<void>;
  fetchTodaySessions: () => Promise<void>;
}

export const useStudySessionStore = create<StudySessionState>((set) => ({
  sessions: [],
  todaySessions: [],
  summary: [],
  currentSession: null,
  loading: false,
  error: null,

  // Fetch all sessions
  fetchSessions: async () => {
    try {
      set({ loading: true });
      console.log('Store: Fetching sessions...');
      const res = await getAllStudySessions();
      console.log('Store: Sessions fetched:', res.data);
      set({ sessions: res.data, loading: false });
    } catch (err) {
      console.error('Store: Failed to fetch sessions:', err);
      toast.error("Failed to load study sessions");
      set({ loading: false });
    }
  },

  // Fetch session by ID
  fetchSessionById: async (id) => {
    try {
      set({ loading: true });
      const res = await getStudySessionById(id);
      set({ currentSession: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load session");
      set({ loading: false });
    }
  },

  // Add new session
  addSession: async (session) => {
    try {
      console.log('Store: Creating session with data:', session);
      const res = await createStudySession(session);
      console.log('Store: Session created successfully:', res);
      set((state) => ({ sessions: [...state.sessions, res.data] }));
      toast.success("Study session created successfully");
    } catch (err) {
      console.error('Store: Session creation failed:', err);
      toast.error("Failed to create session");
      throw err; // Re-throw to let the component handle it
    }
  },

  // Update session
  editSession: async (id, session) => {
    try {
      const res = await updateStudySession(id, session);
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? res.data : s)),
        currentSession: state.currentSession?.id === id ? res.data : state.currentSession,
      }));
      toast.success("Study session updated successfully");
    } catch (err) {
      toast.error("Failed to update session");
    }
  },

  // Delete session
  removeSession: async (id) => {
    try {
      await deleteStudySession(id);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        currentSession: state.currentSession?.id === id ? null : state.currentSession,
      }));
      toast.success("Study session deleted successfully");
    } catch (err) {
      toast.error("Failed to delete session");
    }
  },

  // Fetch summary
  fetchSummary: async (userId) => {
    try {
      set({ loading: true });
      const res = await getStudySummary(userId);
      set({ summary: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load study summary");
      set({ loading: false });
    }
  },

  // Fetch today's sessions
  fetchTodaySessions: async () => {
    try {
      set({ loading: true });
      const res = await getTodaysSessions();
      set({ todaySessions: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load today's sessions");
      set({ loading: false });
    }
  },
}));
