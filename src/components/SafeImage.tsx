import React, { useState } from 'react';
import { Orbit } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1B33] via-[#0B1221] to-[#131C3A] text-cyan-300/80 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Orbit className="w-7 h-7 mb-1.5 opacity-80" />
        {fallbackTitle && (
          <span className="text-xs font-medium text-slate-300 line-clamp-1">{fallbackTitle}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
