import React from 'react';

interface IconProps {
  className?: string;
}

export const IlFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 11" className={className}>
        <path fill="#fff" d="M0 0h16v11H0z"/>
        <path fill="#0038b8" d="M0 0h16v1H0zm0 10h16v1H0z"/>
        <path fill="none" stroke="#0038b8" strokeWidth=".4" d="m8 3.5 1.5 3-1.5 3-1.5-3z"/>
        <path fill="none" stroke="#0038b8" strokeWidth=".4" d="m8 7.5 1.5-3-1.5-3-1.5 3z"/>
    </svg>
);