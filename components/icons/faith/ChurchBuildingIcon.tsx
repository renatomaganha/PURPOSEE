import React from 'react';

interface IconProps {
  className?: string;
}

export const ChurchBuildingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path fill="#FFD700" d="M11 5h2v3h-2zM10 2h4v3h-4z" />
      <path fill="#f3e9dc" d="M18 7L12 2 6 7v13h12V7z" />
      <path fill="#d97706" d="M12 2l-6 5h12L12 2z" />
      <path fill="#a67b5b" d="M8 20v-7h8v7H8zm2-5h4v4h-4v-4z" />
      <path fill="#e2e8f0" d="M4 19h16v1H4z" />
      <path fill="#a67b5b" d="M2 18h20v2H2z" />
    </svg>
);