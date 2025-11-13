import React from 'react';

interface IconProps {
  className?: string;
}

export const PrayingHandsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <defs>
            <linearGradient id="hands-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
        </defs>
        <path d="M8.5 4A5.5 5.5 0 003 9.5V20h5V9.5A5.5 5.5 0 008.5 4z" fill="url(#hands-grad)" transform="rotate(-15 12 12)" />
        <path d="M15.5 4A5.5 5.5 0 0121 9.5V20h-5V9.5A5.5 5.5 0 0115.5 4z" fill="url(#hands-grad)" transform="rotate(15 12 12)" />
    </svg>
);