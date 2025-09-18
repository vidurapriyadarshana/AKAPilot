// memorycards.ts

export type Status = "NEW" | "LEARNING" | "REVIEW" | "MASTERED";

export interface MemoryCard {
  id: number;
  front: string;
  back: string;
  status: Status;
  deadline?: string; // ISO 8601 string from backend (nullable)
  subjectId: number;
}

export interface MemoryCardResponse extends MemoryCard {
  id: number; // Backend may return ID for update/delete
}