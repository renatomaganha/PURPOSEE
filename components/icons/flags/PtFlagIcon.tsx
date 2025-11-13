import React from 'react';

interface IconProps {
  className?: string;
}

export const PtFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={className}>
        <rect width="360" height="600" fill="#006600"/>
        <rect width="540" height="600" x="360" fill="#ff0000"/>
        <circle cx="360" cy="300" r="150" fill="#ff0"/>
        <path d="m360 210-60 180h120zm0 18v102.4l37.2-113.6h-74.4z" fill="#fff" stroke="#c00" strokeWidth="12"/>
    </svg>
);