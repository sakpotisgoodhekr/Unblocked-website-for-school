/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { GamesView } from './components/GamesView';
import { GamePlayerModal } from './components/GamePlayerModal';
import { SettingsModal } from './components/SettingsModal';
import { ShootingStarsCanvas } from './components/ShootingStarsCanvas';
import { TiltButton } from './components/TiltButton';
import { MediaViewerModal } from './components/MediaViewerModal';
import { FpsCounter } from './components/FpsCounter';
import { THEME_CONFIGS, DEFAULT_SETTINGS } from './constants';

const RANDOM_TIPS = [
  "Mason H is that you?",
  "Ik Zander is here",
  "Money Spread",
  "Scool sux",
  "was that rushing or dragging",
  "GEODASH REFERENCE",
];

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeMediaPlatform, setActiveMediaPlatform] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Initial Fullsite Loading Screen (Fixes blank page on GitHub Pages)
  const [appLoading, setAppLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(20);
  const [loadStatus, setLoadStatus] = useState('Initializing unblocked portal...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Randomized tip every time you refresh or open the website
  const [randomTip] = useState(() => {
    return RANDOM_TIPS[Math.floor(Math.random() * RANDOM_TIPS.length)];
  });

  // Load persistent favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('protis_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load persistent settings
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('protis_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Automated loading sequence
  useEffect(() => {
    const t1 = setTimeout(() => {
      setLoadPercent(45);
      setLoadStatus('Optimizing Chromebook 60 FPS Engine...');
    }, 150);

    const t2 = setTimeout(() => {
      setLoadPercent(80);
      setLoadStatus('Configuring Stealth Themes & Starfield...');
    }, 350);

    const t3 = setTimeout(() => {
      setLoadPercent(100);
      setLoadStatus('Ready!');
    }, 600);

    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 750);

    const t5 = setTimeout(() => {
      setAppLoading(false);
    }, 1050);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Dynamic fetch of games from iframe JSON database (with GitHub Pages relative path resolution)
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const base = import.meta.env.BASE_URL || './';
    const primaryUrl = `${base.endsWith('/') ? base : base + '/'}games.json`;

    fetch(primaryUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Path fallback');
        return res.json();
      })
      .catch(() => {
        return fetch('./games.json')
          .then((res) => res.json())
          .catch(() => fetch('/games.json').then((res) => res.json()));
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setGames(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Empty or pending games database:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('protis_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
  }, [favorites]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('protis_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings:', e);
    }
  }, [settings]);

  // Get current active theme config
  const themeConfig = useMemo(() => {
    return THEME_CONFIGS[settings.cloakPreset] || THEME_CONFIGS.protis;
  }, [settings.cloakPreset]);

  // Apply dark/light mode class and dynamic background color to html/body
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    const activeBgColor = settings.darkMode ? themeConfig.darkBg : themeConfig.lightBg;
    document.body.style.backgroundColor = activeBgColor;
  }, [settings.darkMode, themeConfig]);

  // Apply Tab Cloak Title & Favicon Disguise
  useEffect(() => {
    document.title = themeConfig.title;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = themeConfig.favicon;
  }, [themeConfig]);

  // Panic Key Quick Escape Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === settings.panicKey) {
        if (selectedGame) setSelectedGame(null);
        if (activeMediaPlatform) setActiveMediaPlatform(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey, selectedGame, activeMediaPlatform]);

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleFavorite = (gameId) => {
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset your saved favorites and scores?')) {
      localStorage.clear();
      setFavorites([]);
      setSettings(DEFAULT_SETTINGS);
      alert('Data reset successfully.');
    }
  };

  const activeBgColor = settings.darkMode ? themeConfig.darkBg : themeConfig.lightBg;

  return (
    <div
      className={`min-h-screen w-full relative transition-colors duration-300 ${
        settings.darkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
      style={{ backgroundColor: activeBgColor }}
    >
      {/* Interactive App Loading Screen at the start */}
      {appLoading && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#060913] transition-opacity duration-300 ${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Ambient Glow */}
          <div className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 bg-cyan-500" />

          <div className="relative z-10 w-full max-w-sm rounded-3xl p-8 glass-panel shadow-2xl text-center border border-white/10 flex flex-col items-center">
            {/* Wordmark */}
            <h1 className="font-sans text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 select-none mb-2">
              Protis
            </h1>

            <p className="text-xs text-slate-400 font-medium mb-6">
              {loadStatus}
            </p>

            {/* Loading Bar with Skip Button Next to It */}
            <div className="flex items-center gap-3 w-full my-3">
              <div className="flex-1 h-3 bg-slate-800/80 rounded-full overflow-hidden border border-white/10 relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out shadow-sm shadow-cyan-500/50"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>

              {/* Skip Button next to the loading bar */}
              <TiltButton
                onClick={() => setAppLoading(false)}
                className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-slate-800/90 hover:bg-slate-700 border border-white/10 shadow-sm shrink-0 cursor-pointer transition-colors"
                title="Skip loading screen"
                scale={1.12}
                maxTilt={20}
              >
                Skip ➔
              </TiltButton>
            </div>

            <div className="flex items-center justify-between w-full text-[11px] text-slate-500 font-mono mb-4">
              <span>UNBLOCKED HUB</span>
              <span className="text-cyan-400 font-bold">{loadPercent}%</span>
            </div>

            {/* Loading Screen Tip Text (Randomized Every Refresh) */}
            <div className="w-full p-2.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Tip</div>
              <div className="text-xs text-cyan-300 font-medium">"{randomTip}"</div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Shooting Stars Canvas Background with Theme Colors */}
      <ShootingStarsCanvas
        darkMode={settings.darkMode}
        themeConfig={themeConfig}
        enabled={settings.starsEnabled}
        starsEnabled={settings.starsEnabled}
        shootingStarsEnabled={settings.shootingStarsEnabled !== false}
        density={settings.starDensity}
        batterySaver={settings.batterySaver}
      />

      {/* Minimalist Sidebar with expanding 3D icon-only buttons: Home, Games, Favorites, Settings */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={settings.darkMode}
        favoritesCount={favorites.length}
        themeAccent={themeConfig.accent}
      />

      {/* Real-Time Persistent FPS Counter in Top Right at all times */}
      <FpsCounter darkMode={settings.darkMode} themeAccent={themeConfig.accent} />

      {/* Main Content Area */}
      <main className="md:pl-22 pb-24 md:pb-8 transition-all duration-300 min-h-screen flex flex-col justify-between">
        {/* Top Minimalist Brand Header */}
        <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`font-sans text-xl font-black tracking-tight cursor-pointer select-none transition-all duration-200 transform hover:scale-105 ${
              settings.darkMode
                ? 'text-white hover:text-cyan-400'
                : 'text-slate-900 hover:text-cyan-600'
            }`}
          >
            Protis
          </button>

          {/* Quick status & Theme Active Pill (spaced to accommodate top-right FPS counter) */}
          <div className="flex items-center gap-3 pr-24 sm:pr-28">
            {settings.cloakPreset !== 'protis' && (
              <span
                className="text-xs px-3 py-1 rounded-full font-bold text-white shadow-xs"
                style={{ backgroundColor: themeConfig.accent }}
              >
                {themeConfig.name}
              </span>
            )}

            <span
              className={`text-xs hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                settings.darkMode
                  ? 'bg-slate-800/80 text-slate-300 border border-white/5'
                  : 'bg-white/80 text-slate-700 border border-slate-200 shadow-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Chromebook 60 FPS</span>
            </span>
          </div>
        </header>

        {/* View Routing */}
        <div className="flex-1 flex flex-col justify-center">
          {activeTab === 'home' && (
            <HomeView
              games={games}
              onSelectGame={(g) => setSelectedGame(g)}
              onExploreGames={() => setActiveTab('games')}
              darkMode={settings.darkMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenMedia={(arg) => {
                if (typeof arg === 'string' && arg !== 'youtube') {
                  setActiveVideoId(arg);
                } else {
                  setActiveVideoId(null);
                }
                setActiveMediaPlatform('youtube');
              }}
              themeAccent={themeConfig.accent}
            />
          )}

          {(activeTab === 'games' || activeTab === 'favorites') && (
            <GamesView
              games={games}
              loading={loading}
              isFavoritesMode={activeTab === 'favorites'}
              onSwitchToGames={() => setActiveTab('games')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectGame={(g) => setSelectedGame(g)}
              darkMode={settings.darkMode}
              themeAccent={themeConfig.accent}
            />
          )}
        </div>

        {/* Quiet Footer */}
        <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-500">
          <span>protis · Minimalist Unblocked Games Portal · Clean Glass UI</span>
        </footer>
      </main>

      {/* Settings Modal */}
      {activeTab === 'settings' && (
        <SettingsModal
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setActiveTab('home')}
          onResetData={handleResetData}
          themeConfig={themeConfig}
        />
      )}

      {/* YouTube Video Library Modal (Replaced TikTok and Twitch) */}
      {activeMediaPlatform && (
        <MediaViewerModal
          onClose={() => {
            setActiveMediaPlatform(null);
            setActiveVideoId(null);
          }}
          darkMode={settings.darkMode}
          themeAccent={themeConfig.accent}
          initialVideoId={activeVideoId}
        />
      )}

      {/* Responsive Sandboxed Iframe Game Player Modal */}
      {selectedGame && (
        <GamePlayerModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          darkMode={settings.darkMode}
          isFavorite={favorites.includes(selectedGame.id)}
          onToggleFavorite={handleToggleFavorite}
          themeAccent={themeConfig.accent}
        />
      )}
    </div>
  );
}
