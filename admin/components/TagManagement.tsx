import React, { useState, useMemo } from 'react';
import { Tag, TagCategory } from '../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';


interface TagManagementProps {
    tags: Tag[];
    onAddTag: (newTag: Omit<Tag, 'id' | 'created_at'>) => Promise<void>;
    onUpdateTag: (updatedTag: Tag) => Promise<void>;
    onDeleteTag: (tagId: string) => Promise<void>;
}

const categoryTitles: Record<TagCategory, string> = {
    denominations: 'Denominações',
    keyValues: 'Valores de Fé',
    interests: 'Interesses',
    languages: 'Idiomas'
};

const emojiLibrary: Record<string, string[]> = {
    'Fé': ['✝️', '🙏', '⛪', '📖', '🕊️', '🔥', '🕯️', '📿', '🛐', '✨', '🎶', '❤️', '🙌', '🤲', '⚓', '🛡️', '🕖', '🌍', '🌅'],
    'Atividades': ['📚', '🎨', '🎭', '🎬', '🎤', '🎧', '🎻', '🎹', '🎸', '🎷', '🎺', '🎮', '🎲', '🧩', '♟️', '🎳', '🎯', '📷', '🎥', '💻', '🔭', '🔬', '🛠️', '🧵', '🧶'],
    'Esportes': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', ' Badminton', '🏒', '🏑', '🏏', '⛳', '🏹', 'Fishing', '🥊', '🥋', '⛸️', '🎿', '🛷', '🛹', '🚲', '🚴', '🏇', '🏊', '🚣', '🧗', '🚶‍♂️', '🏃‍♂️'],
    'Natureza': ['🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃', '🍄', '🏔️', '⛰️', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🌅', '🌄', '🌃', '🌌', '🌉', '⛺', 'Vulcão'],
    'Comida/Lazer': ['☕', '🍵', '🧉', '🍕', '🍔', '🍟', '🥪', '🌮', '🥗', '🥘', '🍲', '🍛', '🍱', '🍣', '🍤', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍿', '🥨', '🥨', '🥯'],
    'Idiomas': ['🇧🇷', '🇺🇸', '🇬🇧', '🇵🇹', '🇪🇸', '🇮🇹', '🇫🇷', '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇷🇺', '🇮🇱', '🇬🇷', '🇺🇦', '🇦🇷', '🇨🇦', '🇲🇽', '🌐'],
    'Objetos': ['💡', '🔔', '📣', '📢', '💬', '💭', '📅', '📆', '📊', '📈', '📉', '📌', '📍', '🔍', '🔎', '🔒', '🔓', '🔑', '🗝️', '🔨', '🪓', '⛏️', '🛠️', '🔩', '⚙️', '🧱', '⛓️', '🧰', '🧲', '🧿']
};

const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
    const categories = Object.keys(emojiLibrary);
    const [activeCat, setActiveCat] = useState(categories[0]);

    return (
        <div className="mb-3 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-pop">
            <div className="flex bg-slate-50 border-b overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCat(cat)}
                        className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${activeCat === cat ? 'border-sky-500 text-sky-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="p-2 grid grid-cols-6 gap-1 max-h-48 overflow-y-auto custom-scrollbar bg-white">
                {emojiLibrary[activeCat].map(e => (
                    <button 
                        key={e} 
                        type="button"
                        onClick={() => onSelect(e)}
                        className="w-10 h-10 flex items-center justify-center text-xl hover:bg-sky-50 rounded-lg transition-all transform hover:scale-125"
                    >
                        {e}
                    </button>
                ))}
            </div>
        </div>
    );
};

const TagItem: React.FC<{
    tag: Tag;
    onUpdate: (updatedTag: Tag) => Promise<void>;
    onDelete: (tagId: string) => Promise<void>;
}> = ({ tag, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState(tag.name);
    const [emoji, setEmoji] = useState(tag.emoji || '');
    const [showPicker, setShowPicker] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ ...tag, name, emoji });
            setIsEditing(false);
            setShowPicker(false);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleCancel = () => {
        setName(tag.name);
        setEmoji(tag.emoji || '');
        setIsEditing(false);
        setShowPicker(false);
    }

    return (
        <div className="flex flex-col gap-2 p-3 bg-slate-100 rounded-lg text-sm group">
            <div className="flex items-center justify-between">
                {isEditing ? (
                    <div className="flex flex-col gap-2 w-full pr-8">
                        <div className="flex gap-2 relative">
                             <button 
                                type="button"
                                onClick={() => setShowPicker(!showPicker)}
                                className="w-12 h-10 bg-white border border-sky-500 rounded-md text-center text-lg flex items-center justify-center hover:bg-sky-50"
                            >
                                {emoji || '·'}
                            </button>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                className="flex-grow p-1 border border-sky-500 rounded-md text-sm"
                                autoFocus
                            />
                        </div>
                        {showPicker && (
                            <div className="absolute z-50 left-0 top-12 w-64">
                                <EmojiPicker onSelect={(e) => { setEmoji(e); setShowPicker(false); }} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-lg bg-white w-8 h-8 flex items-center justify-center rounded shadow-sm">{tag.emoji || '·'}</span>
                        <span className="font-bold text-slate-700">{tag.name}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 ml-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} disabled={isSaving} className="text-green-600 hover:text-green-800 disabled:opacity-50">
                                {isSaving ? <div className="w-5 h-5 border-2 border-t-green-600 border-slate-200 rounded-full animate-spin"></div> : <CheckIcon className="w-5 h-5" />}
                            </button>
                            <button onClick={handleCancel} disabled={isSaving} className="text-slate-500 hover:text-slate-700 disabled:opacity-50"><XIcon className="w-5 h-5" /></button>
                        </>
                    ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => setIsEditing(true)} className="p-1 text-slate-500 hover:text-sky-600 hover:bg-white rounded"><PencilIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(tag.id)} className="p-1 text-slate-500 hover:text-red-600 hover:bg-white rounded"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TagCategoryCard: React.FC<{
    category: TagCategory;
    tags: Tag[];
    onAdd: (newTag: Omit<Tag, 'id' | 'created_at'>) => Promise<void>;
    onUpdate: (updatedTag: Tag) => Promise<void>;
    onDelete: (tagId: string) => Promise<void>;
}> = ({ category, tags, onAdd, onUpdate, onDelete }) => {
    const [newTagName, setNewTagName] = useState('');
    const [newTagEmoji, setNewTagEmoji] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (newTagName.trim()) {
            setIsAdding(true);
            try {
                await onAdd({ name: newTagName, emoji: newTagEmoji, category });
                setNewTagName('');
                setNewTagEmoji('');
                setShowPicker(false);
            } finally {
                setIsAdding(false);
            }
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col h-[520px]">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                {categoryTitles[category]}
                <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">{tags.length}</span>
            </h2>
            
            <div className="flex-grow overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {tags.map(tag => (
                    <TagItem key={tag.id} tag={tag} onUpdate={onUpdate} onDelete={onDelete} />
                ))}
                {tags.length === 0 && (
                    <p className="text-center text-slate-400 text-xs py-8">Nenhuma tag cadastrada.</p>
                )}
            </div>

            <div className="mt-4 pt-4 border-t relative">
                {showPicker && (
                    <div className="absolute bottom-full left-0 right-0 z-50">
                        <EmojiPicker onSelect={(e) => { setNewTagEmoji(e); setShowPicker(false); }} />
                    </div>
                )}
                
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => setShowPicker(!showPicker)}
                            className={`w-12 h-10 flex items-center justify-center rounded-lg border-2 transition-all ${newTagEmoji ? 'border-sky-500 bg-sky-50 text-xl' : 'border-slate-200 text-slate-400 hover:border-sky-300'}`}
                        >
                            {newTagEmoji || '+'}
                        </button>
                        <input
                            type="text"
                            placeholder="Nome da Tag..."
                            value={newTagName}
                            onChange={e => setNewTagName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            className="flex-grow p-2 border-2 border-slate-200 rounded-lg text-sm focus:border-sky-500 outline-none"
                            disabled={isAdding}
                        />
                    </div>
                    <button 
                        onClick={handleAdd} 
                        disabled={!newTagName.trim() || isAdding}
                        className="w-full bg-sky-600 text-white font-bold py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isAdding ? (
                            <div className="w-5 h-5 border-2 border-t-white border-sky-400 rounded-full animate-spin"></div>
                        ) : (
                            <><PlusIcon className="w-4 h-4" /> Criar Tag</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const TagManagement: React.FC<TagManagementProps> = ({ tags, onAddTag, onUpdateTag, onDeleteTag }) => {

    const tagsByCategory = useMemo(() => {
        return tags.reduce((acc, tag) => {
            if (!acc[tag.category]) {
                acc[tag.category] = [];
            }
            acc[tag.category].push(tag);
            return acc;
        }, {} as Record<TagCategory, Tag[]>);
    }, [tags]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Gestão de Tags</h1>
            <p className="text-slate-500 mb-8 max-w-3xl">
                Personalize as opções de Denominações, Valores, Interesses e Idiomas. 
                As mudanças são aplicadas automaticamente nos filtros e perfis dos usuários.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {(Object.keys(categoryTitles) as TagCategory[]).map(category => (
                    <TagCategoryCard
                        key={category}
                        category={category}
                        tags={tagsByCategory[category] || []}
                        onAdd={onAddTag}
                        onUpdate={onUpdateTag}
                        onDelete={onDeleteTag}
                    />
                ))}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};