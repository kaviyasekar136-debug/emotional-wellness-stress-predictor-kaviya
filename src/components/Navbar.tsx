import React, { useState } from 'react';
import { Sparkles, ShieldAlert, User, Menu, X } from 'lucide-react';
import { UserProfile } from '../types/wellness';

export type NavTab = 'dashboard' | 'checkin' | 'relaxation' | 'charts' | 'history';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenCrisis: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  user,
  onOpenAuth,
  onOpenCrisis,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ id: NavTab; label: string }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'checkin', label: 'Predictor Check-in' },
    { id: 'relaxation', label: 'Relaxation Hub' },
    { id: 'charts', label: 'Trends & Charts' },
    { id: 'history', label: 'History & Report' },
  ];

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/80 shadow-2xs">
      {/* Top Bar Container complying with 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left text-slate-900 group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Serene<span className="text-purple-600">AI</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 hidden sm:inline -mt-0.5">
              Emotional Wellness &amp; Stress Predictor
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line clean text links with hover underline */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  isActive
                    ? 'text-purple-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action / Profile Button & Crisis helper */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Crisis hotline trigger */}
          <button
            type="button"
            onClick={onOpenCrisis}
            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors"
            title="Emergency Mental Health & Crisis Helplines"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* User profile action */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-purple-200/80 bg-purple-50/60 hover:bg-purple-100/70 transition-all text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-purple-300"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="hidden sm:inline max-w-[110px] truncate">{user.name}</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  isActive ? 'bg-purple-100/70 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
