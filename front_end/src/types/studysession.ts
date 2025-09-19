export interface StudySessionsDTO {
  id?: number;               // optional when creating a new session
  startTime: string;         // ISO string
  endTime: string;           // ISO string
  notes?: string;
  subjectId: number;
  todoId?: number;
}

export interface StudySummaryDTO {
  subjectId: number;
  subjectName: string;
  totalStudyMinutes: number;
}
