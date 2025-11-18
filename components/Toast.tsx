import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../contexts/ToastContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { XIcon } from './icons/XIcon';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    style: 'bg-green-50 border-green-400 text-green-800',
  },
  error: {
    icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
    style: 'bg-red-50 border-red-400 text-red-800',
  },
  info: {
    icon: <InformationCircleIcon className="w-6 h-6 text-sky-500" />,
    style: 'bg-sky-50 border-sky-400 text-sky-800',
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300); // Aguarda a animação de saída
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const config = toastConfig[toast.type];

  return (
    <div
      className={`relative w-full max-w-sm rounded-lg shadow-lg p-4 flex items-start border-l-4 transition-all duration-300 ${config.style} ${isExiting ? 'animate-toast-exit' : 'animate-toast-enter'}`}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={handleDismiss}
          className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            toast.type === 'success' ? 'hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50' :
            toast.type === 'error' ? 'hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50' :
            'hover:bg-sky-100 focus:ring-sky-600 focus:ring-offset-sky-50'
          }`}
        >
          <span className="sr-only">Dismiss</span>
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
