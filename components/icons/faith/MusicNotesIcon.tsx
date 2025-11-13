import React from 'react';

interface IconProps {
  className?: string;
}

export const MusicNotesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <path fill="#a5f3fc" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        <path fill="#fde047" d="M16 7h-4v2h4V7zm0-4h-4v2h4V3z"/>
    </svg>
);