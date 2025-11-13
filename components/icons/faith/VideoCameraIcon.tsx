import React from 'react';

interface IconProps {
  className?: string;
}

export const VideoCameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path fill="#60a5fa" d="M17 10.5V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z"/>
        <circle cx="14" cy="12" r="2" fill="#fff"/>
        <circle cx="5" cy="8" r="1" fill="#f43f5e"/>
    </svg>
);