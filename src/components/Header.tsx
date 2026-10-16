import React from 'react';
import { UserSession } from '../types/cyber';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: UserSession;
  onOpenSubmissionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  session,
  onOpenSubmissionModal,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'auth', label: 'Authentication' },
    { id: 'validation', label: 'Input Validation' },
    { id: 'security', label: 'Security Checks' },
    { id: 'logging', label: 'SIEM Logs' },
    { id: 'awareness', label: 'Awareness' },
    { id: 'github', label: 'GitHub & Submission' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single-element Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap text-left"
        >
          NetGuard <span className="text-xs font-normal text-slate-400 ml-1">v1.2 · Security Ops</span>
        </button>
      </div>

      {/* Zone 2: Single-line navigation links with subtle underline/highlight */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 Primary Action (with session role indicator) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-slate-500">ROLE:</span>
          <span className="text-emerald-400 font-semibold uppercase">{session.role}</span>
        </div>
        <button
          onClick={onOpenSubmissionModal}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          Export PDF & GitHub Kit
        </button>
      </div>
    </header>
  );
};
