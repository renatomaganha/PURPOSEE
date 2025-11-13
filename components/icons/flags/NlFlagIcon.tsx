import React from 'react';

interface IconProps {
  className?: string;
}

export const NlFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" className={className}>
        <rect width="9" height="6" fill="#21468B" />
        <rect width="9" height="4" fill="#fff" />
        <rect width="9" height="2" fill="#AE1C28" />
    </svg>
);