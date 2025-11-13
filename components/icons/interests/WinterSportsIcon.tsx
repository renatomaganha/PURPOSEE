import React from 'react';

interface IconProps {
  className?: string;
}

export const WinterSportsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M22 11h-2V9h-2v2h-2V9h-2v2h-2V9H8v2H6V9H4v2H2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2z" fill="#a5f3fc"/>
      <path d="M12 4L9.17 6.83 12 9.66 14.83 6.83 12 4zm0 16l2.83-2.83L12 14.34 9.17 17.17 12 20zm-8-8l2.83-2.83L4 9.17V12zm16 0l-2.83-2.83L20 9.17V12z" fill="#60a5fa"/>
    </svg>
);