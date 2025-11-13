import React from 'react';

interface IconProps {
  className?: string;
}

export const FamilyIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="9.5" cy="8" r="2.5" fill="#fde047" />
      <path d="M9.5 11c-1.67 0-5 1.12-5 3.33V16h10v-1.67C14.5 12.12 11.17 11 9.5 11z" fill="#fde047" />
      <circle cx="14.5" cy="8" r="2.5" fill="#a5f3fc" />
      <path d="M14.5 11c-1.67 0-5 1.12-5 3.33V16h10v-1.67C19.5 12.12 16.17 11 14.5 11z" fill="#a5f3fc" />
      <circle cx="12" cy="15.5" r="2" fill="#dcfce7" />
    </svg>
);