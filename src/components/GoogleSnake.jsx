import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Gauge,
  Shield,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TiltButton } from './TiltButton';

const COLS = 17;
const ROWS = 15;

const SPEEDS = {
  slow: { label: 'Chill', delay: 135 },
  normal: { label: 'Normal', delay: 90 },
  fast: { label: 'Fast', delay: 65 },
};

export const GoogleSnake = ({ darkMode = true, themeAccent = '#10b981' }) => {
  const canvasRef = useRef(null);

  // High score in localStorage
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('protis_snake_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'paused', 'gameover'
  const [speedMode, setSpeedMode] = useState('normal'); // 'slow', 'normal', 'fast'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wrapWalls, setWrapWalls] = useState(false);
  const [boardTheme, setBoardTheme] = useState('classic'); // 'classic' (green grass) or 'cosmic' (dark slate)

  // Internal game engine state ref
  const engineRef = useRef({
    snake: [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
    ],
    prevSnake: [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
    ],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 12, y: 7 },
    lastStepTime: 0,
    isPlaying: false,
    score: 0,
    tongueTimer: 0,
    applePulse: 0,
  });

  // Synthesized Web Audio API sound generator
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        if (type === 'eat') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.13);
        } else if (type === 'turn') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } else if (type === 'gameover') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(260, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.28);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {
        // AudioContext disabled or muted
      }
    },
    [soundEnabled]
  );

  // Spawn food on empty cell
  const spawnFood = (snake) => {
    const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
    const emptyCells = [];
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (!occupied.has(`${x},${y}`)) {
          emptyCells.push({ x, y });
        }
      }
    }
    if (emptyCells.length === 0) return { x: 0, y: 0 };
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // Start / Restart game
  const startGame = useCallback(() => {
    const initialSnake = [
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
    ];
    engineRef.current = {
      snake: initialSnake,
      prevSnake: initialSnake.map((p) => ({ ...p })),
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: spawnFood(initialSnake),
      lastStepTime: performance.now(),
      isPlaying: true,
      score: 0,
      tongueTimer: 0,
      applePulse: 0,
    };
    setScore(0);
    setGameState('playing');
  }, []);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      engineRef.current.isPlaying = false;
      setGameState('paused');
    } else if (gameState === 'paused') {
      engineRef.current.isPlaying = true;
      engineRef.current.lastStepTime = performance.now();
      setGameState('playing');
    }
  }, [gameState]);

  // Steer snake safely
  const changeDirection = useCallback(
    (dx, dy) => {
      const { direction, isPlaying } = engineRef.current;
      if (!isPlaying) {
        if (gameState === 'ready' || gameState === 'gameover') {
          startGame();
        }
      }
      // Prevent reversing directly into yourself
      if (dx !== 0 && direction.x !== 0) return;
      if (dy !== 0 && direction.y !== 0) return;

      engineRef.current.nextDirection = { x: dx, y: dy };
      playSound('turn');
    },
    [gameState, startGame, playSound]
  );

  // Global Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection(1, 0);
          break;
        case ' ':
          e.preventDefault();
          if (gameState === 'playing' || gameState === 'paused') {
            pauseGame();
          } else if (gameState === 'ready' || gameState === 'gameover') {
            startGame();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, gameState, pauseGame, startGame]);

  // Main game rendering and continuous smooth update loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (now) => {
      const state = engineRef.current;
      const speedDelay = SPEEDS[speedMode].delay;

      // 1. UPDATE DISCRETE GRID STEP WHEN DELAY EXPIRED
      if (state.isPlaying && now - state.lastStepTime >= speedDelay) {
        state.lastStepTime = now;
        state.direction = state.nextDirection;

        // Save current positions for interpolation
        state.prevSnake = state.snake.map((p) => ({ ...p }));

        const head = state.snake[0];
        let newX = head.x + state.direction.x;
        let newY = head.y + state.direction.y;

        // Wall Collisions or Wrap Around
        if (wrapWalls) {
          if (newX < 0) newX = COLS - 1;
          if (newX >= COLS) newX = 0;
          if (newY < 0) newY = ROWS - 1;
          if (newY >= ROWS) newY = 0;
        } else {
          if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) {
            state.isPlaying = false;
            setGameState('gameover');
            playSound('gameover');
            return;
          }
        }

        // Self Collision Check
        for (let i = 0; i < state.snake.length - 1; i++) {
          if (state.snake[i].x === newX && state.snake[i].y === newY) {
            state.isPlaying = false;
            setGameState('gameover');
            playSound('gameover');
            return;
          }
        }

        const newHead = { x: newX, y: newY };
        const isEating = newX === state.food.x && newY === state.food.y;

        const newSnake = [newHead, ...state.snake];
        if (isEating) {
          state.score += 1;
          setScore(state.score);
          if (state.score > highScore) {
            setHighScore(state.score);
            try {
              localStorage.setItem('protis_snake_highscore', state.score.toString());
            } catch {}
          }
          state.food = spawnFood(newSnake);
          playSound('eat');
        } else {
          newSnake.pop();
        }
        state.snake = newSnake;
      }

      // 2. COMPUTE SUB-SQUARE SMOOTH INTERPOLATION (0.0 to 1.0)
      const progress = state.isPlaying
        ? Math.min(1, Math.max(0, (now - state.lastStepTime) / speedDelay))
        : 1;

      // 3. DRAW BOARD
      const width = canvas.width;
      const height = canvas.height;
      const cellW = width / COLS;
      const cellH = height / ROWS;

      ctx.clearRect(0, 0, width, height);

      // Checkered Google Snake Grass or Slate Colors
      const isGrass = boardTheme === 'classic';
      const c1 = isGrass ? '#aad751' : '#1e293b';
      const c2 = isGrass ? '#a2d149' : '#0f172a';

      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          ctx.fillStyle = (x + y) % 2 === 0 ? c1 : c2;
          ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
        }
      }

      // Draw Juicy Red Apple Food with subtle breathing pulse
      state.applePulse = (state.applePulse + 0.05) % (Math.PI * 2);
      const pulseScale = 1 + Math.sin(state.applePulse) * 0.04;
      const fx = state.food.x * cellW + cellW / 2;
      const fy = state.food.y * cellH + cellH / 2;
      const baseRadius = (Math.min(cellW, cellH) / 2) * 0.76;
      const appleRadius = baseRadius * pulseScale;

      // Apple Body
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.arc(fx, fy + 1, appleRadius, 0, Math.PI * 2);
      ctx.fill();

      // Apple Highlight
      ctx.fillStyle = '#ff8a80';
      ctx.beginPath();
      ctx.arc(fx - appleRadius * 0.35, fy - appleRadius * 0.25, appleRadius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Apple Brown Stem
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(fx, fy - appleRadius * 0.8);
      ctx.quadraticCurveTo(fx + 2, fy - appleRadius * 1.3, fx + 4, fy - appleRadius * 1.4);
      ctx.stroke();

      // Apple Green Leaf
      ctx.fillStyle = '#43a047';
      ctx.beginPath();
      ctx.ellipse(fx + 4, fy - appleRadius * 1.1, 4, 2, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // 4. CALCULATE SMOOTH INTERPOLATED POSITIONS FOR ALL SNAKE SEGMENTS
      const snake = state.snake;
      const prevSnake = state.prevSnake;
      const interpPositions = [];

      for (let i = 0; i < snake.length; i++) {
        const curr = snake[i];
        const prev = prevSnake[i] || prevSnake[prevSnake.length - 1] || curr;

        let dx = curr.x - prev.x;
        let dy = curr.y - prev.y;

        // Handle wrap-around interpolation so it doesn't streak across the canvas
        if (dx > 1) dx -= COLS;
        if (dx < -1) dx += COLS;
        if (dy > 1) dy -= ROWS;
        if (dy < -1) dy += ROWS;

        // If distance is still huge (teleported), don't interpolate
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          interpPositions.push({ x: curr.x, y: curr.y });
        } else {
          interpPositions.push({
            x: prev.x + dx * progress,
            y: prev.y + dy * progress,
          });
        }
      }

      // 5. DRAW CONNECTING SMOOTH BODY CAPSULES
      const segmentRadius = Math.min(cellW, cellH) * 0.44;

      // Draw continuous segments from tail to head
      for (let i = interpPositions.length - 1; i > 0; i--) {
        const p1 = interpPositions[i];
        const p2 = interpPositions[i - 1];

        const x1 = p1.x * cellW + cellW / 2;
        const y1 = p1.y * cellH + cellH / 2;
        const x2 = p2.x * cellW + cellW / 2;
        const y2 = p2.y * cellH + cellH / 2;

        // Skip connecting if wrapped across boundaries
        const distSq = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        if (distSq > (cellW * 2) * (cellW * 2)) continue;

        // Alternating Google blue tones
        ctx.strokeStyle = i % 2 === 0 ? '#4376f0' : '#4d82f7';
        ctx.lineWidth = segmentRadius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw Individual Body Joints / Rounded Discs
      for (let i = interpPositions.length - 1; i > 0; i--) {
        const pos = interpPositions[i];
        const cx = pos.x * cellW + cellW / 2;
        const cy = pos.y * cellH + cellH / 2;

        // Tail segment smoothly tapers down
        const isTail = i === interpPositions.length - 1;
        const r = isTail ? segmentRadius * 0.82 : segmentRadius;

        ctx.fillStyle = i % 2 === 0 ? '#4376f0' : '#4d82f7';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. DRAW HEAD WITH SMOOTH DIRECTION ORIENTATION & EYES
      if (interpPositions.length > 0) {
        const headPos = interpPositions[0];
        const hx = headPos.x * cellW + cellW / 2;
        const hy = headPos.y * cellH + cellH / 2;
        const dir = state.direction;

        // Cute animated tongue flicking out
        state.tongueTimer = (state.tongueTimer + 0.08) % (Math.PI * 4);
        if (state.isPlaying && Math.sin(state.tongueTimer) > 0.75) {
          const tLength = 12 * Math.sin(state.tongueTimer);
          const tx = hx + dir.x * (segmentRadius + tLength);
          const ty = hy + dir.y * (segmentRadius + tLength);

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(hx + dir.x * segmentRadius, hy + dir.y * segmentRadius);
          ctx.lineTo(tx, ty);
          // Fork tip
          const perpX = -dir.y * 3.5;
          const perpY = dir.x * 3.5;
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + dir.x * 3 + perpX, ty + dir.y * 3 + perpY);
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + dir.x * 3 - perpX, ty + dir.y * 3 - perpY);
          ctx.stroke();
        }

        // Head Circle / Rounded shape
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(hx, hy, segmentRadius * 1.05, 0, Math.PI * 2);
        ctx.fill();

        // Calculate Eye Positions
        let eye1X, eye1Y, eye2X, eye2Y;
        const eyeOffset = segmentRadius * 0.48;
        const eyeForward = segmentRadius * 0.35;

        if (dir.x !== 0) {
          eye1X = hx + dir.x * eyeForward;
          eye1Y = hy - eyeOffset;
          eye2X = hx + dir.x * eyeForward;
          eye2Y = hy + eyeOffset;
        } else {
          eye1X = hx - eyeOffset;
          eye1Y = hy + dir.y * eyeForward;
          eye2X = hx + eyeOffset;
          eye2Y = hy + dir.y * eyeForward;
        }

        // White Eyeballs
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 4.2, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 4.2, 0, Math.PI * 2);
        ctx.fill();

        // Dark Pupils looking in the exact direction of motion
        const pOffX = dir.x * 1.5;
        const pOffY = dir.y * 1.5;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(eye1X + pOffX, eye1Y + pOffY, 2.2, 0, Math.PI * 2);
        ctx.arc(eye2X + pOffX, eye2Y + pOffY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Cute eye highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eye1X + pOffX - 0.7, eye1Y + pOffY - 0.7, 0.9, 0, Math.PI * 2);
        ctx.arc(eye2X + pOffX - 0.7, eye2Y + pOffY - 0.7, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speedMode, wrapWalls, boardTheme, highScore, playSound]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl mx-auto p-2 sm:p-4 select-none">
      {/* Top Google Snake Scoreboard */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-emerald-600/90 text-white font-sans shadow-lg mb-3 border border-emerald-400/30">
        {/* Apple Score */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-lg">
            🍎
          </div>
          <span className="font-black text-2xl tracking-tight">{score}</span>
        </div>

        {/* High Score Trophy */}
        <div className="flex items-center gap-2 text-amber-200">
          <Trophy size={20} className="text-amber-300" />
          <span className="font-bold text-sm tracking-wide">
            BEST: <b className="text-white text-base">{highScore}</b>
          </span>
        </div>

        {/* Game Quick Toolbar */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Wall Mode Toggle */}
          <button
            type="button"
            onClick={() => setWrapWalls(!wrapWalls)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              wrapWalls ? 'bg-amber-500 text-slate-900' : 'bg-emerald-700/80 text-white'
            }`}
            title="Toggle Border Walls / Wrap Around"
          >
            <Shield size={13} />
            <span>{wrapWalls ? 'Wrap' : 'Walls'}</span>
          </button>

          {/* Speed Preset Cycle */}
          <button
            type="button"
            onClick={() => {
              const modes = ['slow', 'normal', 'fast'];
              const next = modes[(modes.indexOf(speedMode) + 1) % modes.length];
              setSpeedMode(next);
            }}
            className="px-2.5 py-1 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
            title="Change Snake Speed"
          >
            <Gauge size={13} />
            <span className="capitalize">{SPEEDS[speedMode].label}</span>
          </button>

          {/* Pause / Play */}
          <button
            type="button"
            onClick={pauseGame}
            className="p-1.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-bold cursor-pointer transition-transform active:scale-95"
            title="Pause / Resume"
          >
            {gameState === 'playing' ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {/* Main Canvas Container with Smooth Rendering */}
      <div className="relative w-full aspect-[17/15] max-h-[68vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/40 bg-black flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={680}
          height={600}
          className="w-full h-full block object-contain"
        />

        {/* Start / Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/30 mb-4 animate-bounce">
              🐍
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Google Snake</h2>
            <p className="text-xs text-emerald-300 mt-1 max-w-xs">
              Smooth 60 FPS sub-pixel slither! Munch apples, steer smoothly, and beat the high score!
            </p>

            <TiltButton
              onClick={startGame}
              className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 cursor-pointer flex items-center gap-2"
              scale={1.12}
            >
              <Play size={18} fill="currentColor" />
              <span>PLAY NOW (SPACE)</span>
            </TiltButton>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-300 font-medium">
              <span>⌨️ Arrow Keys or WASD</span>
              <span>•</span>
              <span>🍎 Grow Snake</span>
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-6 text-center">
            <h3 className="text-2xl font-black text-white">GAME PAUSED</h3>
            <p className="text-xs text-slate-300 mt-1">Press Space or Resume to continue</p>
            <TiltButton
              onClick={pauseGame}
              className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg cursor-pointer flex items-center gap-2"
              scale={1.1}
            >
              <Play size={16} fill="currentColor" />
              <span>Resume</span>
            </TiltButton>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm p-6 text-center animate-fade-in">
            <div className="text-4xl mb-2">💥</div>
            <h3 className="text-2xl font-black text-white tracking-tight">GAME OVER</h3>
            <div className="mt-3 py-2 px-5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-6">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Score</div>
                <div className="text-xl font-black text-emerald-400">{score}</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">High Score</div>
                <div className="text-xl font-black text-amber-300">{highScore}</div>
              </div>
            </div>

            <TiltButton
              onClick={startGame}
              className="mt-6 px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm shadow-xl shadow-emerald-500/30 cursor-pointer flex items-center gap-2"
              scale={1.1}
            >
              <RotateCcw size={17} />
              <span>PLAY AGAIN (SPACE)</span>
            </TiltButton>
          </div>
        )}
      </div>

      {/* Responsive Touch / On-screen D-Pad for Chromebook Touchscreens & Tablets */}
      <div className="w-full flex items-center justify-between mt-3 px-2">
        <div className="text-xs text-slate-400 hidden sm:block">
          Use <b>Arrow Keys</b> or <b>WASD</b> to steer snake smoothly. Press <b>Space</b> to pause.
        </div>

        {/* Mobile / Touch On-screen Direction Arrows */}
        <div className="flex sm:hidden items-center justify-center w-full gap-2">
          <button
            type="button"
            onClick={() => changeDirection(-1, 0)}
            className="w-11 h-11 rounded-2xl bg-slate-800 text-white flex items-center justify-center active:bg-cyan-500 active:scale-95 transition-all shadow-md"
            aria-label="Left"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => changeDirection(0, -1)}
              className="w-11 h-11 rounded-2xl bg-slate-800 text-white flex items-center justify-center active:bg-cyan-500 active:scale-95 transition-all shadow-md"
              aria-label="Up"
            >
              <ArrowUp size={20} />
            </button>
            <button
              type="button"
              onClick={() => changeDirection(0, 1)}
              className="w-11 h-11 rounded-2xl bg-slate-800 text-white flex items-center justify-center active:bg-cyan-500 active:scale-95 transition-all shadow-md"
              aria-label="Down"
            >
              <ArrowDown size={20} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => changeDirection(1, 0)}
            className="w-11 h-11 rounded-2xl bg-slate-800 text-white flex items-center justify-center active:bg-cyan-500 active:scale-95 transition-all shadow-md"
            aria-label="Right"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setBoardTheme(boardTheme === 'classic' ? 'cosmic' : 'classic')}
          className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          Theme: <span className="text-cyan-400 capitalize">{boardTheme}</span>
        </button>
      </div>
    </div>
  );
};
