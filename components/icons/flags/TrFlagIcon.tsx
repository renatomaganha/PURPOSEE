import React from 'react';

interface IconProps {
  className?: string;
}

export const TrFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={className}>
        <rect width="900" height="600" fill="#e30a17"/>
        <circle cx="300" cy="300" r="150" fill="#fff"/>
        <circle cx="337.5" cy="300" r="120" fill="#e30a17"/>
        <path d="m425 300 115.6 83.2-71.5-134.6v102.8l-71.5-134.6z" fill="#fff"/>
    </svg>
);