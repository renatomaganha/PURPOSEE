import React from 'react';

interface IconProps {
  className?: string;
}

export const RuFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" className={className}>
        <rect width="9" height="3" y="3" fill="#d52b1e"/>
        <rect width="9" height="2" y="2" fill="#0039a6"/>
        <rect width="9" height="2" fill="#fff"/>
    </svg>
);