import React, { useState } from 'react';
import { useAppContext } from '../App';
import { GUIDES_DATA } from '../constants';
import { Guide } from '../types';
import { Lock } from 'lucide-react';
import PdfViewerModal from './PdfViewerModal';

const GuideCard: React.FC<{ guide: Guide, isUnlocked: boolean, daysUntilUnlock: number, onAccess: () => void }> = ({ guide, isUnlocked, daysUntilUnlock, onAccess }) => {
    const isLocked = !isUnlocked;
    
    return (
        <div className={`transform transition-transform duration-300 hover:-translate-y-2 ${isLocked ? 'grayscale opacity-70' : ''}`}>
            <div className={`relative bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 h-full flex flex-col justify-between`}>
                 {guide.isPremium && (
                    <div className="absolute top-2 right-2 bg-calm-green text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                        Especial
                    </div>
                )}
                <div>
                  <img className="w-full h-40 rounded-lg object-cover mb-4" src={guide.mockupUrl} alt={guide.titulo} />
                  <span className="text-xs font-bold uppercase text-lilac">
                      {guide.isPremium ? 'Guia Exclusivo' : `Dia ${guide.dayUnlock}`}
                  </span>
                  <h3 className="font-poppins font-bold text-lg text-gray-800 dark:text-white mt-1">{guide.titulo}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex-grow">{guide.descricao}</p>
                </div>
                 <button 
                    onClick={onAccess}
                    disabled={isLocked}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-lilac text-white font-semibold rounded-lg hover:bg-brand-lilac disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                    {isLocked && <Lock size={16} />}
                    {isLocked ? `Libera em ${daysUntilUnlock} dia${daysUntilUnlock > 1 ? 's' : ''}` : 'Abrir Guia'}
                </button>
            </div>
        </div>
    )
}

const GuidesScreen: React.FC = () => {
    const { userData } = useAppContext();
    const [viewingGuide, setViewingGuide] = useState<Guide | null>(null);

    return (
        <div className="p-4">
            <h1 className="font-poppins text-2xl font-bold text-center text-gray-800 dark:text-white">Biblioteca de Guias</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {GUIDES_DATA.map((guide) => {
                    const isUnlocked = guide.isUnlocked || (guide.dayUnlock ? guide.dayUnlock <= userData.progresso : false);
                    const daysUntilUnlock = guide.dayUnlock ? Math.max(0, guide.dayUnlock - userData.progresso) : 0;
                        
                    return (
                        <GuideCard 
                            key={guide.id} 
                            guide={guide} 
                            isUnlocked={isUnlocked}
                            daysUntilUnlock={daysUntilUnlock}
                            onAccess={() => isUnlocked && setViewingGuide(guide)}
                        />
                    )
                })}
            </div>

            {viewingGuide && (
                <PdfViewerModal 
                    isOpen={!!viewingGuide} 
                    onClose={() => setViewingGuide(null)}
                    pdfUrl={viewingGuide.pdfUrl}
                    title={viewingGuide.titulo}
                />
            )}
        </div>
    );
};

export default GuidesScreen;