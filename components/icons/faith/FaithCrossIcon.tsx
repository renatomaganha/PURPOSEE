import React from 'react';

interface IconProps {
  className?: string;
}

export const FaithCrossIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="cross-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <path d="M14 2H10V9H2V13H10V22H14V13H22V9H14V2Z" fill="url(#cross-grad)" />
      <path d="M13 3H11V9H3V11H11V21H13V11H21V9H13V3Z" fill="#000" opacity="0.1" />
    </svg>
);