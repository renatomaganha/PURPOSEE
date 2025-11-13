import React, { useState } from 'react';
import { Denomination, ChurchFrequency, RelationshipGoal, FilterState, Tag } from '../types';
import { XIcon } from './icons/XIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface FilterScreenProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
  isPremiumUser: boolean;
  denominations: Tag[];
}

const allChurchFrequencies = Object.values(ChurchFrequency);
const allRelationshipGoals = Object.values(RelationshipGoal);

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-b border-slate-200 py-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{title}</h2>
        {children}
    </div>
);

const TagButton: React.FC<{ tag: Tag; isSelected: boolean; onClick: () => void; }> = ({ tag, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`text-sm font-semibold mr-2 mb-2 px-3 py-1.5 rounded-full transition-colors duration-200 flex items-center gap-2 ${
            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
    >
        {tag.emoji && <span>{tag.emoji}</span>}
        <span>{tag.name}</span>
    </button>
);

const SimpleButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`text-sm font-semibold mr-2 mb-2 px-3 py-1.5 rounded-full transition-colors duration-200 ${
            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
    >
        <span>{label}</span>
    </button>
);


export const FilterScreen: React.FC<FilterScreenProps> = ({ onClose, onApply, currentFilters, isPremiumUser, denominations }) => {
    const [filters, setFilters] = useState<FilterState>(currentFilters);
    const { t } = useLanguage();
    
    const MIN_AGE = 18;
    const MAX_AGE = 60;

    const handleAgeChange = (field: 'min' | 'max', value: string) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return;

        setFilters(prev => {
            const newAgeRange = { ...prev.ageRange, [field]: numValue };
            if (field === 'min' && newAgeRange.min > newAgeRange.max) {
                newAgeRange.max = newAgeRange.min;
            }
            if (field === 'max' && newAgeRange.max < newAgeRange.min) {
                newAgeRange.min = newAgeRange.max;
            }
            return { ...prev, ageRange: newAgeRange };
        });
    };

     const toggleListFilter = <T,>(value: T, list: T[], setList: (newList: T[]) => void) => {
        if (!isPremiumUser) {
            handlePremiumFeatureClick();
            return;
        }
        const currentIndex = list.indexOf(value);
        const newList = [...list];

        if (currentIndex === -1) {
            newList.push(value);
        } else {
            newList.splice(currentIndex, 1);
        }
        setList(newList);
    };

    const handleClear = () => {
        const clearedFilters: FilterState = {
            ageRange: { min: 18, max: 60 },
            distance: 100,
            denominations: [],
            churchFrequencies: [],
            relationshipGoals: [],
            verifiedOnly: false,
            churchName: '',
        };
        setFilters(clearedFilters);
        onApply(clearedFilters);
    };
    
    const handlePremiumFeatureClick = () => {
        alert(t('premiumFeatureAlert'));
    };

    const ageRangePercentage = {
        left: ((filters.ageRange.min - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100,
        right: 100 - ((filters.ageRange.max - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100,
    };

    return (
        <div className="fixed inset-0 z-30 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2">
                    <XIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">{t('filters')}</h1>
                 <button onClick={handleClear} className="font-semibold text-sky-600 text-sm">
                    {t('clear')}
                </button>
            </header>

            <main className="flex-grow overflow-y-auto px-4">
                <FilterSection title={t('basic')}>
                    <div className="mb-4">
                        <div className="flex items-center justify-between font-bold text-sky-700">
                             <label className="block text-sm font-semibold text-slate-600">{t('ageRange')}</label>
                            <span>{filters.ageRange.min} - {filters.ageRange.max === 60 ? '60+' : filters.ageRange.max}</span>
                        </div>
                        <div className="relative h-8 flex items-center mt-2">
                            <div className="absolute bg-slate-200 h-1 w-full rounded-full"></div>
                            <div
                                className="absolute bg-sky-500 h-1 rounded-full"
                                style={{
                                    left: `${ageRangePercentage.left}%`,
                                    right: `${ageRangePercentage.right}%`,
                                }}
                            ></div>
                            <input
                                type="range"
                                min={MIN_AGE}
                                max={MAX_AGE}
                                value={filters.ageRange.min}
                                onChange={(e) => handleAgeChange('min', e.target.value)}
                                className="range-slider-input"
                                aria-label={t('ageRange')}
                            />
                            <input
                                type="range"
                                min={MIN_AGE}
                                max={MAX_AGE}
                                value={filters.ageRange.max}
                                onChange={(e) => handleAgeChange('max', e.target.value)}
                                className="range-slider-input"
                                aria-label={t('ageRange')}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between font-bold text-sky-700">
                            <label className="block text-sm font-semibold text-slate-600">{t('distance')}</label>
                            <span>{t('upToKm', { distance: filters.distance })}</span>
                        </div>
                        <div className="relative h-8 flex items-center mt-2">
                             <div className="absolute bg-slate-200 h-1 w-full rounded-full"></div>
                            <div className="absolute bg-sky-500 h-1 rounded-full" style={{ width: `${(filters.distance / 200) * 100}%` }}></div>
                             <input
                                type="range"
                                min="1"
                                max="200"
                                value={filters.distance}
                                onChange={(e) => setFilters(prev => ({ ...prev, distance: parseInt(e.target.value, 10) }))}
                                className="range-slider-input"
                                aria-label={t('distance')}
                            />
                        </div>
                    </div>
                </FilterSection>

                <div className={`relative ${!isPremiumUser ? 'opacity-50' : ''}`}>
                    {!isPremiumUser && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center" onClick={handlePremiumFeatureClick}>
                            <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                                <LockClosedIcon className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                                <h3 className="font-bold text-slate-800">{t('premiumExclusive')}</h3>
                                <p className="text-xs text-slate-600">{t('premiumExclusiveDesc')}</p>
                            </div>
                        </div>
                    )}
                    <FilterSection title={t('advancedFilters')}>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-600 mb-2">{t('denomination')}</label>
                            <div className="flex flex-wrap">
                               {denominations.map(denom => (
                                    <TagButton 
                                        key={denom.id}
                                        tag={denom}
                                        isSelected={filters.denominations.includes(denom.name)}
                                        onClick={() => toggleListFilter<Denomination>(denom.name, filters.denominations, (list) => setFilters(f => ({ ...f, denominations: list })))}
                                    />
                               ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="churchNameFilter" className="block text-sm font-semibold text-slate-600 mb-2">Nome da Igreja</label>
                            <input
                                type="text"
                                id="churchNameFilter"
                                placeholder="Digite o nome da igreja..."
                                value={filters.churchName || ''}
                                onChange={(e) => {
                                    if (!isPremiumUser) {
                                        handlePremiumFeatureClick();
                                        return;
                                    }
                                    setFilters(f => ({ ...f, churchName: e.target.value }))
                                }}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-600 mb-2">{t('churchFrequency')}</label>
                            <div className="flex flex-wrap">
                                {allChurchFrequencies.map(freq => (
                                    <SimpleButton 
                                        key={freq}
                                        label={t(freq)}
                                        isSelected={filters.churchFrequencies.includes(freq)}
                                        onClick={() => toggleListFilter<ChurchFrequency>(freq, filters.churchFrequencies, (list) => setFilters(f => ({ ...f, churchFrequencies: list })))}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">{t('appGoal')}</label>
                            <div className="flex flex-wrap">
                                {allRelationshipGoals.map(goal => (
                                    <SimpleButton 
                                        key={goal}
                                        label={t(goal)}
                                        isSelected={filters.relationshipGoals.includes(goal)}
                                        onClick={() => toggleListFilter<RelationshipGoal>(goal, filters.relationshipGoals, (list) => setFilters(f => ({ ...f, relationshipGoals: list })))}
                                    />
                                ))}
                            </div>
                        </div>
                    </FilterSection>
                </div>

                <FilterSection title={t('security')}>
                    <div className="flex items-center justify-between">
                        <div>
                             <label className="font-semibold text-slate-600">{t('verifiedOnly')}</label>
                            <p className="text-xs text-slate-500">{t('verifiedOnlyDesc')}</p>
                        </div>
                        <button
                            role="switch"
                            aria-checked={filters.verifiedOnly}
                            onClick={() => {
                                if (!isPremiumUser) {
                                    handlePremiumFeatureClick();
                                    return;
                                }
                                setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }));
                            }}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${filters.verifiedOnly ? 'bg-sky-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${filters.verifiedOnly ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                </FilterSection>
            </main>
            
            <footer className="bg-white p-4 border-t border-slate-200 sticky bottom-0 z-20">
                <button
                    onClick={() => onApply(filters)}
                    className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-sky-700"
                >
                    {t('applyFilters')}
                </button>
            </footer>
        </div>
    );
};