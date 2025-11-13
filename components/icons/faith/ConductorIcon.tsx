import React from 'react';

interface IconProps {
  className?: string;
}

export const ConductorIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="conductor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e9dc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <path d="M20.4 4.6a.5.5 0 0 0-.7-.7L3.6 20.4a.5.5 0 0 0 .7.7L20.4 4.6z" fill="url(#conductor-grad)" />
      <circle cx="3" cy="21" r="2" fill="#d97706" />
    </svg>
);