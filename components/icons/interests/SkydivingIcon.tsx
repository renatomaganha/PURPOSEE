import React from 'react';

interface IconProps {
  className?: string;
}

export const SkydivingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#0ea5e9"/>
      <path d="m12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#60a5fa"/>
    </svg>
);