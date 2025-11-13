import React from 'react';

interface IconProps {
  className?: string;
}

export const BowlingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M12.5 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#f3f4f6"/>
      <path d="M15 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#f3f4f6"/>
      <path d="M4 18c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" fill="#f43f5e"/>
      <circle cx="8" cy="18" r="1" fill="#fff" />
      <circle cx="6.5" cy="19" r=".5" fill="#fff" />
      <circle cx="9.5" cy="19" r=".5" fill="#fff" />
    </svg>
);