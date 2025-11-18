import React from 'react';

interface IconProps {
  className?: string;
}

export const ArrowUturnRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h10.5A4.5 4.5 0 0118 13.5v0a4.5 4.5 0 01-4.5 4.5H12" />
    </svg>
);