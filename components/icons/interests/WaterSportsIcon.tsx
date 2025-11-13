import React from 'react';

interface IconProps {
  className?: string;
}

export const WaterSportsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#0ea5e9"/>
      <path d="M14.22 15.01c-1.33.62-2.82.62-4.15 0C8.74 14.39 8 13.25 8 12c0-1.25.74-2.39 2.07-3.01 1.33-.62 2.82-.62 4.15 0C15.26 9.61 16 10.75 16 12c0 1.25-.74 2.39-2.07 3.01z" fill="#f97316"/>
    </svg>
);