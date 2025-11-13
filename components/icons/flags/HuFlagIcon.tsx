import React from 'react';

interface IconProps {
  className?: string;
}

export const HuFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" className={className}>
        <rect fill="#436F4D" width="600" height="300"/>
        <rect fill="#FFF" width="600" height="200"/>
        <rect fill="#CD2A3E" width="600" height="100"/>
    </svg>
);