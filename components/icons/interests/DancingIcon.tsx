import React from 'react';

interface IconProps {
  className?: string;
}

export const DancingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="6" cy="12" r="2" fill="#fb7185"/>
      <path d="M12.89 11.1c-1.78-1.78-4.68-1.78-6.46 0l-1.06-1.06c2.56-2.56 6.72-2.56 9.28 0l-1.76 1.06zM15.02 8.98l1.06 1.06c-1.78 1.78-4.68 1.78-6.46 0L8.56 8.98c2.56-2.56 6.72-2.56 9.28 0l-2.82-1.06z" fill="#f472b6"/>
      <path d="M14 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#fb7185"/>
      <path d="M21.36 10.16c-2.31-.86-4.88-.04-6.32 1.41l-2.09-2.09c-.94-.94-2.19-1.48-3.54-1.48H9c-1.1 0-2 .9-2 2v.14c0 .87.31 1.66.84 2.27L10 16.59V22h2v-5.41l2.12-2.12c2.4-2.4 5.86-2.95 8.88-1.48.5-.18.84-.66.6-1.17l-.84-1.63z" fill="#f9a8d4" />
    </svg>
);