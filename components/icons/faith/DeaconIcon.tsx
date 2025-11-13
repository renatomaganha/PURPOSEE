import React from 'react';

interface IconProps {
  className?: string;
}

export const DeaconIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path fill="#a67b5b" d="M12 2C8.13 2 5 5.13 5 9c0 1.67.57 3.2 1.52 4.42L5 17h14l-1.52-3.58C18.43 12.2 19 10.67 19 9c0-3.87-3.13-7-7-7zm-4 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      <path fill="#60a5fa" d="M12 20.5c-4 0-4-1.79-4-4h8c0 2.21 0 4-4 4z" />
    </svg>
);