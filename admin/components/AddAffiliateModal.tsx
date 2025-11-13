
import React, { useState, useMemo } from 'react';
import { Affiliate, AffiliateStatus } from '../types';
import { XIcon } from '../../components/icons/XIcon';

interface AddAffiliateModalProps {
  onClose: () => void;
  onAddAffiliate: (newAffiliate: Omit<Affiliate, 'id' | 'created_at'>) => void;
}

const generateReferralCode = (name: string): string => {
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const shortName = sanitizedName.slice(0, 6);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${shortName}${randomPart}`.slice(0, 10);
};

export const AddAffiliateModal: React.FC<AddAffiliateModalProps> = ({ onClose, onAddAffiliate }) => {
    const [name, setName] = useState('');
    const [commissionRate, setCommissionRate] = useState(20); // Default 20%

    const referralCode = useMemo(() => generateReferralCode(name), [name]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('O nome do afiliado é obrigatório.');
            return;
        }
        
        onAddAffiliate({
            name,
            commissionRate: commissionRate / 100,
            referralCode,
            status: AffiliateStatus.ACTIVE,
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-slate-800 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Adicionar Novo Afiliado</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="affiliateName" className="block text-sm font-medium text-slate-700">Nome do Afiliado</label>
                        <input
                            type="text"
                            id="affiliateName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full p-2 border border-slate-300 rounded-md"
                            placeholder="Ex: Blog Cristão Fiel"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="commissionRate" className="block text-sm font-medium text-slate-700">Taxa de Comissão (%)</label>
                        <input
                            type="number"
                            id="commissionRate"
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border border-slate-300 rounded-md"
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Código de Afiliação (Gerado Automaticamente)</label>
                        <input
                            type="text"
                            value={referralCode}
                            readOnly
                            className="mt-1 block w-full p-2 border border-slate-300 rounded-md bg-slate-100 font-mono"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                            Salvar Afiliado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
