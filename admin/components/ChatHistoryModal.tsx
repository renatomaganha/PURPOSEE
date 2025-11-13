
import React from 'react';
import { UserProfile, AdminMessage } from '../types';
import { XIcon } from '../../components/icons/XIcon';

interface ChatHistoryModalProps {
    user1: UserProfile;
    user2: UserProfile;
    messages: AdminMessage[];
    onClose: () => void;
}

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({ user1, user2, messages, onClose }) => {
    
    // Filtra e ordena as mensagens da conversa específica
    const chatMessages = messages
        .filter(m => 
            (m.sender_id === user1.id && m.receiver_id === user2.id) ||
            (m.sender_id === user2.id && m.receiver_id === user1.id)
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const getSenderName = (senderId: string) => {
        return senderId === user1.id ? user1.name : user2.name;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col text-slate-800" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold">Histórico de Conversa</h2>
                        <p className="text-sm text-slate-500">{user1.name} &harr; {user2.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 bg-slate-50">
                    {chatMessages.length > 0 ? (
                        <div className="space-y-4">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender_id === user1.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                        msg.sender_id === user1.id
                                            ? 'bg-sky-500 text-white rounded-br-none'
                                            : 'bg-slate-200 text-slate-800 rounded-bl-none'
                                    }`}>
                                        <p className="text-sm font-bold mb-1">{getSenderName(msg.sender_id)}</p>
                                        <p>{msg.text}</p>
                                    </div>
                                     <p className="text-xs text-slate-400 mt-1 px-1">
                                        {new Date(msg.created_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-500">Nenhuma mensagem encontrada nesta conversa.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
