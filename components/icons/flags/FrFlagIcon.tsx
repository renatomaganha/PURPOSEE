import React from 'react';

interface IconProps {
  className?: string;
}

export const FrFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={className}>
        <rect width="900" height="600" fill="#fff"/>
        <rect width="300" height="600" fill="#002654"/>
        <rect width="300" height="600" x="600" fill="#ed2939"/>
    </svg>
);