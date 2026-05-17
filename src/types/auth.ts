// ─── Authentication Types ─────────────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  fullName: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
  };
}

export interface AuthError {
  code: string;
  message: string;
  field?: keyof AuthCredentials | keyof SignupCredentials;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
}

// Validation error types
export type ValidationError = Partial<Record<keyof SignupCredentials | keyof AuthCredentials, string>>;