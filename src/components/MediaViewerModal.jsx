import React, { useState, useMemo } from 'react';
import {
  X,
  ExternalLink,
  Search,
  Play,
  Share2,
  Check,
  ThumbsUp,
  Flame,
  Gamepad2,
  Music,
  Clock,
  Sparkles,
  Radio,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

// Rich Curated YouTube Video Library with real YouTube video IDs & high-res thumbnails
const YOUTUBE_LIBRARY = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    channel: 'Lofi Girl',
    category: 'Chill & Lo-Fi',
    duration: 'LIVE',
    isLive: true,
    views: '74.2M views',
    uploaded: 'Streaming now',
    description: 'A peaceful study companion with cozy beats, endless chill anime vibes, and smooth study sessions.',
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Synthwave Radio - Chill Retro Synth / Chillwave Beats',
    channel: 'Lofi Girl - Synthwave',
    category: 'Chill & Lo-Fi',
    duration: 'LIVE',
    isLive: true,
    views: '12.8M views',
    uploaded: 'Streaming now',
    description: 'Neon retro driving beats, 80s nostalgia, and ambient cyber synthwave.',
  },
  {
    id: 'WPni755-Krg',
    title: 'Minecraft OST - Volume Alpha & Beta (Full Chill Soundtrack)',
    channel: 'C418 / Ambient',
    category: 'Minecraft',
    duration: '58:45',
    views: '18.4M views',
    uploaded: '6 months ago',
    description: 'Iconic relaxing background music from Minecraft. Perfect for focusing, building, and chilling.',
  },
  {
    id: 'k2qgadSvNyU',
    title: 'Minecraft: The History of the World Record Speedrun',
    channel: 'Summoning Salt',
    category: 'Speedruns',
    duration: '42:10',
    views: '9.2M views',
    uploaded: '1 year ago',
    description: 'The definitive documentary breaking down the progression of Minecraft any% speedrun records.',
  },
  {
    id: '2Vv-BfVoq4g',
    title: 'Ed Sheeran - Shape of You [Official Video]',
    channel: 'Ed Sheeran',
    category: 'Music',
    duration: '4:23',
    views: '6.2B views',
    uploaded: '7 years ago',
    description: 'Global smash hit single. Energetic acoustic pop with millions of daily streams.',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    channel: 'Rick Astley',
    category: 'Memes',
    duration: '3:33',
    views: '1.5B views',
    uploaded: '14 years ago',
    description: 'The timeless internet classic. You know the rules, and so do I.',
  },
  {
    id: '7lCDEYXw3mM',
    title: 'Google Snake World Record - Perfect 252 Max Score Run',
    channel: 'Arcade Master',
    category: 'Gaming',
    duration: '18:12',
    views: '3.4M views',
    uploaded: '8 months ago',
    description: 'Incredible snake control pathing to achieve a flawless maximum score without trapping!',
  },
  {
    id: '5qap5aO4i9A',
    title: 'Lofi Beats - Peaceful Relaxing Night Session',
    channel: 'ChilledCow Classics',
    category: 'Chill & Lo-Fi',
    duration: '1:45:20',
    views: '5.1M views',
    uploaded: '4 months ago',
    description: 'Deep focus beats to unwind, finish homework, or play casual games.',
  },
  {
    id: 'b6vS2G4L2-U',
    title: 'Rocket Soccer Derby - Top 50 Insane Freestyle Aerial Goals',
    channel: 'Derby Highlights',
    category: 'Gaming',
    duration: '11:34',
    views: '840K views',
    uploaded: '3 weeks ago',
    description: 'Acrobatic ceiling resets, double touch saves, and supersonic overtime game winners.',
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Queen - Bohemian Rhapsody (Official Video Remastered)',
    channel: 'Queen Official',
    category: 'Music',
    duration: '5:59',
    views: '1.7B views',
    uploaded: '15 years ago',
    description: 'Legendary rock opera masterpiece by Freddie Mercury and Queen.',
  },
  {
    id: 'hTWKbfoikeg',
    title: 'Nirvana - Smells Like Teen Spirit (Official Music Video)',
    channel: 'Nirvana',
    category: 'Music',
    duration: '4:38',
    views: '1.9B views',
    uploaded: '14 years ago',
    description: 'The grunge anthem that redefined 90s alternative rock forever.',
  },
  {
    id: 'kXYiU_JCYtU',
    title: 'Linkin Park - Numb (Official Music Video) [4K Upgrade]',
    channel: 'Linkin Park',
    category: 'Music',
    duration: '3:07',
    views: '2.3B views',
    uploaded: '17 years ago',
    description: 'High intensity rock anthem from Meteora with unforgettable vocal performance.',
  },
];

const CATEGORIES = [
  'All',
  'Gaming',
  'Minecraft',
  'Speedruns',
  'Chill & Lo-Fi',
  'Music',
  'Memes',
];

export const MediaViewerModal = ({
  onClose,
  darkMode = true,
  themeAccent = '#06b6d4',
  initialVideoId = null,
}) => {
  const [selectedVideo, setSelectedVideo] = useState(() => {
    if (initialVideoId) {
      const match = YOUTUBE_LIBRARY.find((v) => v.id === initialVideoId);
      if (match) return match;
    }
    return YOUTUBE_LIBRARY[0];
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState({});
  const [viewMode, setViewMode] = useState('player'); // 'player' (theater mode with suggestions) or 'grid' (browse catalog)

  // Filtered video library
  const filteredVideos = useMemo(() => {
    return YOUTUBE_LIBRARY.filter((video) => {
      if (activeCategory !== 'All' && video.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          video.title.toLowerCase().includes(q) ||
          video.channel.toLowerCase().includes(q) ||
          video.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Extract YouTube ID from URL or bare ID
  const handleLoadCustomVideo = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    let id = customInput.trim();
    if (id.includes('v=')) {
      id = id.split('v=')[1]?.split('&')[0];
    } else if (id.includes('youtu.be/')) {
      id = id.split('youtu.be/')[1]?.split('?')[0];
    } else if (id.includes('embed/')) {
      id = id.split('embed/')[1]?.split('?')[0];
    }

    if (id) {
      const customVideo = {
        id,
        title: `Custom Video (${id})`,
        channel: 'YouTube Video',
        category: 'Custom',
        duration: 'YouTube',
        views: 'User Loaded',
        uploaded: 'Just now',
        description: 'Loaded via Protis Unblocked Video Library.',
      };
      setSelectedVideo(customVideo);
      setViewMode('player');
      setCustomInput('');
    }
  };

  const handleShare = () => {
    const url = `https://www.youtube.com/watch?v=${selectedVideo.id}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleToggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div
        className={`w-full max-w-6xl h-[92vh] rounded-3xl flex flex-col overflow-hidden glass-panel shadow-2xl border ${
          darkMode ? 'border-white/10 bg-slate-950/95' : 'border-slate-300 bg-white/95'
        }`}
      >
        {/* Top YouTube Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-900/80 shrink-0 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <Play size={18} fill="white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-base sm:text-lg tracking-tight text-white">
                  YouTube
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                  Video Library
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Authentic thumbnails, unblocked player, and rich video catalog
              </p>
            </div>
          </div>

          {/* Search / Paste Custom Video Bar */}
          <form
            onSubmit={handleLoadCustomVideo}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Paste any YouTube URL or Video ID..."
                className="w-full pl-9 pr-14 py-2 rounded-xl text-xs bg-slate-800/90 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
              >
                Play
              </button>
            </div>
          </form>

          {/* Right Action Buttons (spaced away from fixed top-right FPS counter) */}
          <div className="flex items-center gap-2 mr-20 sm:mr-24">
            <TiltButton
              onClick={() => setViewMode(viewMode === 'player' ? 'grid' : 'player')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white border border-white/10 cursor-pointer hidden sm:flex items-center gap-1.5"
              scale={1.06}
            >
              {viewMode === 'player' ? 'Browse All' : 'Back to Player'}
            </TiltButton>

            <TiltButton
              onClick={handleShare}
              className="p-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
              title="Copy Video Link"
              scale={1.1}
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            </TiltButton>

            <a
              href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Open directly in YouTube in a new tab"
            >
              <ExternalLink size={16} />
            </a>

            <TiltButton
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
              title="Close"
              scale={1.1}
            >
              <X size={18} />
            </TiltButton>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="flex md:hidden p-3 bg-slate-900 border-b border-white/10">
          <form onSubmit={handleLoadCustomVideo} className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Paste YouTube URL or ID..."
              className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-800 text-white placeholder-slate-400 border border-white/10"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Load
            </button>
          </form>
        </div>

        {/* Category Pills Bar */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Modal Main View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {/* THEATER PLAYER VIEW */}
          {viewMode === 'player' ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Video Player & Metadata */}
              <div className="flex-1 flex flex-col">
                {/* 16:9 Sandboxed Iframe Video Player */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    className="w-full h-full border-0 block"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Video Info Details */}
                <div className="mt-4 p-4 rounded-2xl glass-card border border-white/10">
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                    {selectedVideo.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10">
                    {/* Channel Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 text-white font-black flex items-center justify-center text-sm shadow-md">
                        {selectedVideo.channel.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">
                            {selectedVideo.channel}
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-700 text-[9px] flex items-center justify-center text-slate-300">
                            ✓
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {selectedVideo.views} · {selectedVideo.uploaded}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(selectedVideo.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          likes[selectedVideo.id]
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10'
                        }`}
                      >
                        <ThumbsUp size={14} fill={likes[selectedVideo.id] ? 'currentColor' : 'none'} />
                        <span>{likes[selectedVideo.id] ? 'Liked' : 'Like'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10 cursor-pointer"
                      >
                        <Share2 size={14} />
                        <span>Share</span>
                      </button>

                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md cursor-pointer transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>YouTube ↗</span>
                      </a>
                    </div>
                  </div>

                  {selectedVideo.description && (
                    <p className="mt-3 text-xs text-slate-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      {selectedVideo.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Up Next / Recommended Videos with Authentic Thumbnails */}
              <div className="w-full lg:w-88 flex flex-col shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Up Next
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className="text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    View All Library ({filteredVideos.length})
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {filteredVideos
                    .filter((v) => v.id !== selectedVideo.id)
                    .slice(0, 7)
                    .map((video) => (
                      <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="group flex gap-3 p-2 rounded-2xl glass-card border border-white/5 hover:border-red-500/40 cursor-pointer transition-all duration-200 hover:bg-white/5"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-32 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
                          <img
                            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                          />
                          {video.isLive ? (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider">
                              LIVE
                            </span>
                          ) : (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px]">
                              {video.duration}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Play size={18} fill="white" className="text-white drop-shadow-md" />
                          </div>
                        </div>

                        {/* Title & Channel */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                            {video.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 mt-1 truncate">
                            {video.channel}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {video.views} · {video.uploaded}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            /* FULL CATALOG GRID VIEW */
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Video Library Catalog
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any thumbnail to open the video player
                  </p>
                </div>

                <TiltButton
                  onClick={() => setViewMode('player')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  scale={1.08}
                >
                  <Play size={13} fill="currentColor" />
                  <span>Resume Player</span>
                </TiltButton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(video);
                      setViewMode('player');
                    }}
                    className="group flex flex-col rounded-2xl glass-card border border-white/10 overflow-hidden cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl hover:border-red-500/40"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {video.isLive ? (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Radio size={10} />
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] shadow-md">
                          {video.duration}
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                          <Play size={20} fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                        {video.channel.slice(0, 1)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          {video.channel}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {video.views} · {video.uploaded}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-900/90 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 shrink-0 gap-2">
          <span>Protis YouTube Video Library · Chromebook Unblocked Mode</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const random = YOUTUBE_LIBRARY[Math.floor(Math.random() * YOUTUBE_LIBRARY.length)];
                setSelectedVideo(random);
                setViewMode('player');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              🎲 Random Video
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
