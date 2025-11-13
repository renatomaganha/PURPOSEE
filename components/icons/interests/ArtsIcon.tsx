import React from 'react';

interface IconProps {
  className?: string;
}

export const ArtsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path fill="#93c5fd" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-1.21-1.33-2-3.13-2-5.12 0-2.31 1.05-4.34 2.68-5.63C14.54 7.22 15 6.44 15 5.5 15 4.12 13.65 3 12 3z"/>
        <circle cx="13.5" cy="7.5" r="1.5" fill="#f43f5e" />
        <circle cx="6" cy="11" r="1.5" fill="#facc15" />
        <circle cx="12" cy="17" r="1.5" fill="#4ade80" />
    </svg>
);