import React from 'react';

interface IconProps {
  className?: string;
}

export const FaceSmileIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5h.01M15 10.5h.01M9.75 14.25c.5-1 1.5-1.5 2.25-1.5s1.75.5 2.25 1.5" />
    </svg>
);