import React, { useState, useMemo } from 'react';
import { Tag, TagCategory } from '../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';


interface TagManagementProps {
    tags: Tag[];
    onAddTag: (newTag: Omit<Tag, 'id' | 'created_at'>) => void;
    onUpdateTag: (updatedTag: Tag) => void;
    onDeleteTag: (tagId: string) => void;
}

const categoryTitles: Record<TagCategory, string> = {
    denominations: 'Denominações',
    keyValues: 'Valores de Fé',
    interests: 'Interesses',
    languages: 'Idiomas'
};

const TagItem: React.FC<{
    tag: Tag;
    onUpdate: (updatedTag: Tag) => void;
    onDelete: (tagId: string) => void;
}> = ({ tag, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(tag.name);

    const handleSave = () => {
        onUpdate({ ...tag, name });
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setName(tag.name);
        setIsEditing(false);
    }

    return (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md text-sm">
            {isEditing ? (
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="flex-grow p-1 border border-sky-500 rounded-md text-sm"
                    autoFocus
                />
            ) : (
                <span className="font-medium text-slate-700">{tag.name}</span>
            )}
            <div className="flex items-center gap-2 ml-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="text-green-600 hover:text-green-800"><CheckIcon className="w-5 h-5" /></button>
                        <button onClick={handleCancel} className="text-slate-500 hover:text-slate-700"><XIcon className="w-5 h-5" /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-sky-600"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(tag.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
}

const TagCategoryCard: React.FC<{
    category: TagCategory;
    tags: Tag[];
    onAdd: (newTag: Omit<Tag, 'id' | 'created_at'>) => void;
    onUpdate: (updatedTag: Tag) => void;
    onDelete: (tagId: string) => void;
}> = ({ category, tags, onAdd, onUpdate, onDelete }) => {
    const [newTagName, setNewTagName] = useState('');

    const handleAdd = () => {
        if (newTagName.trim()) {
            onAdd({ name: newTagName, category });
            setNewTagName('');
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-4">{categoryTitles[category]}</h2>
            <div className="flex-grow overflow-y-auto pr-2 space-y-2 max-h-64">
                {tags.map(tag => (
                    <TagItem key={tag.id} tag={tag} onUpdate={onUpdate} onDelete={onDelete} />
                ))}
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
                <input
                    type="text"
                    placeholder="Adicionar nova tag..."
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    className="flex-grow p-2 border border-slate-300 rounded-md text-sm"
                />
                <button 
                    onClick={handleAdd} 
                    className="bg-sky-600 text-white p-2 rounded-md hover:bg-sky-700 flex-shrink-0"
                    aria-label={`Adicionar a ${categoryTitles[category]}`}
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
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
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Gestão de Tags</h1>
            <p className="text-slate-600 mb-8 max-w-3xl">
                Adicione, edite ou remova as opções que os usuários podem selecionar em seus perfis. As alterações feitas aqui serão refletidas instantaneamente nos formulários de criação/edição de perfil e nos filtros.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
    );
};