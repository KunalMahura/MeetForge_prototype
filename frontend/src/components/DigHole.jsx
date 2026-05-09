import React, { useState, useEffect, useRef } from 'react';

// A moody, abstract video to reveal underneath the canvas
const DEFAULT_REVEAL_VIDEO = "https://videos.pexels.com/video-files/5086600/5086600-uhd_2560_1440_30fps.mp4";

const DigHole = ({
  revealVideo = DEFAULT_REVEAL_VIDEO,
  heading = ["DIG", "DEEP"],
  subtext = "Move your cursor to uncover what lies beneath the surface.",
  accentColor = "#5E8056", // MeetForge accent-green
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const lastPos = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealPercent, setRevealPercent] = useState(0);
  const [showRevealBtn, setShowRevealBtn] = useState(false);
  const rafId = useRef(null);

  // Show the lazy button after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowRevealBtn(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRevealPercent(100);
    setIsRevealed(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Fill with the overlay color (matches MeetForge surface)
      ctx.fillStyle = '#18181B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const getCoords = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const calculateRevealPercent = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      const total = pixels.length / 4;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }
      return (transparent / total) * 100;
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
      ctx.lineWidth = 80;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPos.current = { x, y };

      // Throttled percentage check
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          const pct = calculateRevealPercent();
          setRevealPercent(Math.round(pct));
          if (pct > 60 && !isRevealed) {
            setIsRevealed(true);
          }
          rafId.current = null;
        });
      }
    };

    const stopDraw = () => {
      lastPos.current = null;
    };

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
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isRevealed]);

  return (
    <section className="relative max-w-7xl mx-auto px-6 pb-24">
      {/* Section label */}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>
          Interactive
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-2">
          Scratch to discover
        </h2>
        <p className="text-ink-muted text-base max-w-md mx-auto">
          {subtext}
        </p>
        {/* Lazy reveal button */}
        <button
          onClick={revealAll}
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-500 ${
            showRevealBtn && revealPercent < 100
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          style={{
            borderColor: accentColor,
            color: accentColor,
            background: 'transparent',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = accentColor; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = accentColor; }}
        >
          <span>😴</span> I'm too lazy, just show me
        </button>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video md:aspect-[21/9] rounded-4xl overflow-hidden group"
        style={{ touchAction: 'none' }}
      >
        {/* Background video (revealed when you "dig") */}
        <video
          src={revealVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay on video for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* The canvas that you "erase" */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 dig-hole-cursor"
        />

        {/* Title text — always visible */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 pointer-events-none">
          <h3 className="dig-hole-title flex flex-col leading-[0.85] font-black uppercase text-white tracking-tighter">
            {heading.map((word, i) => (
              <span key={i} className="dig-hole-title-line" style={{ animationDelay: `${i * 0.15}s` }}>
                {word}
              </span>
            ))}
          </h3>
        </div>

        {/* Reveal percentage indicator */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 pointer-events-none">
          <div className="dig-hole-badge">
            <span className="text-xs font-bold text-white/90 tracking-wide">
              {revealPercent}% revealed
            </span>
          </div>
        </div>

        {/* Hint overlay — fades out after first interaction */}
        <div
          className={`absolute inset-0 z-15 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
            revealPercent > 2 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="dig-hole-hint">
            <svg className="w-6 h-6 text-white/80 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="text-sm font-semibold text-white/80">
              Drag to dig
            </span>
          </div>
        </div>


      </div>
    </section>
  );
};

export default DigHole;
