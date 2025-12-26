import React from 'react';
import { Report, ReportStatus, UserProfile } from '../types';
import { XIcon } from '../../components/icons/XIcon';
import { ShieldExclamationIcon } from '../icons/ShieldExclamationIcon';

interface ReportDetailModalProps {
    report: Report;
    reporter?: UserProfile;
    reported?: UserProfile;
    onClose: () => void;
    onUpdateStatus: (reportId: string, newStatus: ReportStatus) => Promise<void>;
    onAction: (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => void;
    onViewUser: (userId: string | undefined) => void;
}

const UserInfoCard: React.FC<{ title: string; user?: UserProfile; onViewUser: () => void }> = ({ title, user, onViewUser }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
            {user && <button onClick={onViewUser} className="text-[10px] font-bold text-sky-600 hover:underline">DETALHES</button>}
        </div>
        {user ? (
            <div className="flex items-center gap-3">
                {user.photos[0] && <img src={user.photos[0]} className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" alt=""/>}
                <div>
                    <p className="font-bold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{user.location}</p>
                </div>
            </div>
        ) : (
            <p className="text-xs text-slate-400 italic">Usuário indisponível</p>
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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col p-8 text-slate-800 relative animate-pop"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                        <ShieldExclamationIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Denúncia de Conduta</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {report.id.slice(0, 8)} • {new Date(report.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <UserInfoCard title="Quem Denunciou" user={reporter} onViewUser={() => onViewUser(reporter?.id)} />
                    <UserInfoCard title="Acusado" user={reported} onViewUser={() => onViewUser(reported?.id)} />
                </div>
                
                <div className="flex-grow overflow-y-auto bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Motivo Principal</h3>
                     <p className="text-lg font-bold text-red-600 mb-4">{report.reason}</p>
                     
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Relato do Denunciante</h3>
                     <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
                        {report.details || "Nenhum detalhe adicional fornecido."}
                    </p>

                    {report.evidence_urls && report.evidence_urls.length > 0 && (
                        <>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Evidências (Anexos)</h3>
                            <div className="flex flex-wrap gap-3">
                                {report.evidence_urls.map((url, index) => (
                                    <a href={url} target="_blank" rel="noopener noreferrer" key={index} className="group relative">
                                        <img src={url} alt={`Evidência ${index + 1}`} className="w-28 h-28 object-cover rounded-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded">VER</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status da Investigação:</span>
                        <select 
                            value={report.status}
                            onChange={(e) => handleStatusChange(e.target.value as ReportStatus)}
                            className="p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
                        >
                            <option value={ReportStatus.PENDING}>Pendente</option>
                            <option value={ReportStatus.REVIEWED}>Revisado</option>
                            <option value={ReportStatus.RESOLVED}>Resolvido / Arquivado</option>
                        </select>
                    </div>

                    {reported && (
                         <div className="flex gap-2">
                            <button onClick={() => onAction(reported.id, 'warn')} className="bg-amber-500 text-white font-black py-3 px-6 rounded-xl text-xs hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100">AVISAR USUÁRIO</button>
                            <button 
                                onClick={() => onAction(reported.id, reported.status === 'active' ? 'suspend' : 'reactivate')} 
                                className={`${reported.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-black py-3 px-6 rounded-xl text-xs transition-colors shadow-lg`}
                            >
                               {reported.status === 'active' ? 'SUSPENDER' : 'REATIVAR'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};