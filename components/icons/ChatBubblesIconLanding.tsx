import React from 'react';

interface IconProps {
  className?: string;
}

export const ChatBubblesIconLanding: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 12.75v-2.25c0-2.14-1.626-3.9-3.75-3.9V4.5A2.25 2.25 0 0014.25 2.25H6.75A2.25 2.25 0 004.5 4.5v8.25c0 2.14 1.626 3.9 3.75 3.9h3.75a3.75 3.75 0 013.75 3.75V21l-3.75-3.75H6.75A2.25 2.25 0 014.5 15v-2.25" />
    </svg>
);