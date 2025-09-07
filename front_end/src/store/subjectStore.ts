import { create } from "zustand";
import type { Subject } from "../types/subject";
import { getSubjects } from "../api/subjectApi";

interface SubjectState {
  subjects: Subject[];
  fetchSubjects: () => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  fetchSubjects: async () => {
    try {
      const data = await getSubjects();
      set({ subjects: data.data }); // backend returns ApiResponse
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  },
}));
