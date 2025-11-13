
import React from 'react';

interface IconProps {
  className?: string;
}

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.346c-.54.05-.98.49-.98.998v3.934c0 .552-.448 1-1 1h-4c-.552 0-1-.448-1-1v-3.934c0-.508-.44-.948-.98-.998l-3.722-.346A2.003 2.003 0 012 15.182V10.9a2.003 2.003 0 011.521-1.983l4.032-.705a.997.997 0 00.836-.36l2.12-2.973a.997.997 0 011.631 0l2.12 2.973a.997.997 0 00.836.36l4.032.705z" />
    </svg>
);
