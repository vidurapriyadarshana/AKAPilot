export interface Pomodoro {
  id?: number;             // optional, set by backend
  durationMinutes: number;  // required
  breakMinutes: number;     // required
  completed: boolean;       // required
  createdAt?: string;       // optional, auto-set by backend
  subjectId: number;        // required, the subject this pomodoro belongs to
}
