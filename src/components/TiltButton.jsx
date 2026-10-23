import React, { useRef, useState } from 'react';

/**
 * 3D Model Cursor-Following Interactive Button
 * Turns dynamically in 3D space tracking the cursor's exact coordinates with dynamic specular glare.
 */
export const TiltButton = ({
  children,
  onClick,
  className = '',
  title = '',
  ariaLabel = '',
  style = {},
  disabled = false,
  maxTilt = 24, // maximum degrees of tilt
  scale = 1.06,
}) => {
  const buttonRef = useRef(null);
  const [transform, setTransform] = useState('perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    // Normalized relative offset: -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Invert Y for natural rotateX angle
    const rotateX = -y * maxTilt;
    const rotateY = x * maxTilt;

    setTransform(
      `perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale}) translateZ(10px)`
    );

    // Glare coordinates (0% to 100%)
    setGlare({
      x: ((x + 0.5) * 100).toFixed(1),
      y: ((y + 0.5) * 100).toFixed(1),
      opacity: 0.35,
    });
  };

  const handlePointerEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    // Smooth reset
    setTransform('perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || title}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none outline-none cursor-pointer overflow-hidden ${className}`}
      style={{
        ...style,
        transform,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.15s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease-out',
        willChange: 'transform',
      }}
    >
      {/* 3D Specular Highlight layer tracking cursor */}
      <span
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-200"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, rgba(255, 255, 255, 0) 70%)`,
        }}
      />

      {/* Button content projected forward in 3D */}
      <span
        className="relative z-10 flex items-center justify-center gap-2 w-full h-full"
        style={{ transform: 'translateZ(12px)' }}
      >
        {children}
      </span>
    </button>
  );
};
