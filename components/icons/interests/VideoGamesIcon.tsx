import React from 'react';

interface IconProps {
  className?: string;
}

export const VideoGamesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" fill="#4f46e5"/>
      <path d="M11.5 13H8v3H6v-3H3v-2h3V8h2v3h3v2z" fill="#a5f3fc"/>
      <circle cx="15.5" cy="13.5" r="1.5" fill="#f43f5e"/>
      <circle cx="18.5" cy="10.5" r="1.5" fill="#facc15"/>
    </svg>
);