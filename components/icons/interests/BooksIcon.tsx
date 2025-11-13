import React from 'react';

interface IconProps {
  className?: string;
}

export const BooksIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#3b82f6"/>
        <path d="M6 4h5v8l-2.5-1.5L6 12V4z" fill="#fde047"/>
    </svg>
);