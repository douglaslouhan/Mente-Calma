import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PremiumChatScreen: React.FC = () => {
    return (
        <div className="p-4 flex flex-col items-center justify-center text-center h-full">
            <ShieldCheck className="text-calm-green" size={64} />
            <h1 className="font-poppins text-2xl font-bold text-gray-800 dark:text-white mt-4">
                Comunidade OFFANSIEDADE
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
                Bem-vinda ao seu espaço exclusivo! Este é um ambiente seguro para compartilhamento e crescimento.
            </p>
            <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-xl w-full max-w-md">
                <p className="text-gray-500">
                    O chat da comunidade está em desenvolvimento e chegará em breve.
                </p>
            </div>
        </div>
    );
};

export default PremiumChatScreen;
