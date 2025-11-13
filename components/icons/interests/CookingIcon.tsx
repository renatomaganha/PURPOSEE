import React from 'react';

interface IconProps {
  className?: string;
}

export const CookingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M12.38 2.37c.33-.24.78-.24 1.11 0l3.99 2.87c.39.28.62.75.62 1.25V9h-3.32a.5.5 0 01-.4-.8L16.2 5.4a.5.5 0 00-.8-.6L12 7.7V2.5c0-.07 0-.13.01-.2l.02-.13zm-1.01 0c.01.07.01.13.01.2v5.2L8.01 4.8a.5.5 0 00-.8.6l1.82 2.8a.5.5 0 01-.4.8H5.3V6.49c0-.5.23-.97.62-1.25l3.99-2.87zM4.27 10l-.13 8.35c-.02.89.66 1.65 1.55 1.65H18c.96 0 1.64-.81 1.55-1.75L19.5 10h-15z" fill="#fb923c"/>
      <path d="M12.38 2.37c.33-.24.78-.24 1.11 0l3.99 2.87c.39.28.62.75.62 1.25V9h-9.3V6.49c0-.5.23-.97.62-1.25l3.99-2.87z" fill="#f9fafb"/>
    </svg>
);