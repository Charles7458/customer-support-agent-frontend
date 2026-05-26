import type { Ticket } from '../types';
import { Badge, Avatar, Button } from './ui';
import { cn } from '../utils/cn';

function StarIcon() {
  return (
    <svg width="16.5" height="16.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}
function ExternalLinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 1H1v13h13V9M9 1h5v5M14 1 7 8" />
    </svg>
  );
}

interface TicketDetailPanelProps {
  ticket: Ticket | null;
  onClose?: () => void;
  isMobileSheet?: boolean;
}

export function TicketDetailPanel({ ticket, onClose, isMobileSheet }: TicketDetailPanelProps) {
  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#45464d] dark:text-[#9aa3bf] text-sm p-8 text-center">
        <div>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-40">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <path d="M9 10h6M9 14h4" />
          </svg>
          Select a ticket to view details
        </div>
      </div>
    );
  }

  const latestMsg = ticket.messages[ticket.messages.length - 1];

  return (
    <div className={cn('flex flex-col h-full bg-[#f7f9fb] dark:bg-[#0d1117]', isMobileSheet && 'rounded-t-2xl')}>
      {/* Panel Header */}
      <div className="bg-white dark:bg-[#111827] border-b border-[#c6c6cd] dark:border-[#1e2535] px-4 pt-4 pb-3 shrink-0">
        <div className="flex items-start justify-between mb-2">
          <span className="font-mono text-xs text-[#45464d] dark:text-[#9aa3bf]">{ticket.ticketNumber}</span>
          {onClose && (
            <button onClick={onClose} className="text-[#45464d] dark:text-[#9aa3bf] hover:text-[#191c1e] dark:hover:text-white transition-colors">
              <ExternalLinkIcon />
            </button>
          )}
        </div>
        <h3 className="text-base font-medium text-[#0d1117] dark:text-white leading-snug mb-2">{ticket.subject}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant={ticket.priority}>{ticket.priority === 'high' ? 'High Priority' : ticket.priority === 'medium' ? 'Med Priority' : 'Low Priority'}</Badge>
          <Badge variant={ticket.status}>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</Badge>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Customer Context */}
        <div className="bg-white dark:bg-[#111827] border border-[#c6c6cd] dark:border-[#1e2535] rounded-xl p-4">
          <p className="text-[11px] font-medium tracking-widest text-[#45464d] dark:text-[#9aa3bf] uppercase mb-3">Customer Context</p>
          <div className="flex items-center gap-3 mb-3">
            <Avatar initials={ticket.customer.avatarInitials} />
            <div>
              <p className="font-medium text-sm text-[#0d1117] dark:text-white">{ticket.customer.name}</p>
              <p className="text-xs text-[#45464d] dark:text-[#9aa3bf]">{ticket.customer.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <p className="text-xs text-[#45464d] dark:text-[#9aa3bf]">Plan</p>
              <p className="text-xs font-semibold text-[#0d1117] dark:text-white">{ticket.customer.plan}</p>
            </div>
            <div>
              <p className="text-xs text-[#45464d] dark:text-[#9aa3bf]">Past Tickets</p>
              <p className="text-xs font-semibold text-[#0d1117] dark:text-white">
                {ticket.customer.pastTickets} ({ticket.customer.openTickets} open)
              </p>
            </div>
          </div>
        </div>

        {/* Latest Message */}
        {latestMsg && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium tracking-widest text-[#45464d] dark:text-[#9aa3bf] uppercase">Latest Message</p>
              <p className="text-[11px] text-[#45464d] dark:text-[#9aa3bf]">{ticket.lastUpdated}</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#c6c6cd] dark:border-[#1e2535] rounded-br-xl rounded-bl-xl rounded-tr-xl p-4">
              <p className="text-xs font-semibold text-[#0d1117] dark:text-white mb-2">Hi support team,</p>
              <p className="text-sm text-[#191c1e] dark:text-[#e2e4ef] leading-relaxed whitespace-pre-wrap">{latestMsg.content}</p>
              <p className="text-[11px] text-[#45464d] dark:text-[#9aa3bf] mt-3">{latestMsg.timestamp}</p>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {ticket.aiInsight && (
          <div className="bg-white dark:bg-[#111827] border border-[#c6c6cd] dark:border-[#1e2535] rounded-xl p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0058be] to-[#2170e4] rounded-l-xl" />
            <div className="flex items-center gap-2 mb-2 pl-1">
              <StarIcon />
              <p className="text-[11px] font-medium tracking-widest text-[#45464d] dark:text-[#9aa3bf] uppercase">AI Insights</p>
            </div>
            <p className="text-sm text-[#191c1e] dark:text-[#e2e4ef] leading-relaxed pl-1">{ticket.aiInsight.summary}</p>
            <div className="flex flex-wrap gap-2 mt-3 pl-1">
              {ticket.aiInsight.suggestedActions.map(action => (
                <span key={action} className="px-2 py-1 text-xs rounded-md bg-[#f7f9fb] dark:bg-[#1e2535] border border-[#c6c6cd] dark:border-[#2e3347] text-[#45464d] dark:text-[#9aa3bf]">
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="shrink-0 bg-white dark:bg-[#111827] border-t border-[#c6c6cd] dark:border-[#1e2535] backdrop-blur-md p-4 space-y-2">
        <Button variant="ai" className="w-full gap-2">
          <StarIcon />
          Generate AI Response
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" className="justify-center">Reply</Button>
          <Button variant="secondary" className="justify-center">Assign</Button>
        </div>
      </div>
    </div>
  );
}
