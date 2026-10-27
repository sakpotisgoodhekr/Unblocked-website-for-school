import React, { useMemo } from 'react';
import {
  Search,
  Heart,
  Play,
  Gamepad2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

export const GamesView = ({
  games = [],
  loading = false,
  isFavoritesMode = false,
  onSwitchToGames,
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
      if (isFavoritesMode) {
        if (!favorites.includes(game.id)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchDesc = game.description.toLowerCase().includes(q);
        return matchTitle || matchDesc;
      }

      return true;
    });
  }, [games, isFavoritesMode, searchQuery, favorites]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header bar with Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            {isFavoritesMode ? (
              <Heart size={26} className="text-rose-500 fill-rose-500" />
            ) : (
              <Gamepad2 size={26} className="text-cyan-400" />
            )}
            <h1
              className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isFavoritesMode ? 'Favorites' : 'Games'}
            </h1>
            {isFavoritesMode && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30">
                {favorites.length}
              </span>
            )}
          </div>
          <p
            className={`text-xs md:text-sm mt-1 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {isFavoritesMode
              ? 'Your favorited unblocked games for instant access'
              : 'Direct unblocked iframe embeds · Fast Chromebook performance'}
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
            placeholder={isFavoritesMode ? 'Search favorites...' : 'Search games...'}
            className={`w-full pl-9 pr-14 py-2.5 rounded-2xl text-xs md:text-sm transition-all focus:outline-none ${
              darkMode
                ? 'bg-slate-900/60 text-white placeholder-slate-500 border border-white/10 focus:border-cyan-500'
                : 'bg-white/80 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-cyan-500'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`p-5 rounded-3xl animate-pulse ${
                darkMode ? 'bg-slate-800/40 border border-white/5' : 'bg-slate-200/60 border border-slate-300'
              } h-56 flex flex-col justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-700/50" />
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
          className={`text-center py-16 px-6 rounded-3xl glass-panel max-w-lg mx-auto ${
            darkMode ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          {isFavoritesMode ? (
            <>
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-500">
                <Heart size={32} />
              </div>
              <h3
                className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                No Favorites Yet
              </h3>
              <p
                className={`text-xs mt-2 max-w-sm mx-auto leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Hover over any game card and click the heart button on the top right to add it to your favorites tab!
              </p>
              {onSwitchToGames && (
                <TiltButton
                  onClick={onSwitchToGames}
                  className="mt-5 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-md mx-auto inline-flex items-center gap-1.5"
                  style={{ backgroundColor: themeAccent }}
                  scale={1.08}
                >
                  <Gamepad2 size={15} />
                  <span>Browse All Games</span>
                  <ArrowRight size={14} />
                </TiltButton>
              )}
            </>
          ) : (
            <>
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
                {searchQuery ? 'No matching games found' : 'No Games Available'}
              </h3>
              <p
                className={`text-xs mt-1.5 max-w-sm mx-auto leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {searchQuery
                  ? `No games match "${searchQuery}". Try a different keyword.`
                  : 'Check back soon or search for other games.'}
              </p>
              {searchQuery && (
                <TiltButton
                  onClick={() => setSearchQuery('')}
                  className="mt-5 px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-sm mx-auto"
                  style={{ backgroundColor: themeAccent }}
                  scale={1.08}
                >
                  Clear Search
                </TiltButton>
              )}
            </>
          )}
        </div>
      )}

      {/* Game Cards Grid with Top-Right Hover Heart */}
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
                {/* Top-Right Heart Button (Appears on card hover, or always visible if favorited) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(game.id);
                  }}
                  className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isFav
                      ? 'opacity-100 text-rose-500 bg-rose-500/15 border border-rose-500/30 shadow-md shadow-rose-500/10'
                      : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-900 border border-white/10 shadow-lg'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    size={16}
                    fill={isFav ? 'currentColor' : 'none'}
                    className={`transition-transform duration-150 active:scale-75 ${
                      isFav ? 'scale-105' : 'hover:scale-110'
                    }`}
                  />
                </button>

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: game.color }}
                    >
                      <Gamepad2 size={24} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-base font-bold tracking-tight truncate pr-6 ${
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer"
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
