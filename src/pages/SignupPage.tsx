import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
import { Input, Checkbox } from '../components/FormInputs';
import { Button } from '../components/ui';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';

// ─── Icons ────────────────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="16" height="12" rx="1.5" />
    <path d="M1 3l8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="7" width="12" height="10" rx="1" />
    <path d="M4 7V5a4 4 0 1 1 8 0v2" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5" />
    <path d="M1 12c0 0 4-8 11-8s11 8 11 8-4 8-11 8-11-8-11-8Z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3l18 18M9.5 9.5c-.5.5-.7 1-.7 2.5 0 2.2 1.8 4 4 4 1.5 0 2-.2 2.5-.7M12 5C7 5 3 9 1 12c2 3 6 7 11 7s9-4 11-7c-2-3-6-7-11-7Z" />
  </svg>
);

const NexusLogo = () => (
  <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
    <path d="M16 0L32 28H0L16 0Z" fill="currentColor" />
  </svg>
);

function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, signup, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [localError, setLocalError] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/conversations', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error on input change
  useEffect(() => {
    if (error?.field) {
      setLocalError(prev => {
        const newErrors = { ...prev };
        delete newErrors[error.field!];
        return newErrors;
      });
    }
  }, [error?.field]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError({});

    const fullName = nameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword || confirmPassword != password) newErrors.confirmPassword = 'Password should match the original';
    if (!agreeToTerms) newErrors.agree = 'Agree to T&C to proceed';

    if (Object.keys(newErrors).length > 0) {
      setLocalError(newErrors);
      return;
    }

    try {
      await signup({fullName, email, password, confirmPassword,  agreeToTerms});
      // Will auto-navigate via useEffect
    } catch {
      // Error is handled by context
    }
  };

  const displayError = error?.field ? localError[error.field] || error.message : error?.message;

  return (
    <div className={cn('min-h-screen bg-white dark:bg-[#0d1117] transition-colors', 'flex flex-col md:flex-row')}>
      {/* Left side — Brand/Gradient (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0058be] to-[#004ca1] dark:from-[#0058be] dark:to-[#003d80] relative overflow-hidden flex-col justify-between p-8 lg:p-12">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0058be]">
              <NexusLogo />
            </div>
            <div>
              <p className="font-black text-xl text-white tracking-tight">Nexus AI</p>
              <p className="text-xs text-white/70">Support Platform</p>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10">
          <div className="space-y-6">
            {[
              { icon: '⚡', title: 'Instant Support', desc: 'AI-powered responses in seconds' },
              { icon: '🎯', title: 'Smart Routing', desc: 'Tickets reach the right agent' },
              { icon: '📊', title: 'Real Analytics', desc: 'Track support metrics live' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <p className="font-semibold text-white">{feature.title}</p>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 text-white/70 text-sm italic">
          "Support that works as fast as your business grows."
        </div>
      </div>

      {/* Right side — Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-8 lg:px-16">
        {/* Mobile brand (shown only on mobile) */}
        <div className="md:hidden mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0058be] rounded-lg flex items-center justify-center text-white">
            <NexusLogo />
          </div>
          <p className="font-black text-lg text-[#0d1117] dark:text-white">Nexus AI</p>
        </div>

        {/* Form container */}
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-2xl font-black text-[#0d1117] dark:text-white mb-2">Create an account</h1>
          </div>

          {/* Error alert */}
          {displayError && (
            <div className="mb-6 p-3 bg-[#fce4ec] dark:bg-[#ba1a1a]/10 border border-[#f8bbd0] dark:border-[#ba1a1a]/30 rounded-lg">
              <p className="text-sm text-[#ba1a1a] dark:text-[#f9dedc] font-medium">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <Input
              ref={nameRef}
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={localError.name}
              autoComplete="name"
              disabled={isLoading}
              className='ps-10'
            />

            {/* Email */}
            <Input
              ref={emailRef}
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={<EmailIcon />}
              error={localError.email}
              autoComplete="email"
              disabled={isLoading}
              className='ps-10'
            />

            {/* Enter Password */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-sm font-semibold text-[#191c1e] dark:text-white">
                  Enter Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#0058be] dark:text-[#4a9eff] hover:underline"
                >
                </Link>
              </div>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    'w-full px-4 py-3 bg-white dark:bg-[#111827] border rounded-lg pl-10 pr-10',
                    'text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#9aa3bf]',
                    'outline-none transition-all duration-200',
                    'border-[#c6c6cd] dark:border-[#2e3347]',
                    'focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20',
                    localError.password && 'border-[#ba1a1a]',
                    isLoading && 'opacity-60 cursor-not-allowed',
                  )}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf] pointer-events-none">
                  <LockIcon />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf] hover:text-[#191c1e] dark:hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {localError.password && (
                <p className="mt-1.5 text-xs text-[#ba1a1a] dark:text-[#f9dedc] font-medium">
                  {localError.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-sm font-semibold text-[#191c1e] dark:text-white">
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <input
                  ref={confirmPasswordRef}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={cn(
                    'w-full px-4 py-3 bg-white dark:bg-[#111827] border rounded-lg pl-10 pr-10',
                    'text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#9aa3bf]',
                    'outline-none transition-all duration-200',
                    'border-[#c6c6cd] dark:border-[#2e3347]',
                    'focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20',
                    localError.confirmPassword && 'border-[#ba1a1a]',
                    isLoading && 'opacity-60 cursor-not-allowed',
                  )}
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf] pointer-events-none">
                  <LockIcon />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf] hover:text-[#191c1e] dark:hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {localError.confirmPassword && (
                <p className="mt-1.5 text-xs text-[#ba1a1a] dark:text-[#f9dedc] font-medium">
                  {localError.confirmPassword}
                </p>
              )}
            </div>


            {/* Agree to Terms */}
            <Checkbox
              checked={agreeToTerms}
              onChange={(e: any) => setAgreeToTerms(e.target.checked)}
              label="I agree to the Terms & Conditions"
              disabled={isLoading}
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing up...
                </div>
              ) : (
                'Sign up'
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#c6c6cd] dark:border-[#2e3347]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-[#0d1117] text-[#45464d] dark:text-[#9aa3bf]">
                  or
                </span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-[#45464d] dark:text-[#9aa3bf]">
                Have an account?{' '}
                <Link to="/" className="font-semibold text-[#0058be] dark:text-[#4a9eff] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-5 pt-6 border-t border-[#c6c6cd] dark:border-[#2e3347] text-center text-xs text-[#45464d] dark:text-[#9aa3bf] space-y-2">
            <p>By signing up, you agree to our</p>
            <div className="flex justify-center gap-2">
              <Link to="#" className="hover:underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="#" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;