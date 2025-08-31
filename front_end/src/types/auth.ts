// Request DTOs
export interface AuthDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
  email: string;
  role: string;
}

// Response wrapper (generic)
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Auth-specific response
export interface AuthResponseDTO {
  accessToken: string;
}
