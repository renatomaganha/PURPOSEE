import React from 'react';

interface IconProps {
  className?: string;
}

export const PresbyterIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="presbyter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#8c5a3b" />
        </linearGradient>
      </defs>
      <path d="M12 2C9.24 2 7 4.24 7 7c0 2.25 1.57 4.14 3.69 4.8.3.1.6.19.91.25V22h2V11.95c.31-.06.61-.15.91-.25C15.43 11.14 17 9.25 17 7c0-2.76-2.24-5-5-5z" fill="url(#presbyter-grad)" />
    </svg>
);