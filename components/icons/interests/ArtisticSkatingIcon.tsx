import React from 'react';

interface IconProps {
  className?: string;
}

export const ArtisticSkatingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fill="#818cf8" d="M7 20.5H2V22h5v-1.5zM10.4 20.5l-1-5-1.5 1.5.5 5h2z" />
      <path fill="#c4b5fd" d="M19.98 11.2c-.35-.61-.78-1.16-1.28-1.66l-2.43-2.43c-.45-.45-1.04-.7-1.69-.7H9.28l.6 3h1.84l4.28 4.28c.39.39.9.58 1.42.58.51 0 1.02-.19 1.41-.59l2.83-2.83c.78-.78.78-2.05 0-2.83z" />
      <path fill="#f472b6" d="M7.5 5C5.57 5 4 6.57 4 8.5S5.57 12 7.5 12s3.5-1.57 3.5-3.5S9.43 5 7.5 5zm-1 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);