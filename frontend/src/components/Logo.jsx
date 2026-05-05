import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`group flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      {/* Icon Container */}
      <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-accent-green/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Main Icon Box */}
        <div className="relative w-full h-full bg-accent-green rounded-xl flex items-center justify-center shadow-lg shadow-accent-green/20 overflow-hidden">
          {/* Animated Sparks (hidden by default) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:animate-spark"
                style={{
                  top: '50%',
                  left: '50%',
                  '--tx': `${(Math.random() - 0.5) * 40}px`,
                  '--ty': `${(Math.random() - 0.5) * 40}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* SVG Icon: Hammer + Brackets */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-5 h-5 text-white relative z-10"
          >
            {/* Brackets */}
            <path d="M7 8l-4 4 4 4" className="group-hover:translate-x-[-1px] transition-transform duration-300" />
            <path d="M17 16l4-4-4-4" className="group-hover:translate-x-[1px] transition-transform duration-300" />
            
            {/* Hammer / Forge Tool */}
            <path 
              d="M12 4v16" 
              className="group-hover:rotate-[15deg] group-hover:origin-bottom transition-transform duration-300" 
            />
            <path 
              d="M9 4h6" 
              className="group-hover:rotate-[15deg] group-hover:origin-center transition-transform duration-300"
            />
          </svg>
          
          {/* Reflection Sweep */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </div>
      </div>

      {/* Text Branding */}
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tighter text-ink leading-none relative">
          Meet
          <span className="text-accent-green group-hover:text-accent-orange transition-colors duration-500">Forge</span>
          
          {/* Text Underline Forge Line */}
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-green transition-all duration-500 group-hover:w-full" />
        </span>
        <span className="text-[10px] font-bold text-ink-faint tracking-widest uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-1 group-hover:translate-y-0">
          Technical Excellence
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spark {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .animate-spark {
          animation: spark 0.6s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}} />
    </div>
  );
};

export default Logo;
