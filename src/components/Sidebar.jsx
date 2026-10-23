import React from 'react';
import {
  Home,
  Gamepad2,
  Settings,
  LayoutGrid,
  Zap,
  Rocket,
  Boxes,
  Activity,
  Trophy,
  Sparkles,
  Heart,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

const CATEGORY_ICONS = [
  { id: 'all', icon: LayoutGrid, label: 'All Games' },
  { id: 'action', icon: Zap, label: 'Action' },
  { id: 'arcade', icon: Rocket, label: 'Arcade' },
  { id: 'puzzle', icon: Boxes, label: 'Puzzle' },
  { id: 'retro', icon: Activity, label: 'Retro' },
  { id: 'sports', icon: Trophy, label: 'Sports' },
  { id: 'casual', icon: Sparkles, label: 'Casual' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
];

export const Sidebar = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  darkMode,
  favoritesCount = 0,
  themeAccent = '#06b6d4',
}) => {
  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (activeTab !== 'games') {
      setActiveTab('games');
    }
  };

  const getButtonClass = (isActive) => {
    const base = 'w-11 h-11 rounded-2xl cursor-pointer';

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
      {/* Desktop & Laptop Vertical Floating Glass Sidebar */}
      <aside
        className={`hidden md:flex flex-col items-center justify-between fixed left-5 top-1/2 -translate-y-1/2 z-40 py-5 px-3 rounded-3xl glass-panel shadow-2xl transition-all duration-300 ${
          darkMode ? 'border-white/10' : 'border-slate-300/40'
        }`}
        style={{ maxHeight: '90vh' }}
        aria-label="Sidebar Navigation"
      >
        {/* Top: Home & Games Icon Buttons */}
        <div className="flex flex-col items-center gap-3 w-full">
          <TiltButton
            onClick={() => handleNavClick('home')}
            className={getButtonClass(activeTab === 'home')}
            style={activeTab === 'home' ? { backgroundColor: themeAccent } : {}}
            title="Home"
            ariaLabel="Home"
            scale={1.14}
            maxTilt={20}
          >
            <Home size={20} />
          </TiltButton>

          <TiltButton
            onClick={() => handleNavClick('games')}
            className={getButtonClass(activeTab === 'games')}
            style={activeTab === 'games' ? { backgroundColor: themeAccent } : {}}
            title="Games"
            ariaLabel="Games"
            scale={1.14}
            maxTilt={20}
          >
            <Gamepad2 size={20} />
          </TiltButton>
        </div>

        {/* Divider */}
        <div
          className={`w-6 h-px my-3.5 ${
            darkMode ? 'bg-white/10' : 'bg-slate-300/60'
          }`}
        />

        {/* Middle: Game Categories (All Icon-Only, 3D Tilt on Hover) */}
        <div className="flex flex-col items-center gap-2.5 overflow-y-auto no-scrollbar py-1">
          {CATEGORY_ICONS.map((cat) => {
            const Icon = cat.icon;
            const isCatActive = activeTab === 'games' && selectedCategory === cat.id;

            return (
              <TiltButton
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={getButtonClass(isCatActive)}
                style={isCatActive ? { backgroundColor: themeAccent } : {}}
                title={cat.label}
                ariaLabel={cat.label}
                scale={1.14}
                maxTilt={20}
              >
                <Icon size={19} />
                {cat.id === 'favorites' && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
                )}
              </TiltButton>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className={`w-6 h-px my-3.5 ${
            darkMode ? 'bg-white/10' : 'bg-slate-300/60'
          }`}
        />

        {/* Bottom: Settings Button */}
        <div className="flex flex-col items-center gap-2">
          <TiltButton
            onClick={() => handleNavClick('settings')}
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

      {/* Mobile Floating Bottom Bar with 3D Tilt Icon-Only Buttons */}
      <nav
        className={`flex md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full glass-panel shadow-2xl items-center gap-3 transition-all duration-300 ${
          darkMode ? 'border-white/15' : 'border-slate-300/60'
        }`}
        aria-label="Mobile Navigation"
      >
        <TiltButton
          onClick={() => handleNavClick('home')}
          className={getButtonClass(activeTab === 'home')}
          style={activeTab === 'home' ? { backgroundColor: themeAccent } : {}}
          title="Home"
          ariaLabel="Home"
          scale={1.12}
        >
          <Home size={19} />
        </TiltButton>

        <TiltButton
          onClick={() => handleNavClick('games')}
          className={getButtonClass(activeTab === 'games')}
          style={activeTab === 'games' ? { backgroundColor: themeAccent } : {}}
          title="Games"
          ariaLabel="Games"
          scale={1.12}
        >
          <Gamepad2 size={19} />
        </TiltButton>

        <TiltButton
          onClick={() => {
            setSelectedCategory(selectedCategory === 'all' ? 'action' : 'all');
            setActiveTab('games');
          }}
          className={getButtonClass(activeTab === 'games' && selectedCategory !== 'all')}
          style={activeTab === 'games' && selectedCategory !== 'all' ? { backgroundColor: themeAccent } : {}}
          title="Categories"
          ariaLabel="Categories"
          scale={1.12}
        >
          <LayoutGrid size={19} />
        </TiltButton>

        <TiltButton
          onClick={() => handleCategoryClick('favorites')}
          className={getButtonClass(activeTab === 'games' && selectedCategory === 'favorites')}
          style={activeTab === 'games' && selectedCategory === 'favorites' ? { backgroundColor: themeAccent } : {}}
          title="Favorites"
          ariaLabel="Favorites"
          scale={1.12}
        >
          <Heart size={19} />
        </TiltButton>

        <TiltButton
          onClick={() => handleNavClick('settings')}
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
