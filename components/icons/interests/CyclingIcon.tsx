import React from 'react';

interface IconProps {
  className?: string;
}

export const CyclingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="4" r="2" fill="#ef4444" />
      <circle cx="6" cy="14" r="2" fill="#3b82f6" />
      <circle cx="18" cy="14" r="2" fill="#3b82f6" />
      <path d="M15.58 12.87c.2-.72.1-1.49-.29-2.16l-2-3c-.39-.58-1.06-.92-1.78-.92h-1.02c-.72 0-1.39.33-1.79.91l-1.91 2.86c-.4.6-.51 1.37-.29 2.1l1.19 3.96L8.4 17.1c-.59.59-1.35.9-2.15.9h-.5c-.28 0-.5.22-.5.5s.22.5.5.5h.5c1.38 0 2.63-.56 3.54-1.46l2.12-2.12 1.19 3.96L14 18.5c-.59.59-1.35.9-2.15.9h-1.59c-.28 0-.5.22-.5.5s.22.5.5.5h1.59c1.38 0 2.63-.56 3.54-1.46L18 14.59l1.19 3.96c.22.73.9 1.25 1.69 1.25h.62c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-.62c-.28 0-.52-.18-.62-.44l-2.09-6.93z" fill="#4ade80" />
    </svg>
);