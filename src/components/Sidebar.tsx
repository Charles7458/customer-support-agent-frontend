import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

function ChatIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M18 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3v3l4-3h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"
        stroke={active ? '#fff' : '#45464d'}
        strokeWidth="1.5"
        fill="none"
        className="dark:stroke-current"
      />
    </svg>
  );
}

function TicketIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <path
        d="M0 2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V2Z"
        stroke={active ? '#fff' : '#45464d'}
        strokeWidth="1.5"
        fill="none"
        className="dark:stroke-current"
      />
    </svg>
  );
}

export function SupportChatIcon({active}: { active?: boolean}) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Chat bubble base */}
      <path d="M2 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8H6l-3 2v-2H4c-1.1 0-2-.9-2-2V10z" />
      
      {/* Left headphone ear cup */}
      <circle cx="6" cy="10" r="1.5" fill="currentColor" />
      
      {/* Right headphone ear cup */}
      <circle cx="14" cy="10" r="1.5" fill="currentColor" />
      
      {/* Headphone band */}
      <path d="M6 8.5c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" />
    </svg>
  );
}


function NexusLogo() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path d="M10 0L20 18H0L10 0Z" fill="#fff" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const supportChat = sessionStorage.getItem("last_support_chat")

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white dark:bg-[#111827] border-r border-[#c6c6cd] dark:border-[#1e2535] flex flex-col z-40 transition-colors duration-300">
      {/* Brand */}
      <div className="px-6 pt-6 pb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#131b2e] rounded-lg flex items-center justify-center shrink-0">
            <NexusLogo />
          </div>
          <div>
            <p className="text-[18px] font-black text-[#0d1117] dark:text-white leading-tight tracking-tight">Nexus AI</p>
            <p className="text-sm text-[#45464d] dark:text-[#9aa3bf]">Support Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-6 flex flex-col gap-2">
        <NavLink
          to="/conversations"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2 rounded-lg text-[16px] transition-colors duration-150 ${
              isActive
                ? 'bg-[#2170e4] text-white'
                : 'text-[#45464d] dark:text-[#9aa3bf] hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ChatIcon active={isActive} />
              <span className={isActive ? 'text-white' : ''}>AI Chat</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2 rounded-lg text-[16px] transition-colors duration-150 ${
              isActive
                ? 'bg-[#2170e4] text-white'
                : 'text-[#45464d] dark:text-[#9aa3bf] hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <TicketIcon active={isActive} />
              <span className={isActive ? 'text-white' : ''}>Tickets</span>
            </>
          )}
        </NavLink>

        {/* Support Chat */}

        {
          supportChat &&
          <NavLink
            to={supportChat}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-lg text-[16px] transition-colors duration-150 ${
                isActive
                  ? 'bg-[#2170e4] text-white'
                  : 'text-[#45464d] dark:text-[#9aa3bf] hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <SupportChatIcon active={isActive} />
                <span className={isActive ? 'text-white' : ''}>Support Chat</span>
              </>
            )}
          </NavLink>
        }

      </nav>

      {/* Theme toggle */}
      <div className="px-6 pb-6">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-[#45464d] dark:text-[#9aa3bf] hover:bg-[#f7f9fb] dark:hover:bg-[#1e2535] transition-colors text-sm"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>
      </div>
    </aside>
  );
}
