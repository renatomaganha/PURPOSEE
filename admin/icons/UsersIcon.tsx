
import React from 'react';

interface IconProps {
  className?: string;
}

export const UsersIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.036 1.396-1.953 2.348-2.675l-2.096-2.096a3.75 3.75 0 00-5.304 5.304l2.096 2.096c-.722.952-1.639 1.778-2.675 2.348m13.5-7.5a3.75 3.75 0 00-5.304-5.304l-2.096 2.096c.722-.952 1.639-1.778 2.675-2.348m-7.5 13.5c-1.036-.57-1.953-1.396-2.675-2.348l-2.096 2.096a3.75 3.75 0 005.304 5.304l2.096-2.096c-.952-.722-1.778-1.639-2.348-2.675M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);