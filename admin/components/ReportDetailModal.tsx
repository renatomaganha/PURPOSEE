

import React from 'react';
import { Report, ReportStatus, UserProfile } from '../types';
import { XIcon } from '../../components/icons/XIcon';

interface ReportDetailModalProps {
    report: Report;
    reporter?: UserProfile;
    reported?: UserProfile;
    onClose: () => void;
    onUpdateStatus: (reportId: string, newStatus: ReportStatus) => void;
    onAction: (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => void;
    onViewUser: (userId: string | undefined) => void;
}

const UserInfoCard: React.FC<{ title: string; user?: UserProfile; onViewUser: () => void }> = ({ title, user, onViewUser }) => (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
        <h4 className="text-sm font-bold text-slate-600 mb-2">{title}</h4>
        {user ? (
            <div>
                <p className="font-semibold text-slate-800">{user.name}, {user.age}</p>
                <p className="text-xs text-slate-500">{user.location}</p>
                <button onClick={onViewUser} className="text-xs font-bold text-sky-600 hover:underline mt-1">Ver Perfil Completo</button>
            </div>
        ) : (
            <p className="text-sm text-slate-500">Usuário não encontrado ou deletado.</p>
        )}
    </div>
);


export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, reporter, reported, onClose, onUpdateStatus, onAction, onViewUser }) => {
    
    const handleStatusChange = (newStatus: ReportStatus) => {
        onUpdateStatus(report.id, newStatus);
    };

    return (
         <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col p-8 text-slate-800 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Detalhes da Denúncia</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Data: {new Date(report.created_at).toLocaleString('pt-BR')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <UserInfoCard title="Denunciante" user={reporter} onViewUser={() => onViewUser(reporter?.id)} />
                    <UserInfoCard title="Denunciado" user={reported} onViewUser={() => onViewUser(reported?.id)} />
                </div>
                
                <div className="flex-grow overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-4">
                     <h3 className="text-lg font-bold text-slate-700">Motivo da Denúncia</h3>
                     <p className="text-md font-semibold text-red-600 mb-3">{report.reason}</p>
                     <h3 className="text-lg font-bold text-slate-700">Detalhes Adicionais</h3>
                     <p className="text-sm text-slate-600 whitespace-pre-wrap">
                        {report.details || "Nenhum detalhe adicional fornecido."}
                    </p>
                    {report.evidence_urls && report.evidence_urls.length > 0 && (
                        <>
                            <h3 className="text-lg font-bold text-slate-700 mt-4">Evidências Anexadas</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {report.evidence_urls.map((url, index) => (
                                    <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                                        <img src={url} alt={`Evidência ${index + 1}`} className="w-24 h-24 object-cover rounded-md border border-slate-300 hover:opacity-80 transition-opacity" />
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="text-sm font-semibold mr-3">Mudar Status:</span>
                        <select 
                            value={report.status}
                            onChange={(e) => handleStatusChange(e.target.value as ReportStatus)}
                            className="p-2 border border-slate-300 rounded-md text-sm"
                        >
                            <option value={ReportStatus.PENDING}>{ReportStatus.PENDING}</option>
                            <option value={ReportStatus.REVIEWED}>{ReportStatus.REVIEWED}</option>
                            <option value={ReportStatus.RESOLVED}>{ReportStatus.RESOLVED}</option>
                        </select>
                    </div>
                    {reported && (
                         <div className="flex gap-2">
                            <button onClick={() => onAction(reported.id, 'warn')} className="bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-sm hover:bg-amber-600">Avisar Usuário</button>
                            <button onClick={() => onAction(reported.id, reported.status === 'active' ? 'suspend' : 'reactivate')} className="bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm hover:bg-red-700">
                               {reported.status === 'active' ? 'Suspender Usuário' : 'Reativar Usuário'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};