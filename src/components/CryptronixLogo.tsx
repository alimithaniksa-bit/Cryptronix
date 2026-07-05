import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function CryptronixLogo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_0_12px_rgba(0,240,255,0.55)]`}
    >
      <defs>
        {/* Glowing Neon Cyan-Blue Gradients */}
        <linearGradient id="logo-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
        
        <linearGradient id="logo-grad-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00FFCC" />
          <stop offset="50%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#9d4edd" />
        </linearGradient>

        {/* High-tech glow filter */}
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Hexagonal Shield Layer */}
      <polygon
        points="50,5 90,28 90,72 50,95 10,72 10,28"
        stroke="url(#logo-grad-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Internal Core Tech Rings */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="url(#logo-grad-primary)"
        strokeWidth="1"
        strokeDasharray="6 4 2 4"
        opacity="0.75"
        className="animate-[spin_40s_linear_infinite]"
      />

      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="#00F0FF"
        strokeWidth="0.5"
        strokeDasharray="1 10"
        opacity="0.9"
        className="animate-[spin_12s_linear_infinite]"
      />

      {/* Monogram Glyph (Interlocking 'C' & 'X') */}
      {/* Letter C representing Cryptronix background curve */}
      <path
        d="M 68,30 C 58,20 42,20 32,30 C 22,40 22,56 32,66 C 42,76 58,76 68,66"
        stroke="url(#logo-grad-primary)"
        strokeWidth="7"
        strokeLinecap="round"
        filter="url(#neon-glow)"
      />

      {/* Crossing Cybernetic Bars representing the X */}
      <path
        d="M 38,36 L 72,70"
        stroke="url(#logo-grad-secondary)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#neon-glow)"
      />

      <path
        d="M 72,36 L 56,52"
        stroke="url(#logo-grad-secondary)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#neon-glow)"
      />

      <path
        d="M 44,64 L 38,70"
        stroke="url(#logo-grad-secondary)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#neon-glow)"
      />

      {/* Core Energy Intersection Node */}
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="#FFFFFF"
        filter="url(#neon-glow)"
      />
    </svg>
  );
}
