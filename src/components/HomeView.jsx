import React from 'react';
import {
  Gamepad2,
  Search,
  Zap,
  Rocket,
  Boxes,
  Activity,
  Trophy,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

export const HomeView = ({
  games = [],
  onSelectGame,
  onExploreGames,
  onSelectCategory,
  darkMode,
  searchQuery,
  setSearchQuery,
  themeAccent = '#06b6d4',
}) => {
  // Featured games on home view
  const popularGames = games.slice(0, 8);

  const handleRandomPlay = () => {
    if (games.length === 0) return;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    onSelectGame(randomGame);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Central Glass Showcase with "protis" in the middle */}
      <div
        className={`w-full max-w-2xl rounded-3xl p-8 md:p-12 text-center glass-panel shadow-2xl relative overflow-hidden transition-all duration-300 ${
          darkMode ? 'border-white/10' : 'border-slate-300/50'
        }`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: themeAccent }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: themeAccent }}
        />

        {/* PROTIS Title in Sans Font in the Middle */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full ${
                darkMode
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
              }`}
              style={{ borderColor: `${themeAccent}40`, color: themeAccent }}
            >
              Unblocked Gaming Hub
            </span>
          </div>

          <h1
            className={`font-sans text-6xl md:text-7xl lg:text-8xl font-black tracking-tight select-none ${
              darkMode
                ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-sm'
                : 'text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600'
            }`}
          >
            protis
          </h1>

          <p
            className={`mt-4 text-sm md:text-base max-w-md mx-auto ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Minimalist, high-performance unblocked games crafted for Chromebooks.
            Zero lag, instantaneous iframe loading, and pure play.
          </p>

          {/* Quick Search Bar */}
          <div className="w-full max-w-md mt-6 relative">
            <Search
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onExploreGames();
                }
              }}
              placeholder="Search unblocked games... (press Enter)"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm transition-all focus:outline-none ${
                darkMode
                  ? 'bg-slate-900/60 text-white placeholder-slate-500 border border-white/10 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-white/80 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
              }`}
            />
          </div>

          {/* Action Row with 3D Tilt Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-6">
            <TiltButton
              onClick={onExploreGames}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md shadow-cyan-500/20"
              style={{ backgroundColor: themeAccent }}
              scale={1.08}
            >
              <Gamepad2 size={18} />
              <span>Explore All Games</span>
              <ArrowRight size={16} />
            </TiltButton>

            <TiltButton
              onClick={handleRandomPlay}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border ${
                darkMode
                  ? 'bg-slate-800/60 text-slate-200 border-white/10'
                  : 'bg-white/70 text-slate-800 border-slate-300/70 shadow-xs'
              }`}
              scale={1.08}
            >
              <Sparkles size={17} className="text-amber-400" />
              <span>Random Game</span>
            </TiltButton>
          </div>

          {/* Chromebook Highlights Bar */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Cpu size={14} className="text-cyan-400" />
              <span>60 FPS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>100% Unblocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-rose-400" />
              <span>No Install</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Games Section or Ready State */}
      <div className="w-full max-w-4xl mt-12">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-rose-500" />
            <h2
              className={`text-base font-bold tracking-tight ${
                darkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              Featured & Popular
            </h2>
          </div>
          {games.length > 0 && (
            <button
              type="button"
              onClick={onExploreGames}
              className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
              }`}
            >
              <span>View All ({games.length})</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {games.length === 0 ? (
          <div
            className={`p-8 rounded-3xl glass-card text-center ${
              darkMode ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            <Gamepad2
              size={36}
              className="mx-auto mb-3 text-cyan-400"
            />
            <h3
              className={`text-base font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Library Ready for Your Custom Games
            </h3>
            <p
              className={`text-xs mt-1 max-w-md mx-auto ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              All previous games have been cleared. Tell me which games or iframe links you'd like to add, and they'll appear here immediately!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularGames.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className={`group p-4 rounded-2xl glass-card transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${
                  darkMode
                    ? 'hover:border-cyan-500/40 hover:shadow-cyan-500/10'
                    : 'hover:border-cyan-500/30 hover:shadow-slate-400/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                    style={{ backgroundColor: game.color }}
                  >
                    <Gamepad2 size={20} />
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ★ {game.rating}
                  </span>
                </div>

                <h3
                  className={`text-sm font-bold truncate ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {game.title}
                </h3>
                <p
                  className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {game.description}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] text-slate-500">{game.plays} plays</span>
                  <span
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      darkMode ? 'text-cyan-400' : 'text-cyan-600'
                    }`}
                  >
                    Play
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Category Jump Bar */}
      <div className="w-full max-w-2xl mt-10 text-center">
        <p className={`text-xs mb-3 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Quick Categories
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            { id: 'action', label: 'Action', icon: Zap },
            { id: 'arcade', label: 'Arcade', icon: Rocket },
            { id: 'puzzle', label: 'Puzzle', icon: Boxes },
            { id: 'retro', label: 'Retro', icon: Activity },
            { id: 'sports', label: 'Sports', icon: Trophy },
            { id: 'casual', label: 'Casual', icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <TiltButton
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium ${
                  darkMode
                    ? 'bg-slate-800/60 text-slate-300 border border-white/5'
                    : 'bg-white/70 text-slate-700 border border-slate-200/60 shadow-xs'
                }`}
                scale={1.08}
              >
                <Icon size={14} className="text-cyan-400" />
                <span>{cat.label}</span>
              </TiltButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};
