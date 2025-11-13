import React from 'react';

interface IconProps {
  className?: string;
}

export const RunningIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.49 5.49c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.91L12 15.49l-2.51-2.51c-.63-.63-.18-1.71.71-1.71H14v-2H9.31c-1.79 0-2.85-2.14-1.64-3.36l1.24-1.24c.2-.2.2-.51 0-.71s-.51-.2-.71 0l-1.42 1.42c-1.88 1.88-1.36 5.08.97 6.36l2.13 1.22L9 20h2.51l.8-2.4c.18-.55.77-.8 1.3-.61.54.18.81.79.62 1.32L13 22h7v-2h-3.32z" fill="#0ea5e9"/>
    </svg>
);