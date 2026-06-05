// ─── Authentication Types ─────────────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}


export interface SignupCredentials extends AuthCredentials {
  fullName: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface SupportAuthCredentials extends AuthCredentials{
  supportSecret: string;
}

export interface SupportSignupCredentials extends SignupCredentials {
  supportSecret: string;
}

export interface AuthResponse {
  user: {
    fullName: string;
    email:string;
    role: string;
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
