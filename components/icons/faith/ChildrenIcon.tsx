import React from 'react';

interface IconProps {
  className?: string;
}

export const ChildrenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <circle cx="9" cy="8.5" r="2.5" fill="#fde047" />
      <path d="M9 12c-1.67 0-5 1.12-5 3.33V17h10v-1.67C14 13.12 10.67 12 9 12z" fill="#fde047" />
      <circle cx="15" cy="7.5" r="2.5" fill="#a5f3fc" />
      <path d="M15 11c-1.67 0-5 1.12-5 3.33V16h10v-1.67C20 12.12 16.67 11 15 11z" fill="#a5f3fc" />
    </svg>
);