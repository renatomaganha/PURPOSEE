
import React from 'react';

interface IconProps {
  className?: string;
}

export const PaperClipIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 0119.5 7.372l-10.94 10.94a2.25 2.25 0 01-3.182-3.182l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a.75.75 0 001.06 1.06l10.94-10.94a1.875 1.875 0 10-2.652-2.652L6.83 12.739a6 6 0 108.486 8.486l7.693-7.693a.75.75 0 011.06-1.06z" />
    </svg>
);
