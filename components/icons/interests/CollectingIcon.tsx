import React from 'react';

interface IconProps {
  className?: string;
}

export const CollectingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path fill="#818cf8" d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 7h-3v3h-2v-3H9v-2h3V8h2v3h3v2z"/>
        <path fill="#c4b5fd" d="M12 11.85l-6-3.8V4h12v4.05l-6 3.8z"/>
    </svg>
);