import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

const FloatingChatButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/')}
            className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-lilac text-white rounded-full shadow-lg flex items-center justify-center pulsating-icon"
            aria-label="Abrir chat com Rilane"
        >
            <Bot size={28} />
        </button>
    );
};

export default FloatingChatButton;
