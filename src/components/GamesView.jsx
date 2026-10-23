import React, { useMemo } from 'react';
import {
  Search,
  Heart,
  Play,
  Zap,
  Rocket,
  Boxes,
  Activity,
  Trophy,
  Sparkles,
  LayoutGrid,
  Gamepad2,
  Clock,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'action', label: 'Action', icon: Zap },
  { id: 'arcade', label: 'Arcade', icon: Rocket },
  { id: 'puzzle', label: 'Puzzle', icon: Boxes },
  { id: 'retro', label: 'Retro', icon: Activity },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'casual', label: 'Casual', icon: Sparkles },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

export const GamesView = ({
  games = [],
  loading = false,
  selectedCategory = 'all',
  setSelectedCategory,
  searchQuery = '',
  setSearchQuery,
  favorites = [],
  onToggleFavorite,
  onSelectGame,
  darkMode = true,
  themeAccent = '#06b6d4',
}) => {
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (game.category !== selectedCategory) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchDesc = game.description.toLowerCase().includes(q);
        const matchCat = game.category.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat;
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, favorites]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header bar with Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Game Library
          </h1>
          <p
            className={`text-xs md:text-sm mt-1 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Dynamically loaded from iframe database · Chromebook 60fps verified
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs md:text-sm transition-all focus:outline-none ${
              darkMode
                ? 'bg-slate-900/60 text-white placeholder-slate-500 border border-white/10 focus:border-cyan-500'
                : 'bg-white/80 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-cyan-500'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs with 3D Tilt */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-6">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.id;
          return (
            <TiltButton
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${
                isActive
                  ? 'text-white shadow-md'
                  : darkMode
                  ? 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
                  : 'bg-white/70 text-slate-600 hover:text-slate-900 border border-slate-200/60'
              }`}
              style={isActive ? { backgroundColor: themeAccent } : {}}
              scale={1.08}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.id === 'favorites' && favorites.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                  {favorites.length}
                </span>
              )}
            </TiltButton>
          );
        })}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl animate-pulse ${
                darkMode ? 'bg-slate-800/40 border border-white/5' : 'bg-slate-200/60 border border-slate-300'
              } h-56 flex flex-col justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-700/50" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-700/50 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-700/30 rounded-md w-1/2" />
                </div>
              </div>
              <div className="space-y-2 my-4">
                <div className="h-3 bg-slate-700/30 rounded-md w-full" />
                <div className="h-3 bg-slate-700/20 rounded-md w-4/5" />
              </div>
              <div className="h-9 bg-slate-700/40 rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredGames.length === 0 && (
        <div
          className={`text-center py-16 px-4 rounded-3xl glass-panel max-w-lg mx-auto ${
            darkMode ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <Gamepad2
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? 'text-slate-600' : 'text-slate-400'
            }`}
          />
          <h3
            className={`text-lg font-bold ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}
          >
            {games.length === 0 ? 'Library Ready' : 'No games found'}
          </h3>
          <p
            className={`text-xs mt-1.5 max-w-sm mx-auto leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {games.length === 0
              ? "All previous games have been cleared. I'm standing by—share the games or iframe links you want to add, and I'll build them right in!"
              : selectedCategory === 'favorites'
              ? 'You have not favorited any games yet. Click the heart icon on any game card to add it!'
              : `No games match "${searchQuery}".`}
          </p>
          {games.length > 0 && (
            <TiltButton
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-5 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm mx-auto"
              style={{ backgroundColor: themeAccent }}
            >
              Reset Filters
            </TiltButton>
          )}
        </div>
      )}

      {/* Game Cards Grid */}
      {!loading && filteredGames.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => {
            const isFav = favorites.includes(game.id);

            return (
              <div
                key={game.id}
                className={`group relative p-5 rounded-3xl glass-card flex flex-col justify-between transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl ${
                  darkMode
                    ? 'hover:border-cyan-500/40 hover:shadow-cyan-500/10'
                    : 'hover:border-cyan-500/30 hover:shadow-slate-400/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: game.color }}
                    >
                      <Gamepad2 size={24} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          darkMode
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {game.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(game.id);
                        }}
                        className={`p-1.5 rounded-xl transition-all duration-200 transform hover:scale-115 active:scale-95 cursor-pointer ${
                          isFav
                            ? 'text-rose-500 bg-rose-500/10'
                            : darkMode
                            ? 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                            : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label="Toggle Favorite"
                      >
                        <Heart
                          size={16}
                          fill={isFav ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-base font-bold tracking-tight truncate ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {game.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {game.description}
                  </p>

                  {/* Controls Hint */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock size={12} className="text-cyan-400" />
                    <span className="truncate">{game.controls}</span>
                  </div>
                </div>

                {/* Bottom: Play Button with 3D Tilt */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>★ {game.rating}</span>
                    <span>·</span>
                    <span>{game.plays} plays</span>
                  </div>

                  <TiltButton
                    onClick={() => onSelectGame(game)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md"
                    style={{ backgroundColor: themeAccent }}
                    scale={1.1}
                    maxTilt={20}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Launch</span>
                  </TiltButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
