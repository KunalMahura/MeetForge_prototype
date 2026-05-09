import React, { useEffect, useRef, useState } from 'react';

/**
 * A mini "dig hole" scratch-to-reveal canvas overlay for bento grid cards.
 *
 * Props:
 *  - fillColor:         Overlay colour (default: dark ink)
 *  - brushSize:         Eraser brush diameter (default: 50)
 *  - showRevealButton:  Show a "lazy reveal" button (default: false)
 *  - accentColor:       Button accent colour (default: MeetForge green)
 */
const BentoDigHole = ({
  fillColor = '#18181B',
  brushSize = 50,
  showRevealButton = false,
  accentColor = '#5E8056',
}) => {
  const canvasRef = useRef(null);
  const lastPos = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);

  // Delay showing the button so it doesn't pop immediately
  useEffect(() => {
    if (!showRevealButton) return;
    const t = setTimeout(() => setBtnVisible(true), 1500);
    return () => clearTimeout(t);
  }, [showRevealButton]);

  const revealAll = (e) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRevealed(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const getCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const draw = (e) => {
      e.preventDefault();
      const { x, y } = getCoords(e);
      if (!lastPos.current) {
        lastPos.current = { x, y };
        return;
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      lastPos.current = { x, y };
    };

    const stopDraw = () => { lastPos.current = null; };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    resize();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseleave', stopDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDraw);
    };
  }, [fillColor, brushSize]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-30 dig-hole-cursor"
        style={{ touchAction: 'none' }}
      />

      {/* Lazy reveal button — sits above the canvas */}
      {showRevealButton && !revealed && (
        <button
          onClick={revealAll}
          className={`absolute bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm transition-all duration-500 dig-hole-reveal-btn ${
            btnVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          style={{
            borderColor: `${accentColor}60`,
            color: accentColor,
            background: `${accentColor}18`,
          }}
        >
          <span>😴</span> Reveal
        </button>
      )}
    </>
  );
};

export default BentoDigHole;
