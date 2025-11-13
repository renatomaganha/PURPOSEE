import React from 'react';

interface IconProps {
  className?: string;
}

export const DeFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className={className}>
        <rect width="5" height="3"/>
        <rect width="5" height="2" fill="#D00"/>
        <rect width="5" height="1" fill="#FFCE00"/>
    </svg>
);