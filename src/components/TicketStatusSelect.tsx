import { cn } from '../utils/cn';
import { TicketStatus } from '../types';

interface TicketStatusSelectProps {
  value: TicketStatus;
  onChange: (status: TicketStatus) => void;
  disabled?: boolean;
}

const StatusOption = ({
  value,
  label,
  selected,
  onChange,
  disabled,
}: {
  value: TicketStatus;
  label: string;
  selected: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => {
  const getColor = () => {
    switch (value) {
      case 'open':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'closed':
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
      case 'resolved':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
  };

  const getTextColor = () => {
    switch (value) {
      case 'open':
        return 'text-red-700 dark:text-red-400';
      case 'pending':
        return 'text-amber-700 dark:text-amber-400';
      case 'closed':
        return 'text-gray-700 dark:text-gray-400';
      case 'resolved':
        return 'text-green-700 dark:text-green-400';
    }
  };

  const getSelectedRing = () => {
    switch (value) {
      case 'open':
        return 'ring-red-500 dark:ring-red-600';
      case 'pending':
        return 'ring-amber-500 dark:ring-amber-600';
      case 'closed':
        return 'ring-gray-400 dark:ring-gray-600';
      case 'resolved':
        return 'ring-green-500 dark:ring-green-600';
    }
  };

  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'flex-1 px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all cursor-pointer',
        getColor(),
        getTextColor(),
        selected && `ring-2 ${getSelectedRing()}`,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {label}
    </button>
  );
};

export function TicketStatusSelect({
  value,
  onChange,
  disabled = false,
}: TicketStatusSelectProps) {
  const statusOptions: Array<{ value: TicketStatus; label: string }> = [
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'closed', label: 'Closed' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#191c1e] dark:text-white mb-3">
        Ticket Status
      </label>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
        {statusOptions.map(option => (
          <StatusOption
            key={option.value}
            value={option.value}
            label={option.label}
            selected={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
