import React from 'react';
import {
  Home,
  Gamepad2,
  Heart,
  Settings,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  darkMode,
  favoritesCount = 0,
  themeAccent = '#06b6d4',
}) => {
  const getButtonClass = (isActive) => {
    const base = 'w-11 h-11 rounded-2xl cursor-pointer relative';

    if (isActive) {
      return `${base} text-white shadow-lg shadow-cyan-500/30`;
    }

    return `${base} ${
      darkMode
        ? 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700/80 hover:shadow-lg hover:shadow-cyan-500/15 border border-white/10'
        : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-md hover:shadow-slate-400/25 border border-slate-200'
    }`;
  };

  return (
    <>
      {/* Desktop & Laptop Vertical Floating Glass Sidebar: Home, Games, Favorites, Settings ONLY */}
      <aside
        className={`hidden md:flex flex-col items-center justify-between fixed left-5 top-1/2 -translate-y-1/2 z-40 py-5 px-3 rounded-3xl glass-panel shadow-2xl transition-all duration-300 ${
          darkMode ? 'border-white/10' : 'border-slate-300/40'
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Navigation Group: Home, Games, Favorites */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Home Button */}
          <TiltButton
            onClick={() => setActiveTab('home')}
            className={getButtonClass(activeTab === 'home')}
            style={activeTab === 'home' ? { backgroundColor: themeAccent } : {}}
            title="Home"
            ariaLabel="Home"
            scale={1.14}
            maxTilt={20}
          >
            <Home size={20} />
          </TiltButton>

          {/* Games Button */}
          <TiltButton
            onClick={() => setActiveTab('games')}
            className={getButtonClass(activeTab === 'games')}
            style={activeTab === 'games' ? { backgroundColor: themeAccent } : {}}
            title="Games"
            ariaLabel="Games"
            scale={1.14}
            maxTilt={20}
          >
            <Gamepad2 size={20} />
          </TiltButton>

          {/* Favorites Button */}
          <TiltButton
            onClick={() => setActiveTab('favorites')}
            className={getButtonClass(activeTab === 'favorites')}
            style={activeTab === 'favorites' ? { backgroundColor: themeAccent } : {}}
            title="Favorites"
            ariaLabel="Favorites"
            scale={1.14}
            maxTilt={20}
          >
            <Heart size={20} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
            )}
          </TiltButton>
        </div>

        {/* Divider */}
        <div
          className={`w-6 h-px my-4 ${
            darkMode ? 'bg-white/10' : 'bg-slate-300/60'
          }`}
        />

        {/* Settings Button */}
        <div className="flex flex-col items-center gap-2">
          <TiltButton
            onClick={() => setActiveTab('settings')}
            className={getButtonClass(activeTab === 'settings')}
            style={activeTab === 'settings' ? { backgroundColor: themeAccent } : {}}
            title="Settings"
            ariaLabel="Settings"
            scale={1.14}
            maxTilt={20}
          >
            <Settings size={20} />
          </TiltButton>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar with exact same 4 tabs: Home, Games, Favorites, Settings */}
      <nav
        className={`flex md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full glass-panel shadow-2xl items-center gap-3 transition-all duration-300 ${
          darkMode ? 'border-white/15' : 'border-slate-300/60'
        }`}
        aria-label="Mobile Navigation"
      >
        <TiltButton
          onClick={() => setActiveTab('home')}
          className={getButtonClass(activeTab === 'home')}
          style={activeTab === 'home' ? { backgroundColor: themeAccent } : {}}
          title="Home"
          ariaLabel="Home"
          scale={1.12}
        >
          <Home size={19} />
        </TiltButton>

        <TiltButton
          onClick={() => setActiveTab('games')}
          className={getButtonClass(activeTab === 'games')}
          style={activeTab === 'games' ? { backgroundColor: themeAccent } : {}}
          title="Games"
          ariaLabel="Games"
          scale={1.12}
        >
          <Gamepad2 size={19} />
        </TiltButton>

        <TiltButton
          onClick={() => setActiveTab('favorites')}
          className={getButtonClass(activeTab === 'favorites')}
          style={activeTab === 'favorites' ? { backgroundColor: themeAccent } : {}}
          title="Favorites"
          ariaLabel="Favorites"
          scale={1.12}
        >
          <Heart size={19} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
          )}
        </TiltButton>

        <TiltButton
          onClick={() => setActiveTab('settings')}
          className={getButtonClass(activeTab === 'settings')}
          style={activeTab === 'settings' ? { backgroundColor: themeAccent } : {}}
          title="Settings"
          ariaLabel="Settings"
          scale={1.12}
        >
          <Settings size={19} />
        </TiltButton>
      </nav>
    </>
  );
};
