import React from 'react';

interface IconProps {
  className?: string;
}

export const HikingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path d="M16.5 3.75a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5h-6a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5h6z" fill="#a16207" />
        <path d="M15 6.75H9v10.5h6V6.75z" fill="#ca8a04"/>
        <path d="M6 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h.75a.75.75 0 000-1.5H6a1.5 1.5 0 01-1.5-1.5v-10.5A1.5 1.5 0 016 6.75h.75a.75.75 0 000-1.5H6z" fill="#854d0e"/>
    </svg>
);