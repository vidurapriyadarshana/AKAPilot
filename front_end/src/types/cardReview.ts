export interface CardReview {
  id?: number;           // optional, set by backend
  reviewDate?: string;    // optional, auto-set by backend
  success: boolean;       // required
  memoryCardId: number;   // required
  userId?: number;        // optional, resolved from security context
}
