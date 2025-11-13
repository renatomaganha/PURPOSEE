
import React from 'react';

interface IconProps {
  className?: string;
}

export const MegaphoneIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 12h-3a7.5 7.5 0 00-7.5-7.5V6m3 10.5v.75a3.375 3.375 0 01-3.375 3.375h-1.5c-.563 0-1.081-.22-1.472-.612l-1.472-1.472a1.081 1.081 0 010-1.528l1.472-1.472c.39-.39.91-.611 1.472-.611h1.5a3.375 3.375 0 013.375 3.375z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75v10.5" />
    </svg>
);