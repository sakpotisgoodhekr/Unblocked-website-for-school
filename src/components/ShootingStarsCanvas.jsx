import React, { useEffect, useRef } from 'react';

export const ShootingStarsCanvas = ({
  darkMode = true,
  themeConfig = null,
  enabled = true,
  density = 'medium',
  batterySaver = false,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    let stars = [];
    let shootingStars = [];
    let nextShootingStarTime = performance.now() + 1000;

    const getStarCount = () => {
      if (batterySaver) return 35;
      if (density === 'low') return 55;
      if (density === 'high') return 200;
      return 110;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = getStarCount();
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.6,
          baseAlpha: Math.random() * 0.6 + 0.2,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnShootingStar = () => {
      const angle = (Math.PI / 180) * (30 + Math.random() * 20);
      const startX = Math.random() * width * 0.9;
      const startY = Math.random() * height * 0.45;
      const maxLife = Math.random() * 45 + 35;

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 110 + 70,
        speed: Math.random() * 9 + 8,
        angle,
        thickness: Math.random() * 1.5 + 1.2,
        opacity: 1,
        life: 0,
        maxLife,
      });
    };

    let lastFrame = performance.now();

    const loop = (time) => {
      lastFrame = time;

      ctx.clearRect(0, 0, width, height);

      // Background color from theme configuration
      const bgColor = darkMode
        ? (themeConfig?.darkBg || '#060913')
        : (themeConfig?.lightBg || '#f8fafc');

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, bgColor);
      bgGrad.addColorStop(1, darkMode ? '#02040a' : '#edf2f7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Twinkling Stars
      const starColor = darkMode
        ? (themeConfig?.starTintDark || '#e2e8f0')
        : (themeConfig?.starTintLight || '#64748b');

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.phase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.08, Math.min(1, s.baseAlpha + Math.sin(s.phase) * 0.3));

        ctx.fillStyle = starColor;
        ctx.globalAlpha = currentAlpha * (darkMode ? 0.9 : 0.5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Check shooting star spawning
      if (time > nextShootingStarTime) {
        spawnShootingStar();
        const delay = batterySaver
          ? Math.random() * 4000 + 3500
          : Math.random() * 2500 + 1500;
        nextShootingStarTime = time + delay;
      }

      // Render Shooting Stars
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
        let alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        alpha = Math.max(0, Math.min(1, alpha));

        const streakGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        const streakAccent = themeConfig?.accent || '#06b6d4';
        streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        streakGrad.addColorStop(0.6, `${streakAccent}`);
        streakGrad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = streakGrad;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = ss.thickness;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Glowing Star Head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.thickness * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (ss.life >= ss.maxLife || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
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
        lastFrame = performance.now();
        animationId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationId);
    };
  }, [darkMode, themeConfig, enabled, density, batterySaver]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
      style={{ display: enabled ? 'block' : 'none' }}
    />
  );
};
