import React from 'react';

interface IconProps {
  className?: string;
}

export const BrFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" className={className}>
      <rect width="1000" height="700" fill="#009c3b"/>
      <path d="M500 85L845 350 500 615 155 350z" fill="#ffdf00"/>
      <circle cx="500" cy="350" r="175" fill="#002776"/>
    </svg>
);