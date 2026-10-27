import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  HelpCircle,
  X,
  Heart,
  Gamepad2,
} from 'lucide-react';
import { TiltButton } from './TiltButton';
import { GoogleSnake } from './GoogleSnake';

export const GamePlayerModal = ({
  game,
  onClose,
  darkMode = true,
  isFavorite = false,
  onToggleFavorite,
  themeAccent = '#06b6d4',
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [loading, setLoading] = useState(true);

  const isCustomGame = game?.isCustom || game?.id === 'snake';

  const handleIframeLoad = () => {
    setLoading(false);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
    }
  };

  const handleReload = () => {
    if (isCustomGame) {
      // Custom game resets internally or forces re-render
      setLoading(true);
      setTimeout(() => setLoading(false), 200);
      return;
    }
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = game.iframeUrl;
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handlePopout = () => {
    if (game.iframeUrl) {
      window.open(game.iframeUrl, '_blank');
    }
  };

  const getButtonClass = () => {
    return `w-9 h-9 rounded-2xl ${
      darkMode
        ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-white/10'
        : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
    }`;
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      }`}
    >
      {/* Top Glass Toolbar */}
      <div
        className={`w-full max-w-6xl mx-auto flex items-center justify-between px-4 py-3 rounded-2xl mb-2 glass-panel transition-all duration-200 ${
          darkMode ? 'border-white/10' : 'border-slate-300/40'
        }`}
      >
        {/* Left: Back Icon Button & Game Title */}
        <div className="flex items-center gap-3">
          <TiltButton
            onClick={onClose}
            className={getButtonClass()}
            title="Back to games"
            ariaLabel="Back"
            scale={1.12}
          >
            <ArrowLeft size={18} />
          </TiltButton>

          <div className="flex items-center gap-2">
            <h2
              className={`text-sm md:text-base font-bold tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {game.title}
            </h2>
            {isCustomGame ? (
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Custom Built-in 60FPS
              </span>
            ) : game.category ? (
              <span
                className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${themeAccent}20`,
                  color: themeAccent,
                  border: `1px solid ${themeAccent}40`,
                }}
              >
                {game.category}
              </span>
            ) : null}
          </div>
        </div>

        {/* Right Action Buttons with 3D Tilt (spaced away from fixed top-right FPS counter) */}
        <div className="flex items-center gap-2 mr-20 sm:mr-24">
          <TiltButton
            onClick={() => setShowControls(!showControls)}
            className={getButtonClass()}
            title="Controls hint"
            ariaLabel="Controls"
            scale={1.12}
          >
            <HelpCircle size={17} />
          </TiltButton>

          <TiltButton
            onClick={() => onToggleFavorite(game.id)}
            className={`${getButtonClass()} ${
              isFavorite ? 'text-rose-500 bg-rose-500/15' : ''
            }`}
            title={isFavorite ? 'Favorited' : 'Favorite'}
            ariaLabel="Favorite"
            scale={1.12}
          >
            <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
          </TiltButton>

          <TiltButton
            onClick={handleReload}
            className={getButtonClass()}
            title="Reload game"
            ariaLabel="Reload"
            scale={1.12}
          >
            <RotateCw size={17} />
          </TiltButton>

          {game.iframeUrl && (
            <TiltButton
              onClick={handlePopout}
              className={getButtonClass()}
              title="Open in new window"
              ariaLabel="Popout"
              scale={1.12}
            >
              <ExternalLink size={17} />
            </TiltButton>
          )}

          <TiltButton
            onClick={handleToggleFullscreen}
            className={getButtonClass()}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            ariaLabel="Fullscreen"
            scale={1.12}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </TiltButton>

          <TiltButton
            onClick={onClose}
            className={getButtonClass()}
            title="Close game"
            ariaLabel="Close"
            scale={1.12}
          >
            <X size={18} />
          </TiltButton>
        </div>
      </div>

      {/* Controls Drawer Hint */}
      {showControls && (
        <div
          className={`w-full max-w-6xl mx-auto mb-2 p-3 rounded-2xl text-xs flex items-center justify-between glass-card ${
            darkMode ? 'text-slate-300 border-cyan-500/30' : 'text-slate-700 border-cyan-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <Gamepad2 size={16} className="text-cyan-400" />
            <span>
              <b>Controls:</b> {game.controls || 'Arrow Keys or WASD'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowControls(false)}
            className="text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Game Player Container */}
      <div className="w-full max-w-6xl mx-auto flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center">
        {isCustomGame ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-950">
            <GoogleSnake darkMode={darkMode} themeAccent={themeAccent} />
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10 gap-3">
                <div
                  className="w-10 h-10 border-4 rounded-full animate-spin"
                  style={{
                    borderColor: `${themeAccent}30`,
                    borderTopColor: themeAccent,
                  }}
                />
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  Loading {game.title}...
                </p>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={game.iframeUrl}
              title={game.titleAttribute || game.title}
              onLoad={handleIframeLoad}
              className="w-full h-full border-0 block"
              allow={
                game.allow ||
                "fullscreen; autoplay; gamepad; accelerometer; gyroscope; clipboard-read; clipboard-write; microphone; focus-without-user-activation *; screen-wake-lock; encrypted-media; picture-in-picture"
              }
              sandbox={
                game.sandbox ||
                "allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
              }
              referrerPolicy={game.referrerPolicy || "strict-origin-when-cross-origin"}
            />
          </>
        )}
      </div>

      {/* Unblocked Tip footer */}
      <div className="w-full max-w-6xl mx-auto mt-1 flex items-center justify-between text-[11px] text-slate-400 px-2">
        <span>Tip: Press ESC or your configured panic key anytime to return.</span>
        {game.iframeUrl && (
          <button
            type="button"
            onClick={handlePopout}
            className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
          >
            Having trouble? Open directly in new window ↗
          </button>
        )}
      </div>
    </div>
  );
};
