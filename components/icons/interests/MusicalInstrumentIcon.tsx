import React from 'react';

interface IconProps {
  className?: string;
}

export const MusicalInstrumentIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="m14.53 10.15l-1.57-1.57-6.07 6.07l1.57 1.57l6.07-6.07zm1.8-1.79c.39-.39 1.02-.39 1.41 0l1.41 1.41c.39.39.39 1.02 0 1.41L7.12 21.19a.996.996 0 0 1-1.41 0L2.88 18.36a.996.996 0 0 1 0-1.41L12.9 6.92l3.43 3.43z" fill="#a16207"/>
    </svg>
);