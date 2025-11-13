import React from 'react';

interface IconProps {
  className?: string;
}

export const UaFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={className}>
        <rect width="900" height="300" fill="#005BBB"/>
        <rect width="900" height="300" y="300" fill="#FFD500"/>
    </svg>
);