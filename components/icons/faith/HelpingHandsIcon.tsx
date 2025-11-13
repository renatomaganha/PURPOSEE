import React from 'react';

interface IconProps {
  className?: string;
}

export const HelpingHandsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path fill="#a5f3fc" d="M1 14.27l3.83 2.13C6.43 17.18 8 18.5 8 20.33V22h8v-1.67c0-1.83 1.57-3.15 3.17-2.4l3.83-2.13C21.89 12.91 21.03 12 20 12h-2.2L12 6.4L6.2 12H4c-1.03 0-1.89.91-1 2.27z" />
      <path fill="#fde047" d="M23 10c0-2.79-1.64-5.29-4.06-6.39C16.89 2.5 14.54 2 12 2S7.11 2.5 5.06 3.61C2.64 4.71 1 7.21 1 10h22z" />
    </svg>
);