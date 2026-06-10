import { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  primaryAction?: {
    label: string;
    onClick: (props:any)=>any;
    variant?: 'primary' | 'danger';
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  isDangerous?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  isDangerous,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white dark:bg-[#111827] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#c6c6cd] dark:border-[#1e2535]">
          <h2 className={cn(
            'text-lg font-semibold',
            isDangerous ? 'text-[#ba1a1a] dark:text-[#f9dedc]' : 'text-[#0d1117] dark:text-white'
          )}>
            {title}
          </h2>
          {description && (
            <p className="text-sm text-[#45464d] dark:text-[#9aa3bf] mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        {children && (
          <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
            {children}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#c6c6cd] dark:border-[#1e2535] flex gap-2 justify-end">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              disabled={primaryAction?.loading}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[#c6c6cd] dark:border-[#2e3347] text-[#191c1e] dark:text-[#e2e4ef] hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535] transition-colors disabled:opacity-50"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              disabled={primaryAction.loading}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg text-white transition-all disabled:opacity-50 flex items-center gap-2',
                primaryAction.variant === 'danger'
                  ? 'bg-[#ba1a1a] hover:bg-[#9a1515]'
                  : 'bg-[#0058be] hover:bg-[#004ca1]'
              )}
            >
              {primaryAction.loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
