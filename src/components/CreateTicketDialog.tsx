import { useState, useRef } from 'react';
import { Dialog } from './Dialog';
import { Checkbox, Input } from './FormInputs';
import { cn } from '../utils/cn';


const EmailIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="16" height="12" rx="1.5" />
    <path d="M1 3l8 6 8-6" />
  </svg>
);


interface CreateTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { issue: string; priority: 'high' | 'medium' | 'low' }) => Promise<void>;
  isSupport: boolean;
  onSubmitSupport: (data: { issue: string; priority: 'high' | 'medium' | 'low' ; customer_email: string; set_me_as_agent: boolean}) => Promise<void>;

}

export const PriorityOption = ({
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
  isSupport,
  onSubmitSupport
}: CreateTicketDialogProps) {
  const issueRef = useRef<HTMLTextAreaElement>(null);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const emailRef = useRef<HTMLInputElement>(null)
  const [setMeAsAgent, setSetMeAsAgent] = useState(false)
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

    const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const issue = issueRef.current?.value.trim() || '';
    const custEmail = emailRef.current?.value.trim() || '';
    // Validation
    if (!issue) {
      setErrors({ issue: 'Please describe the issue' });
      return;
    }

    if (issue.length < 10) {
      setErrors({ issue: 'Issue description must be at least 10 characters' });
      return;
    }

    if(custEmail.length < 5 && !custEmail.includes("@")){
      setErrors({custEmail: 'Enter proper customer email'})
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(issue+"\n"+priority)
      await onSubmitSupport({ issue, priority ,customer_email: custEmail, set_me_as_agent: setMeAsAgent});
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
        onClick: isSupport ? handleSubmitSupport : handleSubmit,
        loading: isSubmitting,
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: handleClose,
      }}
    >
      <form onSubmit={isSupport ? handleSubmitSupport : handleSubmit} className="space-y-5" id="CreateTicketForm">
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
        { isSupport &&
          <div>
            <div>
              <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-2.5">
                Customer Email
              </label>
              <Input
                  ref={emailRef}
                  type="email"
                  placeholder="you@example.com"
                  icon={<EmailIcon />}
                  error={errors.custEmail}
                  autoComplete="email"
                  disabled={isSubmitting}
              />
            </div>
            <Checkbox
                  checked={setMeAsAgent}
                  onChange={e => setSetMeAsAgent(e.target.checked)}
                  label="Set me as agent"
                  disabled={isSubmitting}
            />
        </div>
      }
      </form>
    </Dialog>
  );
}
