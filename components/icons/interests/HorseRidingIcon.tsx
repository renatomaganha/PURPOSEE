import React from 'react';

interface IconProps {
  className?: string;
}

export const HorseRidingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm0-4h-2V6h2v8z" fill="#a16207"/>
      <path d="M13 18h-2v-2h2v2zm0-4h-2V6h2v8z" fill="#ca8a04"/>
    </svg>
);