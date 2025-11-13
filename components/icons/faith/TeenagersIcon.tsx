import React from 'react';

interface IconProps {
  className?: string;
}

export const TeenagersIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path fill="#fbbf24" d="M17.5 10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-11 0c.83 0 1.5-.67 1.5-1.5S7.33 7.5 6.5 7.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
      <path fill="#60a5fa" d="M12 14c-2.33 0-4.32 1.45-5.12 3.5h10.24c-.8-2.05-2.79-3.5-5.12-3.5z" />
      <path fill="#f43f5e" d="M21 4H3C2.45 4 2 4.45 2 5v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM5 18c.6-.9 1.45-1.62 2.5-2h9c1.05.38 1.9.99 2.5 1.83V6h-14v12z" />
    </svg>
);