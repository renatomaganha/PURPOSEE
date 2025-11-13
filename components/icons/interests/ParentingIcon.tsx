import React from 'react';

interface IconProps {
  className?: string;
}

export const ParentingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M10 13c2.67 0 8 1.34 8 4v3H2v-3c0-2.66 5.33-4 8-4z" fill="#60a5fa"/>
      <path d="M22.53 10.64c.32.74.16 1.61-.4 2.15l-2.72 2.72c-.78.78-2.05.78-2.83 0l-1.35-1.35c-.78-.78-.78-2.05 0-2.83L19.5 7.07c.32-.32.73-.5 1.17-.5.31 0 .61.09.87.26.74.5.99 1.49.59 2.31z" fill="#facc15" />
      <path d="M10 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="#fbbf24" />
    </svg>
);