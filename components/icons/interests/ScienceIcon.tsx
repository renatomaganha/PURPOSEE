import React from 'react';

interface IconProps {
  className?: string;
}

export const ScienceIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path d="M18 4h-2v7.92c1.15.56 2 1.73 2 3.08 0 1.93-1.57 3.5-3.5 3.5S11 16.93 11 15c0-1.35.85-2.52 2-3.08V4H6.83l2 2H11v3.17c-1.45.64-2.5 1.99-2.5 3.58 0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.59-1.05-2.94-2.5-3.58V8h2.17l2-2H18V4z" fill="#a78bfa" />
    </svg>
);