import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export function MobileBottomNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827] border-t border-[#c6c6cd] dark:border-[#1e2535] flex items-center z-40 h-[69px] md:hidden transition-colors">
      <NavLink
        to="/conversations"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center gap-1 py-2 ${isActive ? 'text-[#0058be] dark:text-[#4a9eff]' : 'text-[#45464d] dark:text-[#9aa3bf]'}`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[#e8f0fb] dark:bg-[#0058be]/20' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M18 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3v3l4-3h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-[11px] font-medium">Conversations</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/tickets"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center gap-1 py-2 ${isActive ? 'text-[#0058be] dark:text-[#4a9eff]' : 'text-[#45464d] dark:text-[#9aa3bf]'}`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[#e8f0fb] dark:bg-[#0058be]/20' : ''}`}>
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path
                  d="M0 2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-[11px] font-medium">Tickets</span>
          </>
        )}
      </NavLink>

      <button
        onClick={toggleTheme}
        className="flex-1 flex flex-col items-center gap-1 py-2 text-[#45464d] dark:text-[#9aa3bf]"
      >
        <div className="p-1.5 rounded-xl">
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
            </svg>
          )}
        </div>
        <span className="text-[11px] font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </nav>
  );
}
