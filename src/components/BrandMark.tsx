import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  return (
    <div
      className={`${dim} rounded-xl bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-indigo-600/30 border border-cyan-400/30 flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="w-5 h-5 text-cyan-300" fill="none">
        <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45" />
        <ellipse
          cx="16"
          cy="16"
          rx="13.5"
          ry="5.5"
          transform="rotate(-24 16 16)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 11.2c1.25-1.6 3.7-1.45 4.75.25.9 1.45.42 3.55-1.2 4.85L16 19.3l-3.55-3c-1.62-1.3-2.1-3.4-1.2-4.85 1.05-1.7 3.5-1.85 4.75-.25Z"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
};
