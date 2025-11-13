import React from 'react';

interface IconProps {
  className?: string;
}

export const WorldHeartIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10" fill="#a5f3fc" />
        <path d="M12 2C9.17 2 6.62 3.19 4.93 5.07C6.44 4.19 8.19 3.75 10 3.75c3.54 0 6.55 2.31 7.6 5.5H19.5c.34-.65.5-1.37.5-2.12C20 4.19 16.42 2 12 2z" fill="#4ade80" />
        <path d="M2.43 12.55C2.16 11.75 2 10.9 2 10c0-2.31 1.05-4.4 2.73-5.8C3.12 6.09 2.25 8.1 2.25 10.25c0 .9.16 1.75.43 2.55l-.25-.25z" fill="#4ade80" />
        <path fill="#f43f5e" d="M18 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-6-2h8v2h-8z" />
    </svg>
);