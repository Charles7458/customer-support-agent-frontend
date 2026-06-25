import { useState } from 'react';
import type { OrderStatus, TrackingWidget } from '../types';
import type { ChatMessage } from '../types/index.ts';
import { cn } from '../utils/cn';
import { TypingIndicator, Avatar } from './ui';

// ─── AI Avatar ────────────────────────────────────────────────────────────────
export function AIAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-6 h-6' : 'w-10 h-10';
  return (
    <div className={cn('rounded-full bg-[#2170e4] border border-[#2170e4]/50 flex items-center justify-center shrink-0', s)}>
      <svg width={size === 'sm' ? 12 : 16} height={size === 'sm' ? 11 : 14} viewBox="0 0 16.5 14.25" fill="white">
        <path d="M8.25 0L16.5 14.25H0L8.25 0Z" />
      </svg>
    </div>
  );
}

const ORDER_STATUS_COLORS = {
  Ordered: {
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-700",
    text: "text-slate-800 dark:text-slate-200",
  },

  Shipped: {
    bg: "bg-blue-100 dark:bg-blue-950",
    border: "border-blue-300 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-300",
  },

  "Out for Delivery": {
    bg: "bg-amber-100 dark:bg-amber-950",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-300",
  },

  Delivered: {
    bg: "bg-green-100 dark:bg-green-950",
    border: "border-green-300 dark:border-green-800",
    text: "text-green-800 dark:text-green-300",
  },

  "Delivery Failed": {
    bg: "bg-red-100 dark:bg-red-950",
    border: "border-red-300 dark:border-red-800",
    text: "text-red-800 dark:text-red-300",
  },
} as const;

// ─── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ orderId, status, productName }: { orderId: string; status: OrderStatus; productName: string;}) {
  const statusColors = ORDER_STATUS_COLORS[status]
  // previous outer bg and border : bg-[#f7f9fb] dark:bg-[#1e2535] border border-[#c6c6cd] dark:border-[#2e3347]
  // previous inner bg : bg-[#eceef0] dark:bg-[#252c3d]
  return (
    <div className={`flex items-center gap-4 border ${statusColors.border} ${statusColors.bg} rounded-xl p-4 mt-3`}>
      <div className="w-16 h-16  rounded-lg flex items-center justify-center shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#45464d" strokeWidth="1.5">
          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-1 11h6m-3-3l3 3-3 3" />
          <rect x="9" y="11" width="14" height="10" rx="2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#191c1e] dark:text-white text-sm">{orderId}</p>
        <p className="font-bold text-[#191c1e] dark:text-white text-sm">{productName}</p>
        <p className={`text-sm font-medium ${statusColors.text}`}>{status}</p>
      </div>
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1l5 5-5 5" stroke="#45464d" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ lines }: { lines: string[] }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative bg-[#0d1117] rounded-lg p-4 mt-3 font-mono text-sm">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
      >
        {copied ? '✓' : '⎘'}
      </button>
      {lines.map((line, i) => (
        <div key={i} className={i === 0 ? 'text-white' : 'text-gray-400'}>{line}</div>
      ))}
    </div>
  );
}

//
function TrackIDBlock({ trackingID, carrier }: { trackingID: string, carrier: string }) {
  const [copied, setCopied] = useState(false);
  const lines = [`Tracking ID: ${trackingID}`, `Carrier: ${carrier}`]
  const copy = () => {
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative bg-[#0d1117] rounded-lg p-4 mt-3 font-mono text-sm">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
      >
        {copied ? '✓' : '⎘'}
      </button>
      {lines.map((line, i) => (
        <div key={i} className={i === 0 ? 'text-white' : 'text-gray-400'}>{line}</div>
      ))}
    </div>
  );
}

// ─── Tracking Widget ──────────────────────────────────────────────────────────
function TrackingWidgetCard({ widget }: { widget: TrackingWidget }) {
  return (
    <div className="mt-3 border border-[#c6c6cd] dark:border-[#2e3347] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#c6c6cd] dark:border-[#2e3347] bg-white dark:bg-[#1a2236]">
        <div className="flex items-center gap-2">
          <svg width="22" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#45464d] dark:text-[#9aa3bf]">
            <path d="M1 1h15v10H1zM16 5h4l3 3v3h-7V5z" />
            <circle cx="5.5" cy="13.5" r="1.5" />
            <circle cx="18.5" cy="13.5" r="1.5" />
          </svg>
          <span className="text-xs font-medium text-[#45464d] dark:text-[#9aa3bf]">Shipment Tracker – {widget.orderId}</span>
        </div>
        <span className="text-xs text-[#0058be] dark:text-[#4a9eff] font-medium">Track Live</span>
      </div>

      {/* Progress */}
      <div className="px-6 pt-6 pb-2">
        <div className="relative h-2 bg-[#eceef0] dark:bg-[#2e3347] rounded-full">
          <div className="h-2 bg-[#0058be] rounded-full transition-all" style={{ width: `${widget.progress}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[11px] text-[#45464d] dark:text-[#9aa3bf]">
          <span>Ordered</span><span>Shipped</span><span className="font-semibold text-[#0058be]">In Transit</span><span>Delivered</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px mx-6 mb-4 mt-3">
        {[
          { label: 'Expected Delivery', value: widget.expectedDelivery },
          { label: 'Current Location', value: widget.currentLocation },
          { label: 'Confidence', value: widget.confidenceScore },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#f7f9fb] dark:bg-[#1e2535] border border-[#c6c6cd] dark:border-[#2e3347] px-3 py-2 rounded-lg">
            <p className="text-[11px] text-[#45464d] dark:text-[#9aa3bf]">{label}</p>
            <p className="text-sm font-semibold text-[#191c1e] dark:text-white mt-0.5 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="px-6 pb-5">
        <div className="relative pl-5">
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#c6c6cd] dark:bg-[#2e3347]" />
          {widget.steps.map((step) => (
            <div key={step.id} className="relative mb-4 last:mb-0">
              <div className={cn(
                'absolute -left-5 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                step.status === 'completed' ? 'bg-[#0058be] border-[#0058be]' : step.status === 'active' ? 'bg-white dark:bg-[#111827] border-[#0058be]' : 'bg-[#eceef0] dark:bg-[#2e3347] border-[#c6c6cd]',
              )}>
                {step.status === 'completed' && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="white">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-[#0058be]" />}
              </div>
              <p className={cn('text-xs font-medium', step.status === 'pending' ? 'text-[#9aa3bf]' : 'text-[#191c1e] dark:text-white')}>{step.label}</p>
              <p className="text-[11px] text-[#45464d] dark:text-[#9aa3bf]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Suggested Actions ─────────────────────────────────────────────────────────
function SuggestedActions({ actions }: { actions: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 px-1">
      {actions.map((action) => (
        <button
          key={action}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c6c6cd] dark:border-[#2e3347] text-[13px] text-[#191c1e] dark:text-[#e2e4ef] bg-white dark:bg-[#1e2535] hover:bg-[#f7f9fb] dark:hover:bg-[#252c3d] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1Z" />
          </svg>
          {action}
        </button>
      ))}
    </div>
  );
}

// ─── Security Banner ──────────────────────────────────────────────────────────
export function SecurityBanner() {
  return (
    <div className="mx-auto max-w-[768px] bg-[#eceef0] dark:bg-[#1a2236] border border-[#c6c6cd] dark:border-[#2e3347] rounded-lg px-4 py-3 flex gap-3 items-start shadow-sm">
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="shrink-0 mt-0.5">
        <path d="M8 1L1 4v6c0 4.5 3 8.5 7 9.5 4-1 7-5 7-9.5V4L8 1Z" stroke="#45464d" strokeWidth="1.5" fill="none" />
        <path d="M5 10l2 2 4-4" stroke="#0058be" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div>
        <p className="font-bold text-[#191c1e] dark:text-white text-sm">Secure Session Active</p>
        <p className="text-sm text-[#45464d] dark:text-[#9aa3bf] mt-0.5">
          This conversation is protected by Nexus AI Guardrails. PII and sensitive payment information will be automatically redacted.
        </p>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
export function MessageBubble({ message, isMobile, role ,OtherAvatar}: { message: ChatMessage; isMobile?: boolean; role:string ,
  OtherAvatar: JSX.Element}) {
  console.log(message)
  console.log(message.role+"<- msg, user->"+role)
  const isUser = message.role.toLowerCase() === role.toLowerCase();
  // console.log("user:"+role+"\nmessage_role:"+message.role)
  const timeString = new Date(message.sent_at || '').toLocaleString('en-IN', {
    year: 'numeric',    // "2026"
    month: 'short',     // "Jun"
    day: 'numeric',     // "10"
    hour: 'numeric',    // "12"
    minute: '2-digit',  // "39"
    hour12: true        // Use AM/PM layout
  }) || ''

  if (isUser) {
    return (
      <div className="flex justify-end group">
        <div className={cn('max-w-[80%] md:max-w-[75%]', isMobile && 'max-w-[90%]')}>
          <div className="bg-[#131b2e] dark:bg-[#1e2a4a] border border-[rgba(198,198,205,0.2)] rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr-sm px-6 py-4 shadow-sm">
            <p className="text-[#7c839b] dark:text-[#8892b0] text-sm leading-relaxed">{message.content.text}</p>
          </div>
          <p className="text-right text-[11px] text-[#45464d] dark:text-[#9aa3bf] mt-1 pr-1">{timeString}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 md:gap-4 items-start">
      {
        OtherAvatar
      }
      <div className={cn('flex-1 min-w-0', isMobile ? 'max-w-[90%]' : 'max-w-[85%]')}>
        {isMobile && (
          <p className="text-xs text-[#45464d] dark:text-[#9aa3bf] mb-1.5 font-medium">Nexus AI</p>
        )}
        <div className="relative bg-white dark:bg-[#1a2236] border border-[#c6c6cd] dark:border-[#2e3347] rounded-bl-2xl rounded-br-2xl rounded-tl-sm rounded-tr-2xl shadow-sm border-l-4 border-l-[#2170e4] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white/40 to-transparent" />
          <div className="px-6 py-4">
            <p className="text-[#191c1e] dark:text-[#e2e4ef] text-sm leading-relaxed whitespace-pre-wrap">{message.content.text}</p>

            {message.content.bullet_list && (
              <ul className="mt-3 space-y-1.5">
                {message.content.bullet_list.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#45464d] dark:text-[#9aa3bf] leading-relaxed">
                    <span className="text-[#0058be] mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul> 
            )}
             

             
            {message.content.tracking && <TrackIDBlock trackingID={message.content.tracking?.trackingID} carrier={message.content.tracking?.carrier} />}
{/*

            {message.widget?.type === 'tracking' && <TrackingWidgetCard widget={message.widget} />}
*/}
            {message.content.order_cards && (message.content.order_cards.map(
              order =>
              <OrderCard
                orderId={order.order_id}
                productName={order.product_name}
                status={order.status}
              />
            )
            )} 
            {message.content.order_card && (message.content.order_card.map(
              order =>
              <OrderCard
                orderId={order.order_id}
                productName={order.product_name}
                status={order.status}
              />
            )
            )}
          </div>
        </div>

        {/* {message.suggestedActions && <SuggestedActions actions={message.suggestedActions} />} */}

        <p className="text-[11px] text-[#45464d] dark:text-[#9aa3bf] mt-1.5 pl-1">{timeString}</p>
      </div>
    </div>
  );
}

// ─── AI Typing Row ────────────────────────────────────────────────────────────
export function AITypingRow({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className="flex gap-3 md:gap-4 items-start opacity-70">
      <AIAvatar size={isMobile ? 'sm' : 'md'} />
      <div className="bg-[#eceef0] dark:bg-[#1e2535] border border-[#c6c6cd] dark:border-[#2e3347] rounded-bl-2xl rounded-br-2xl rounded-tl-sm rounded-tr-2xl">
        <TypingIndicator />
      </div>
    </div>
  );
}

export function UserTypingRow({ OtherAvatar}: { OtherAvatar:JSX.Element }) {
  return (
    <div className="flex gap-3 md:gap-4 items-start opacity-70">
      {
        OtherAvatar
      }
      <div className="bg-[#eceef0] dark:bg-[#1e2535] border border-[#c6c6cd] dark:border-[#2e3347] rounded-bl-2xl rounded-br-2xl rounded-tl-sm rounded-tr-2xl">
        <TypingIndicator />
      </div>
    </div>
  );
}