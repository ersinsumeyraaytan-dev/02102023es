import React from 'react';
import { Heart, Clock, MapPin, Sun, Moon } from 'lucide-react';

export type NavTab = 'home' | 'memories' | 'locations';

interface HeaderNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Ana Sayfa', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'memories', label: 'Anılar', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'locations', label: 'Konumlar', icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#12080d]/85 border-rose-950/70 text-rose-100'
          : 'bg-white/85 border-rose-100/70 text-stone-900'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand Wordmark: Strictly "E ❤️ S" */}
        <button
          onClick={() => onTabChange('home')}
          className="text-left font-serif-romantic text-xl font-bold tracking-wider hover:opacity-85 transition-opacity flex items-center gap-1.5"
        >
          <span>E</span>
          <span className="text-rose-500 animate-pulse">❤️</span>
          <span>S</span>
        </button>

        {/* 3 Clean Navigation Tabs */}
        <nav
          className={`flex items-center gap-1 p-1 rounded-full border text-xs font-medium font-sans-clean transition-colors ${
            isDark
              ? 'bg-[#1e0e16]/80 border-rose-900/40'
              : 'bg-stone-100/70 border-stone-200/50'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs'
                    : isDark
                    ? 'text-rose-200/70 hover:text-white hover:bg-rose-950/50'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action: Light / Dark Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
          className={`p-2 rounded-full border transition-all duration-200 ${
            isDark
              ? 'bg-[#200e18] border-rose-900/50 text-amber-300 hover:bg-rose-900/30'
              : 'bg-rose-50/80 border-rose-200/70 text-rose-600 hover:bg-rose-100'
          }`}
          title={isDark ? 'Aydınlık Mod' : 'Karanlık Mod (Romantik Gece)'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
};
