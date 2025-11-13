import React from 'react';

interface IconProps {
  className?: string;
}

export const PriestIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="8" r="4" fill="#fde047" />
      <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#a5f3fc" />
      <path d="M11 13h2v2h-2z" fill="#fff" />
    </svg>
);