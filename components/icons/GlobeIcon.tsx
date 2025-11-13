import React from 'react';

interface IconProps {
  className?: string;
}

export const GlobeIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c.502 0 1.002-.023 1.49-.067M12 21c-.502 0-1.002-.023-1.49-.067M12 3c.502 0 1.002.023 1.49.067M12 3c-.502 0-1.002.023-1.49-.067M12 3a9.004 9.004 0 00-8.716 6.747M12 3a9.004 9.004 0 018.716 6.747M2 12h20M2 12a9.004 9.004 0 01-1.284-4.254M2 12a9.004 9.004 0 001.284 4.254M22 12a9.004 9.004 0 00-1.284-4.254M22 12a9.004 9.004 0 011.284 4.254" />
    </svg>
);