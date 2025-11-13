import React from 'react';

interface IconProps {
  className?: string;
}

export const SelfDevelopmentIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z" fill="#d1d5db" />
        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#4ade80"/>
        <path d="m9.5 14.5-2-2h2zm0-3.5-2-2h2zm0-3.5-2-2h2zm3.5 7-2-2h2zm0-3.5-2-2h2zm0-3.5-2-2h2zm3.5 7-2-2h2zm0-3.5-2-2h2z" fill="#16a34a"/>
    </svg>
);