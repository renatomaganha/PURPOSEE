import React from 'react';

interface IconProps {
  className?: string;
}

export const TechnologyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#0ea5e9"/>
      <ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(45 12 12)" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="8" ry="3" transform="rotate(-45 12 12)" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2" fill="#eab308"/>
    </svg>
);