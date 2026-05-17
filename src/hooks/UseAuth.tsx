import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AuthResponse, SignupCredentials, AuthCredentials, AuthState } from '../types/auth';

interface AuthContextValue extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('nexus-auth-token'),
    user: localStorage.getItem('nexus-user') ? JSON.parse(localStorage.getItem('nexus-user')!) : null,
  });

  const login = useCallback(async (credentials: AuthCredentials) => {
    setState((prev:any) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (!credentials.email.includes('@')) {
        throw { code: 'INVALID_EMAIL', message: 'Invalid email address', field: 'email' };
      }
      if (credentials.password.length < 6) {
        throw { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters', field: 'password' };
      }

      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: 'user-' + Date.now(),
          email: credentials.email,
          fullName: credentials.email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        },
      };

      localStorage.setItem('nexus-auth-token', mockResponse.token);
      localStorage.setItem('nexus-user', JSON.stringify(mockResponse.user));

      setState((prev:any) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: mockResponse.user,
      }));
    } catch (err: any) {
      setState((prev:any) => ({
        ...prev,
        isLoading: false,
        error: {
          code: err.code || 'LOGIN_FAILED',
          message: err.message || 'Login failed. Please try again.',
          field: err.field,
        },
      }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState((prev:any) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock validation
      if (!credentials.fullName.trim()) {
        throw { code: 'INVALID_NAME', message: 'Full name is required', field: 'fullName' };
      }
      if (!credentials.email.includes('@')) {
        throw { code: 'INVALID_EMAIL', message: 'Invalid email address', field: 'email' };
      }
      if (credentials.password.length < 8) {
        throw { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters', field: 'password' };
      }
      if (credentials.password !== credentials.confirmPassword) {
        throw { code: 'PASSWORD_MISMATCH', message: 'Passwords do not match', field: 'confirmPassword' };
      }
      if (!credentials.agreeToTerms) {
        throw { code: 'TERMS_NOT_AGREED', message: 'You must agree to the terms', field: 'agreeToTerms' };
      }

      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: 'user-' + Date.now(),
          email: credentials.email,
          fullName: credentials.fullName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        },
      };

      localStorage.setItem('nexus-auth-token', mockResponse.token);
      localStorage.setItem('nexus-user', JSON.stringify(mockResponse.user));

      setState((prev:any) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: mockResponse.user,
      }));
    } catch (err: any) {
      setState((prev:any) => ({
        ...prev,
        isLoading: false,
        error: {
          code: err.code || 'SIGNUP_FAILED',
          message: err.message || 'Signup failed. Please try again.',
          field: err.field,
        },
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nexus-auth-token');
    localStorage.removeItem('nexus-user');
    setState({
      isLoading: false,
      error: null,
      isAuthenticated: false,
      user: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev:any) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};