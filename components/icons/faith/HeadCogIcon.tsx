import React from 'react';

interface IconProps {
  className?: string;
}

export const HeadCogIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path fill="#a5f3fc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5v7z" />
      <path fill="#0ea5e9" d="M12 5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5V5z" />
      <path fill="#fde047" d="M15.5 8.5c1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5V8.5z" />
      <path fill="#fbbf24" d="M12 12c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5c-1.93 0-3.5 1.57-3.5 3.5z" />
    </svg>
);