import { create } from "zustand";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/api/subjectApi";
import type { Subject } from "@/types/subject";
import { toast } from "sonner";

interface SubjectState {
  subjects: Subject[];
  currentSubject: Subject | null;
  loading: boolean;
  error: string | null;
  fetchSubjects: () => Promise<void>;
  fetchSubjectById: (id: number) => Promise<void>;
  addSubject: (subject: Subject) => Promise<void>;
  editSubject: (id: number, subject: Subject) => Promise<void>;
  removeSubject: (id: number) => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,

  // Fetch all subjects
  fetchSubjects: async () => {
    try {
      set({ loading: true });
      const res = await getSubjects();
      set({ subjects: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load subjects");
      set({ loading: false });
    }
  },

  // Fetch subject by ID
  fetchSubjectById: async (id) => {
    try {
      set({ loading: true });
      const res = await getSubject(id);
      set({ currentSubject: res.data, loading: false });
    } catch (err) {
      toast.error("Failed to load subject");
      set({ loading: false });
    }
  },

  // Add new subject
  addSubject: async (subject) => {
    try {
      const res = await createSubject(subject);
      set((state) => ({ subjects: [...state.subjects, res.data] }));
      toast.success("Subject added successfully");
    } catch (err) {
      toast.error("Failed to create subject");
    }
  },

  // Update subject
  editSubject: async (id, subject) => {
    try {
      const res = await updateSubject(id, subject);
      set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? res.data : s)),
        currentSubject: state.currentSubject?.id === id ? res.data : state.currentSubject,
      }));
      toast.success("Subject updated successfully");
    } catch (err) {
      toast.error("Failed to update subject");
    }
  },

  // Delete subject
  removeSubject: async (id) => {
    try {
      await deleteSubject(id);
      set((state) => ({
        subjects: state.subjects.filter((s) => s.id !== id),
        currentSubject: state.currentSubject?.id === id ? null : state.currentSubject,
      }));
      toast.success("Subject deleted successfully");
    } catch (err) {
      toast.error("Failed to delete subject");
    }
  },
}));
