import React from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { XIcon } from './icons/XIcon';

interface PhotoUploadModalProps {
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ onClose, onTakePhoto, onChooseFromGallery }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-slate-800 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center mb-6">Adicionar Foto</h2>
        <div className="flex flex-col gap-4">
            <button
                onClick={onTakePhoto}
                className="w-full flex items-center gap-3 p-4 bg-slate-100 rounded-lg font-semibold text-slate-700 hover:bg-slate-200"
            >
                <CameraIcon className="w-6 h-6 text-sky-600"/>
                <span>Tirar Foto</span>
            </button>
            <button
                onClick={onChooseFromGallery}
                className="w-full flex items-center gap-3 p-4 bg-slate-100 rounded-lg font-semibold text-slate-700 hover:bg-slate-200"
            >
                <PhotoIcon className="w-6 h-6 text-sky-600"/>
                <span>Escolher da Galeria</span>
            </button>
        </div>
      </div>
    </div>
  );
};