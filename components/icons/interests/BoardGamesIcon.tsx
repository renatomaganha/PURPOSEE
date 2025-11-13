import React from 'react';

interface IconProps {
  className?: string;
}

export const BoardGamesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fill="#a3a3a3" d="M18 21H4V7H2v14c0 1.1.9 2 2 2h14v-2zm-8-2h2v-2h-2v2zm-4 0h2v-2H6v2zm-4-4h2v-2H2v2zm0 4h2v-2H2v2zm0-8h2v-2H2v2zm4 4h2v-2H6v2zm0-4h2v-2H6v2zm0-4h2v-2H6v2zm4 4h2v-2h-2v2zm0-4h2v-2h-2v2zm4-4H2V3c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2z"/>
      <circle cx="20" cy="7" r="1.5" fill="#f43f5e"/>
      <path d="M14 11h8v2h-8z" fill="#3b82f6"/>
    </svg>
);