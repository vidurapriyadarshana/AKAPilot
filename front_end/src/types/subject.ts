export interface Subject {
  id: number;
  name: string;
  color: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  priority: "LOW" | "MEDIUM" | "HIGH";
}
