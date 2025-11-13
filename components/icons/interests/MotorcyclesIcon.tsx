import React from 'react';

interface IconProps {
  className?: string;
}

export const MotorcyclesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fill="#64748b" d="M19.43 12.63c-1.3-1.42-3.26-2.32-5.43-2.32h-1c-1.1 0-2 .9-2 2v2h2.5c2.31 0 4.23 1.67 4.78 3.86l.22.9h2.32c.69 0 1.21-.75.87-1.37z"/>
      <circle fill="#475569" cx="6.5" cy="17.5" r="2.5"/>
      <circle fill="#475569" cx="16.5" cy="17.5" r="2.5"/>
      <path fill="#f87171" d="M16 6.34c0-2.32-2.24-4.58-4.34-4.22-1.12.19-2.07 1.1-2.45 2.2-1.34 3.86.6 6.84 2.79 6.84h1c2.76 0 5-2.24 5-5V6.34z"/>
    </svg>
);