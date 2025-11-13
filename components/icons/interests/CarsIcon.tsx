import React from 'react';

interface IconProps {
  className?: string;
}

export const CarsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5z" fill="#ef4444"/>
        <circle cx="6.5" cy="14.5" r="1.5" fill="#444"/>
        <circle cx="17.5" cy="14.5" r="1.5" fill="#444"/>
    </svg>
);