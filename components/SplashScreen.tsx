import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen animate-fade-in">
            <div className="text-center p-4">
                <h1 className="font-poppins text-2xl font-bold text-gray-700">
                    Respire.
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Você está no seu espaço de calma. 💜
                </p>
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 1.5s ease-in-out;
                }
            `}</style>
        </div>
    )
}

export default SplashScreen;
