import React from 'react';

interface IconProps {
  className?: string;
}

export const DoveIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.378 1.602a.75.75 0 00-.756 0L3 7.252v4.998l6.249-4.166.002.001.002.001.002.001a.753.753 0 01.492 0l.003-.001.002-.001.001-.001L15.999 7.5v1.43l-3.75 2.501a.75.75 0 10.752 1.25l4.5-3.001a.75.75 0 00-.002-1.25L12.378 1.602z" />
        <path d="M21 9.335l-8.998 6.002a1.5 1.5 0 01-1.003 0L3 9.335V18a.75.75 0 00.75.75h16.5A.75.75 0 0021 18V9.335z" />
    </svg>
);