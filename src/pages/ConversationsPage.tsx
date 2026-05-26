import { useState, useRef, useEffect, useContext } from 'react';
import { MessageBubble, AITypingRow, SecurityBanner } from '../components/ChatMessage';
import { Sidebar } from '../components/Sidebar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import type { ChatMessage } from '../types';
import { Avatar } from '../components/ui';
import { mockConversations } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';

function BellIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1a6 6 0 0 1 6 6v3l2 2H0l2-2V7a6 6 0 0 1 6-6ZM6 17a2 2 0 0 0 4 0" />
    </svg>
  );
}
// function PersonIcon() {
//   return (
//     <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
//       <circle cx="9" cy="6" r="4" />
//       <path d="M1 18c0-4.4 3.6-8 8-8s8 3.6 8 8" />
//     </svg>
//   );
// }
function SendIcon() {
  return (
    <svg width="19" height="16" viewBox="0 0 19 16" fill="white">
      <path d="M0.5 0.5L18.5 8L0.5 15.5V10L13 8L0.5 6V0.5Z" />
    </svg>
  );
}
function AttachIcon() {
  return (
    <svg width="12.5" height="20" viewBox="0 0 12.5 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 7v8a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v8a1 1 0 0 1-2 0V6" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg width="14" height="19" viewBox="0 0 14 19" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="1" width="6" height="10" rx="3" />
      <path d="M1 9a6 6 0 0 0 12 0M7 16v3" />
    </svg>
  );
}

export default function ConversationsPage() {
  const conv = mockConversations[0];
  const [messages, setMessages] = useState<ChatMessage[]>(conv.messages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const authContext = useAuth();
  const user = authContext.user;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        content: "I've received your message and I'm looking into it right now. Our team will ensure your issue is resolved as quickly as possible.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-[#f7f9fb] dark:bg-[#0d1117] transition-colors duration-300">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-[280px] flex flex-col min-h-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-[#c6c6cd] dark:border-[#1e2535] h-16 flex items-center justify-between px-6 shadow-sm shrink-0">
          {/* Mobile: Hamburger + title */}
          <div className="flex flex-col md:hidden">
            <p className="font-bold text-[#0d1117] dark:text-white text-base">Nexus AI</p>
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-base font-medium text-[#191c1e] dark:text-white">{conv.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#0058be] shadow-[0_0_8px_rgba(0,88,190,0.6)]" />
              <span className="text-xs text-[#45464d] dark:text-[#9aa3bf]">AI Online</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#45464d] dark:text-[#9aa3bf]">
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535] transition-colors"><BellIcon /></button>
            <NavLink to="/profile">
              <Avatar initials={user?.fullName.charAt(0) || "U"} />
            </NavLink>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[960px] mx-auto px-4 md:px-12 py-8 space-y-8">
            <SecurityBanner />
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <AITypingRow />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-white dark:bg-[#111827] border-t border-[#c6c6cd] dark:border-[#1e2535] px-6 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-5 mb-[69px] md:mb-0">
          <div className="max-w-[896px] mx-auto">
            <div className="flex items-end gap-2 bg-[#f7f9fb] dark:bg-[#1a2236] border border-[#c6c6cd] dark:border-[#2e3347] rounded-xl p-1 shadow-sm focus-within:border-[#2170e4] focus-within:ring-2 focus-within:ring-[#2170e4]/20 transition-all">
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#45464d] dark:text-[#9aa3bf] hover:bg-[#eceef0] dark:hover:bg-[#252c3d] transition-colors shrink-0 mb-1 ml-1">
                <AttachIcon />
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message"
                rows={1}
                className="flex-1 bg-transparent text-[#191c1e] dark:text-[#e2e4ef] text-sm placeholder:text-[#45464d] dark:placeholder:text-[#4a5068] resize-none outline-none py-3 px-2 max-h-[150px] leading-relaxed"
                style={{ minHeight: '44px' }}
              />
              <div className="flex items-center gap-1 mb-1 mr-1 shrink-0">
                <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#45464d] dark:text-[#9aa3bf] hover:bg-[#eceef0] dark:hover:bg-[#252c3d] transition-colors">
                  <MicIcon />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-lg bg-[#0058be] hover:bg-[#004ca1] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow transition-all"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            <p className="text-center text-[11px] text-[#45464d] dark:text-[#4a5068] mt-2">AI can make mistakes. Verify important information.</p>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
