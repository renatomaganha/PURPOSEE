import React from 'react';

interface IconProps {
  className?: string;
}

export const BibleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="bible-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8D5A3B" />
          <stop offset="100%" stopColor="#5D3A1F" />
        </linearGradient>
      </defs>
      <path fill="url(#bible-grad)" d="M19.5 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13.5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      <path fill="#F3E9DC" d="M4 4v16c0 .55-.45 1-1 1s-1-.45-1-1V4c0-1.1.9-2 2-2h1c-.55 0-1 .45-1 1z" />
      <rect x="7" y="5" width="2" height="14" fill="#FDEBD0" />
      <path fill="#FFD700" d="M13 11V8h2v3h3v2h-3v3h-2v-3H8v-2h5z" />
    </svg>
);