import React, { useEffect, useRef } from 'react';

export const ShootingStarsCanvas = ({
  darkMode = true,
  themeConfig = null,
  enabled = true,
  starsEnabled = true,
  shootingStarsEnabled = true,
  density = 'medium',
  batterySaver = false,
}) => {
  const canvasRef = useRef(null);

  // Fallbacks if enabled is used as overall toggle
  const showStars = enabled && starsEnabled !== false;
  const showShootingStars = enabled && shootingStarsEnabled !== false;

  useEffect(() => {
    if (!showStars && !showShootingStars) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    let stars = [];
    let shootingStars = [];
    let nextShootingStarTime = performance.now() + 500;

    const getStarCount = () => {
      if (batterySaver) return 35;
      if (density === 'low') return 60;
      if (density === 'high') return 220;
      return 120;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = getStarCount();
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.3 + 0.6,
          baseAlpha: Math.random() * 0.5 + 0.25,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
        });
      }
    };

    const spawnShootingStar = () => {
      // Shooting star flies from top-left quadrant down towards bottom-right
      const angle = (Math.PI / 180) * (32 + Math.random() * 16);
      const startX = Math.random() * width * 0.95;
      const startY = Math.random() * height * 0.45;
      const maxLife = Math.random() * 40 + 35;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 7 + 8,
        angle,
        thickness: Math.random() * 0.4 + 1.2, // Clean thin streak: 1.2 - 1.6px
        life: 0,
        maxLife,
      });
    };

    const loop = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Background color gradient
      const bgColor = darkMode
        ? (themeConfig?.darkBg || '#060913')
        : (themeConfig?.lightBg || '#f8fafc');

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, bgColor);
      bgGrad.addColorStop(1, darkMode ? '#02040a' : '#edf2f7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Render Twinkling Stars
      if (showStars) {
        const starColor = darkMode
          ? (themeConfig?.starTintDark || '#e2e8f0')
          : (themeConfig?.starTintLight || '#64748b');

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.phase += s.twinkleSpeed;
          const currentAlpha = Math.max(0.1, Math.min(1, s.baseAlpha + Math.sin(s.phase) * 0.35));

          ctx.fillStyle = starColor;
          ctx.globalAlpha = currentAlpha * (darkMode ? 0.9 : 0.55);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // 2. Check shooting star spawning
      if (showShootingStars && time > nextShootingStarTime) {
        spawnShootingStar();
        const delay = batterySaver
          ? Math.random() * 3500 + 3000
          : Math.random() * 2000 + 1200;
        nextShootingStarTime = time + delay;
      }

      // 3. Render Shooting Stars: Tiny white dot with a greyish tail behind it
      if (showShootingStars) {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const ss = shootingStars[i];
          ss.life++;

          const dx = Math.cos(ss.angle) * ss.speed;
          const dy = Math.sin(ss.angle) * ss.speed;
          ss.x += dx;
          ss.y += dy;

          const tailX = ss.x - Math.cos(ss.angle) * ss.length;
          const tailY = ss.y - Math.sin(ss.angle) * ss.length;

          const progress = ss.life / ss.maxLife;
          let alpha = progress < 0.25 ? progress / 0.25 : 1 - (progress - 0.25) / 0.75;
          alpha = Math.max(0, Math.min(1, alpha));

          // Elegant Greyish tail gradient behind the head
          const streakGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
          streakGrad.addColorStop(0, 'rgba(150, 155, 165, 0)');
          streakGrad.addColorStop(0.4, 'rgba(165, 172, 184, 0.25)');
          streakGrad.addColorStop(0.8, 'rgba(185, 192, 203, 0.55)');
          streakGrad.addColorStop(1, 'rgba(225, 230, 240, 0.85)');

          ctx.strokeStyle = streakGrad;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = ss.thickness;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(ss.x, ss.y);
          ctx.stroke();

          // Tiny White Dot head at the leading tip (radius 1.5px)
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1;

          if (ss.life >= ss.maxLife || ss.x > width + 100 || ss.y > height + 100) {
            shootingStars.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    animationId = requestAnimationFrame(loop);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationId);
    };
  }, [darkMode, themeConfig, showStars, showShootingStars, density, batterySaver]);

  if (!showStars && !showShootingStars) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
    />
  );
};
