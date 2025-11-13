import React from 'react';

interface IconProps {
  className?: string;
}

export const VideoCameraSolidIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 9.19a.75.75 0 00-1.06 0l-3.32 3.32a.75.75 0 000 1.06l3.32 3.32a.75.75 0 101.06-1.06l-2.79-2.79 2.79-2.79a.75.75 0 000-1.06z" />
    </svg>
);
