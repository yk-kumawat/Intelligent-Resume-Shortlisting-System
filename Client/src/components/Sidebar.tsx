import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: 'dashboard',  path: '/dashboard' },
  { label: 'Post a Job',   icon: 'edit_note',  path: '/post-job'  },
  { label: 'Applications', icon: 'group',      path: '/applications' },
  { label: 'Settings',     icon: 'settings',   path: '/settings'  },
];

const Sidebar: React.FC = () => {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface-container-low border-r border-outline-variant/10 py-8 px-5 h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-10 px-1">
        <div className="w-8 h-8 rounded-lg editorial-gradient flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary text-[16px]">hub</span>
        </div>
        <span className="font-headline font-semibold text-on-surface text-sm leading-tight">
          IRSS<br />
          <span className="text-on-surface-variant font-normal text-xs">HR Portal</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left w-full
                ${active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${active ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user badge */}
      <div className="mt-auto flex items-center gap-3 px-1 pt-6 border-t border-outline-variant/10">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0">
          HR
        </div>
        <div className="min-w-0">
          <p className="text-on-surface text-xs font-medium truncate">HR Manager</p>
          <p className="text-on-surface-variant text-[11px] truncate">admin@irss.io</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
