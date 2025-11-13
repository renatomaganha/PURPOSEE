import React from 'react';

interface IconProps {
  className?: string;
}

export const GardeningIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path d="M22 9c0-1.1-.9-2-2-2h-1V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H9V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v3H0v2h1v11h22V11h1V9h-2zm-2 9H4V9h16v9z" fill="#a16207"/>
        <path d="M12 10c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z" fill="#4ade80"/>
        <path d="M7.75 14.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm8.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zM12 14.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" fill="#22c55e"/>
    </svg>
);