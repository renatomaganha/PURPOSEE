import React from 'react';
import { FilterIcon } from './icons/FilterIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface NoMoreProfilesProps {
    onGoToFilters: () => void;
}

export const NoMoreProfiles: React.FC<NoMoreProfilesProps> = ({ onGoToFilters }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
            <FilterIcon className="w-16 h-16 text-sky-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">{t('noMoreProfilesTitle')}</h2>
            <p className="text-slate-600 mt-2 mb-6">
                {t('noMoreProfilesDesc')}
            </p>
            <button
                onClick={onGoToFilters}
                className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105"
            >
                {t('adjustFilters')}
            </button>
        </div>
    );
};