import React from 'react';

interface IconProps {
  className?: string;
}

export const RoFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className={className}>
        <path d="M0 0h3v2H0z" fill="#CE1126"/>
        <path d="M0 0h2v2H0z" fill="#FCD116"/>
        <path d="M0 0h1v2H0z" fill="#002B7F"/>
    </svg>
);