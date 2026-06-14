import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { AuthResponse, SignupCredentials, AuthCredentials, AuthState, SupportAuthCredentials, SupportSignupCredentials } from '../types/auth';

interface AuthContextValue extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials & { rememberMe?: boolean }) => Promise<void>;
  supportLogin: (credentials: SupportAuthCredentials) => Promise<void>;
  supportSignup: (credentials: SupportSignupCredentials & { rememberMe?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_URL = `${import.meta.env.VITE_API_URL}/auth`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null,
  });

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Try to fetch current user from backend (validates if cookie/session is still valid)
      const res = await fetch(`${AUTH_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const response = await res.json();
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user: response.user,
          error: null,
        }));
        console.log(response.user)
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          user: null,
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      }));
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: AuthCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Client-side validation
      if (!credentials.email.includes('@')) {
        throw { code: 'INVALID_EMAIL', message: 'Invalid email address', field: 'email' };
      }
      if (credentials.password.length < 6) {
        throw { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters', field: 'password' };
      }

      const login_url = `${AUTH_URL}/login`;

      const res = await fetch(login_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.rememberMe
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw {
          code: 'LOGIN_FAILED',
          message: errorData.message || 'Login failed. Please try again.',
        };
      }

      const response = await res.json();

      // Check if response indicates success
      if (response.message && response.message !== 'Successful') {
        throw new Error(response.message);
      }

      if (!response.user) {
        throw new Error('No user data returned from server');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        error: null,
      }));

      console.log('Login successful:', response);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: err.code || 'LOGIN_FAILED',
          message: errorMessage,
          field: err.field,
        },
      }));
      throw err;
    }
  }, []);

  const supportLogin = useCallback(async (credentials: SupportAuthCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Client-side validation
      if (!credentials.email.includes('@')) {
        throw { code: 'INVALID_EMAIL', message: 'Invalid email address', field: 'email' };
      }
      if (credentials.password.length < 6) {
        throw { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters', field: 'password' };
      }


      const login_url = `${AUTH_URL}/support/login`;

      const res = await fetch(login_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.rememberMe,
          support_secret: credentials.supportSecret
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw {
          code: 'LOGIN_FAILED',
          message: errorData.message || 'Login failed. Please try again.',
        };
      }

      const response = await res.json();

      // Check if response indicates success
      if (response.message && response.message !== 'Successful') {
        throw new Error(response.message);
      }

      if (!response.user) {
        throw new Error('No user data returned from server');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        error: null,
      }));

      console.log('Login successful:', response);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: err.code || 'LOGIN_FAILED',
          message: errorMessage,
          field: err.field,
        },
      }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials & { rememberMe?: boolean }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Client-side validation
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

      const signup_url = `${AUTH_URL}/signup`;

      const res = await fetch(signup_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: credentials.fullName,
          email: credentials.email,
          password: credentials.password,
          agree_to_terms: credentials.agreeToTerms,
          remember_me: credentials.rememberMe || false
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw {
          code: 'SIGNUP_FAILED',
          message: errorData.message || 'Signup failed. Please try again.',
        };
      }

      const response = await res.json();

      // Check if response indicates success
      if (response.message && response.message !== 'Successful') {
        throw new Error(response.message);
      }

      if (!response.user) {
        throw new Error('No user data returned from server');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        error: null,
      }));

      console.log('Signup successful:', response);
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: err.code || 'SIGNUP_FAILED',
          message: errorMessage,
          field: err.field,
        },
      }));
      throw err;
    }
  }, []);


    const supportSignup = useCallback(async (credentials: SupportSignupCredentials & { rememberMe?: boolean }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Client-side validation
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

      const signup_url = `${AUTH_URL}/support/signup`;

      const res = await fetch(signup_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: credentials.fullName,
          email: credentials.email,
          password: credentials.password,
          agree_to_terms: credentials.agreeToTerms,
          remember_me: credentials.rememberMe || false,
          support_secret: credentials.supportSecret
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw {
          code: 'SIGNUP_FAILED',
          message: errorData.message || 'Signup failed. Please try again.',
        };
      }

      const response = await res.json();

      // Check if response indicates success
      if (response.message && response.message !== 'Successful') {
        throw new Error(response.message);
      }

      if (!response.user) {
        throw new Error('No user data returned from server');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        error: null,
      }));

      console.log('Signup successful:', response);
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          code: err.code || 'SIGNUP_FAILED',
          message: errorMessage,
          field: err.field,
        },
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Call backend logout to clear cookie
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {
        // Continue even if logout request fails
      });

      setState({
        isLoading: false,
        error: null,
        isAuthenticated: false,
        user: null,
      });

      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
      setState({
        isLoading: false,
        error: null,
        isAuthenticated: false,
        user: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, supportLogin, supportSignup, logout, clearError, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
