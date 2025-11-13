
import React from 'react';

interface IconProps {
  className?: string;
}

export const HeartSparkleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.946 2.054a.75.75 0 00-1.892 0L2.362 8.652a.75.75 0 00.438 1.348l6.16.821a.75.75 0 01.59.59l.82 6.162a.75.75 0 001.349.437l6.598-8.694a.75.75 0 000-1.892L12.946 2.054z" />
        <path d="M14.25 15.75a.75.75 0 001.5 0v-2.25a.75.75 0 00-1.5 0v2.25zM15 11.25a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H15.75a.75.75 0 01-.75-.75zM17.25 12a.75.75 0 000 1.5h2.25a.75.75 0 000-1.5H17.25z" />
        <path fillRule="evenodd" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" clipRule="evenodd" />
    </svg>
);
