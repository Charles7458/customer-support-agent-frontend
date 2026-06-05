import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'open' | 'pending' | 'closed' | 'resolved' | 'high' | 'medium' | 'low';

const badgeStyles: Record<BadgeVariant, string> = {
  open: 'bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400',
  pending: 'bg-gray-200 border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300',
  closed: 'bg-gray-100 border border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400',
  resolved: 'bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400',
  high: 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400',
  medium: 'bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400',
  low: 'bg-gray-100 border border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400',
};

export function Badge({ variant, children, className }: { variant: BadgeVariant; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium leading-tight', badgeStyles[variant], className)}>
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const btnBase = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer';
const btnVariants = {
  primary: 'bg-[#0058be] hover:bg-[#004ca1] text-white border border-white/10 shadow-sm',
  secondary: 'bg-white dark:bg-[#1e2535] border border-[#c6c6cd] dark:border-[#2e3347] text-[#191c1e] dark:text-[#e2e4ef] hover:bg-[#f7f9fb] dark:hover:bg-[#252c3d]',
  ghost: 'bg-transparent hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535] text-[#45464d] dark:text-[#9aa3bf]',
  ai: 'bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white border border-white/10 shadow-md hover:opacity-90',
};
const btnSizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...props}>
      {children}
    </button>
  );
}

//───function for avatar bgColor───────────────
const avatarBgColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
];
function getAvatarColor(seed:string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index =
    Math.abs(hash) % avatarBgColors.length;

  return avatarBgColors[index];
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({
  name,
  hover,
  size = 'md',
  src,
}: {
  name?: string;
  hover?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
}) {
  const sizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm', xl:'w-20 h-20 text-8xl'};
  const bgColor = getAvatarColor(name || 'U')
  const fontSize = {'sm': '100%', 'md':'', 'lg': '', 'xl': '200%'};
  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-semibold text-white shrink-0 overflow-hidden cursor-pointer', sizes[size])}
      style={{ backgroundColor: bgColor, fontSize: fontSize[size] }}
      title={hover || name}
    >
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : name?.charAt(0) || 'U'}
    </div>
  );
}

// ─── Priority Icon ─────────────────────────────────────────────────────────────
export function PriorityIcon({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  if (priority === 'high')
    return (
      <svg width="7" height="9" viewBox="0 0 7 9" fill="none" className="shrink-0">
        <path d="M3.5 0L7 9H0L3.5 0Z" fill="#ba1a1a" />
      </svg>
    );
  if (priority === 'medium')
    return (
      <svg width="9" height="4" viewBox="0 0 9 4" fill="none" className="shrink-0">
        <path d="M0 0H9V4H0V0Z" fill="#98805d" />
      </svg>
    );
  return (
    <svg width="7" height="5" viewBox="0 0 7 5" fill="none" className="shrink-0">
      <path d="M3.5 5L0 0H7L3.5 5Z" fill="#6b7280" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4', className)} />
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
export function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-5 py-4">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-[#c6c6cd] dark:bg-[#4a5068]"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0) } 40% { transform: translateY(-6px) } }`}</style>
    </div>
  );
}
