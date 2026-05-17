import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-white dark:bg-[#111827] border rounded-lg',
              'text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#9aa3bf] dark:placeholder:text-[#6b7c9e]',
              'outline-none transition-all duration-200',
              'focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#0058be]/30',
              error
                ? 'border-[#ba1a1a] dark:border-[#f9dedc] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                : 'border-[#c6c6cd] dark:border-[#2e3347] focus:border-[#0058be]',
              className,
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45464d] dark:text-[#9aa3bf] pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#ba1a1a] dark:text-[#f9dedc] font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[#45464d] dark:text-[#9aa3bf]">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

// ─── Checkbox ─────────────────────────────────────────────────────────────────
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-5 h-5 mt-0.5 appearance-none rounded-lg border-2',
            'bg-white dark:bg-[#111827] border-[#c6c6cd] dark:border-[#2e3347]',
            'cursor-pointer transition-all duration-200 shrink-0',
            'checked:bg-[#0058be] checked:border-[#0058be] dark:checked:bg-[#0058be]',
            'focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be]',
            'checked:after:content-[\'\'] checked:after:block checked:after:w-1 checked:after:h-2',
            'checked:after:border-white checked:after:border-r-[2px] checked:after:border-b-[2px]',
            'checked:after:absolute checked:after:top-[-1px] checked:after:left-[3px] checked:after:-rotate-45',
            error && 'border-[#ba1a1a] dark:border-[#f9dedc]',
            className,
          )}
          {...props}
        />
        <span className="text-sm text-[#191c1e] dark:text-[#e2e4ef]">{label}</span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-[#ba1a1a] dark:text-[#f9dedc] font-medium">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';