import React from 'react';

interface IconProps {
  className?: string;
}

export const KrFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" className={className}>
        <path fill="#fff" d="M0 0h30v20H0z"/>
        <circle cx="15" cy="10" r="5" fill="#CD2E3A"/>
        <path d="M15 10a5 5 0 0 0 0-10z" fill="#0047A0"/>
        <g fill="#000">
            <path d="M5 5h2v2H5zM5 8h2v2H5zM5 11h2v2H5z"/>
            <path d="M8 5h2v2H8zm0 8h2v2H8z"/>
            <path d="M23 5h2v2h-2zm0 3h2v2h-2zm0 3h2v2h-2z"/>
            <path d="M20 5h2v2h-2zm0 8h2v2h-2z"/>
        </g>
    </svg>
);