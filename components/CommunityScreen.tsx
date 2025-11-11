import React from 'react';
import { useAppContext } from '../App';
import { Assinatura } from '../types';
import { MessageCircle, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityScreen: React.FC = () => {
    const { userData } = useAppContext();
    const navigate = useNavigate();
    const isPremium = userData.assinatura === Assinatura.PREMIUM;

    const handlePremiumAccess = () => {
        if (isPremium) {
            navigate('/premium-chat');
        } else {
            // In a real app, this would open a subscription modal/page
            alert('Acesso exclusivo para membros Premium.');
        }
    }

    return (
        <div className="p-4 h-full">
            <h1 className="font-poppins text-2xl font-bold text-center text-gray-800 dark:text-white">Nossos Espaços</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-1">Conecte-se, compartilhe e evolua.</p>

            <div className="space-y-8 mt-8">
                <div className="bg-gradient-to-br from-brand-lilac to-lilac-light p-6 rounded-2xl shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/30 p-3 rounded-full">
                            <MessageCircle size={24} />
                        </div>
                        <h2 className="font-poppins font-bold text-xl">Mente & Calma – Ansiedade</h2>
                    </div>
                    <p className="mt-4">Participe do nosso espaço de apoio emocional. Compartilhe experiências e receba acolhimento de mulheres que compreendem você.</p>
                    <button className="mt-6 w-full font-bold bg-white text-lilac py-3 rounded-xl hover:opacity-90 transition-opacity">
                        Entrar no Grupo Gratuito
                    </button>
                </div>
                
                <div className={`bg-gradient-to-br from-calm-green to-teal-200 p-6 rounded-2xl shadow-lg text-white transform transition-transform hover:scale-105 ${!isPremium ? 'grayscale' : ''}`}>
                     <div className="flex items-center gap-4">
                        <div className="bg-white/30 p-3 rounded-full">
                            <Zap size={24} />
                        </div>
                        <h2 className="font-poppins font-bold text-xl">Comunidade OFFANSIEDADE</h2>
                    </div>
                    <p className="mt-4">Um refúgio exclusivo para quem busca evolução real. Aqui você recebe áudios, técnicas, mentorias e apoio direto da nossa equipe.</p>
                    <button 
                        onClick={handlePremiumAccess}
                        className="mt-6 w-full font-bold bg-white text-calm-green py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                         {!isPremium && <Lock size={16} />}
                        {isPremium ? 'Acessar Chat Exclusivo' : 'Solicitar Acesso Premium'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityScreen;