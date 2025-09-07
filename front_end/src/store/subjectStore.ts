import { create } from "zustand";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/api/subjectApi";
import type { Subject } from "@/types/subject";

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
  addSubject: (subject: Subject) => Promise<void>;
  editSubject: (id: number, subject: Subject) => Promise<void>;
  removeSubject: (id: number) => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  loading: false,
  error: null,

  fetchSubjects: async () => {
    try {
      set({ loading: true });
      const res = await getSubjects();
      console.log("@@@@@@@" , res);// res is ApiResponse<Subject[]>
      set({ subjects: res.data, loading: false }); // ✅ make sure res.data points to actual subjects
    } catch (err) {
      set({ error: "Failed to load subjects", loading: false });
    }
  },

  addSubject: async (subject) => {
    try {
      const res = await createSubject(subject);
      set((state) => ({ subjects: [...state.subjects, res.data] }));
    } catch (err) {
      set({ error: "Failed to create subject" });
    }
  },

  editSubject: async (id, subject) => {
    try {
      const res = await updateSubject(id, subject);
      set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? res.data : s)),
      }));
    } catch (err) {
      set({ error: "Failed to update subject" });
    }
  },

  removeSubject: async (id) => {
    try {
      await deleteSubject(id);
      set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
      }));
    } catch (err) {
      set({ error: "Failed to delete subject" });
    }
  },
}));
