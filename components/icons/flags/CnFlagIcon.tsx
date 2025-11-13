import React from 'react';

interface IconProps {
  className?: string;
}

export const CnFlagIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className={className}>
        <rect fill="#ee1c25" width="900" height="600"/>
        <path fill="#ff0" d="m150 120 45.3 138.8-118.4-85.8h146.2L104.7 258.8z"/>
        <path fill="#ff0" d="m300 60 18.1 55.5-47.3-34.3h58.5L272.7 115.5zm0 120 18.1 55.5-47.3-34.3h58.5L272.7 235.5zM240 30l18.1 55.5-47.3-34.3h58.5L212.7 85.5zm60 210 18.1 55.5-47.3-34.3h58.5L272.7 295.5z"/>
    </svg>
);