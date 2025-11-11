import React from 'react';
import { Gift } from 'lucide-react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="flex items-center gap-3 bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg rounded-full shadow-lg px-4 py-2">
        <Gift className="text-lilac" size={20} />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{message}</p>
      </div>
      <style>{`
        @keyframes toastIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-toast-in {
            animation: toastIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
