import React from 'react';

interface IconProps {
  className?: string;
}

export const ClimbingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M11 15.5V14h2v1.5c0 .83-.67 1.5-1.5 1.5h-1c-.28 0-.5.22-.5.5s.22.5.5.5h1c1.93 0 3.5-1.57 3.5-3.5V14c0-1.1-.9-2-2-2h-3V4H7v10h2v-4h2v4.5c0 1.93 1.57 3.5 3.5 3.5h1c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-1c-.83 0-1.5-.67-1.5-1.5z" fill="#8b5cf6"/>
      <circle cx="12" cy="4" r="2" fill="#facc15" />
      <rect x="4" y="2" width="2" height="2" rx="1" fill="#a78bfa" />
      <rect x="18" y="10" width="2" height="2" rx="1" fill="#a78bfa" />
      <rect x="16" y="18" width="2" height="2" rx="1" fill="#a78bfa" />
    </svg>
);