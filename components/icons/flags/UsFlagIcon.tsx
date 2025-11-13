import React from 'react';

interface IconProps {
  className?: string;
}

export const UsFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 10" className={className}>
        <path fill="#B22234" d="M0 0h19v10H0z"/>
        <path fill="#fff" d="M0 1h19v1H0zm0 2h19v1H0zm0 2h19v1H0zm0 2h19v1H0z"/>
        <path fill="#3C3B6E" d="M0 0h9.5v5H0z"/>
        <g fill="#fff">
            <path d="M1.9 1.8L2.5.9 3.1 1.8 2 .6h1.8z"/>
            <path d="M3.8 1.8L4.4.9 5 1.8 3.9.6h1.8z"/>
            <path d="M5.7 1.8L6.3.9 6.9 1.8 5.8.6h1.8z"/>
            <path d="M7.6 1.8L8.2.9 8.8 1.8 7.7.6h1.8z"/>
            <path d="M1 3.2l.6-.9.6.9-1.2-1.2h1.8z"/>
            <path d="M2.8 3.2l.6-.9.6.9-1.2-1.2h1.8z"/>
            <path d="M4.8 3.2l.6-.9.6.9-1.2-1.2h1.8z"/>
            <path d="M6.7 3.2l.6-.9.6.9-1.2-1.2h1.8z"/>
            <path d="M8.6 3.2l.6-.9.6.9-1.2-1.2h1.8z"/>
        </g>
    </svg>
);