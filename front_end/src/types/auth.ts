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

// Auth-specific response
export interface AuthResponseDTO {
  accessToken: string;
}
