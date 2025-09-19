export interface Pomodoro {
  id?: number;             // optional, set by backend
  durationMinutes: number;  // required
  breakMinutes: number;     // required
  completed: boolean;       // required
  createdAt?: string;       // optional, auto-set by backend
  studySessionId: number;   // required
}
