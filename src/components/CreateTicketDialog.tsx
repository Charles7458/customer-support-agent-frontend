import { useState, useRef } from 'react';
import { Dialog } from './Dialog';
import { Input } from './FormInputs';
import { cn } from '../utils/cn';

interface CreateTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { issue: string; priority: 'high' | 'medium' | 'low' }) => Promise<void>;
}

const PriorityOption = ({
  value,
  label,
  selected,
  onChange,
}: {
  value: 'high' | 'medium' | 'low';
  label: string;
  selected: boolean;
  onChange: () => void;
}) => {
  const getColor = () => {
    switch (value) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'low':
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const getTextColor = () => {
    switch (value) {
      case 'high':
        return 'text-red-700 dark:text-red-400';
      case 'medium':
        return 'text-amber-700 dark:text-amber-400';
      case 'low':
        return 'text-gray-700 dark:text-gray-400';
    }
  };

  const getSelectedRing = () => {
    switch (value) {
      case 'high':
        return 'ring-red-500 dark:ring-red-600';
      case 'medium':
        return 'ring-amber-500 dark:ring-amber-600';
      case 'low':
        return 'ring-gray-400 dark:ring-gray-600';
    }
  };

  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'flex-1 px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all cursor-pointer',
        getColor(),
        getTextColor(),
        selected && `ring-2 ${getSelectedRing()}`
      )}
    >
      {label}
    </button>
  );
};

export function CreateTicketDialog({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketDialogProps) {
  const issueRef = useRef<HTMLTextAreaElement>(null);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const issue = issueRef.current?.value.trim() || '';

    // Validation
    if (!issue) {
      setErrors({ issue: 'Please describe the issue' });
      return;
    }

    if (issue.length < 10) {
      setErrors({ issue: 'Issue description must be at least 10 characters' });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(issue+"\n"+priority)
      await onSubmit({ issue, priority });
      // Reset form
      if (issueRef.current) issueRef.current.value = '';
      setPriority('medium');
      onClose();
    } catch (err: any) {
      setErrors({ issue: 'Failed to create ticket' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      if (issueRef.current) issueRef.current.value = '';
      setPriority('medium');
      onClose();
    }
  };



  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Ticket"
      description="Describe your issue and set the priority level"
      primaryAction={{
        label: 'Create Ticket',
        onClick: handleSubmit,
        loading: isSubmitting,
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: handleClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5" id="CreateTicketForm">
        {/* Issue Textarea */}
        <div>
          <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2.5">
            Issue Description
          </label>
          <textarea
            ref={issueRef}
            placeholder="Describe the issue you're facing..."
            rows={4}
            className={cn(
              'w-full px-4 py-3 bg-white dark:bg-[#0d1117] border rounded-lg',
              'text-[#191c1e] dark:text-[#e2e4ef] placeholder:text-[#9aa3bf] dark:placeholder:text-[#6b7c9e]',
              'outline-none transition-all duration-200 resize-none',
              'focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#0058be]/30',
              errors.issue
                ? 'border-[#ba1a1a] dark:border-[#f9dedc] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                : 'border-[#c6c6cd] dark:border-[#2e3347]'
            )}
            disabled={isSubmitting}
          />
          {errors.issue && (
            <p className="mt-1.5 text-xs text-[#ba1a1a] dark:text-[#f9dedc] font-medium">
              {errors.issue}
            </p>
          )}
          <p className="mt-1 text-xs text-[#45464d] dark:text-[#9aa3bf]">
            Minimum 10 characters
          </p>
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-3">
            Priority Level
          </label>
          <div className="flex gap-2">
            <PriorityOption
              value="low"
              label="Low"
              selected={priority === 'low'}
              onChange={() => setPriority('low')}
            />
            <PriorityOption
              value="medium"
              label="Medium"
              selected={priority === 'medium'}
              onChange={() => setPriority('medium')}
            />
            <PriorityOption
              value="high"
              label="High"
              selected={priority === 'high'}
              onChange={() => setPriority('high')}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
