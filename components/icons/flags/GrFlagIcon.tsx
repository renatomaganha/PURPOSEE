import React from 'react';

interface IconProps {
  className?: string;
}

export const GrFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 18" className={className}>
        <path fill="#0d5eaf" d="M0 0h27v18H0z"/>
        <path stroke="#fff" strokeWidth="2" d="M0 2h27M0 4h27M0 6h27M0 8h27m-17 2H0v2h10v-2zm0 2H0v2h10v-2zm0 2H0v2h10v-2z"/>
        <path fill="#fff" d="M0 0h10v10H0z"/>
        <path fill="#0d5eaf" d="M4 0h2v10H4zM0 4h10v2H0z"/>
    </svg>
);