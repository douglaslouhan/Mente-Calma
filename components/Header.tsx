import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-20 flex items-center justify-center bg-gradient-to-b from-lilac-gradient-start to-white shadow-header-light dark:from-dark-card dark:to-dark-bg">
            <h1
              className="font-poppins text-xl font-bold text-calm-purple dark:text-lilac-light"
              style={{ animation: 'fadeIn 1.2s ease-in-out' }}
            >
              Mente & Calma
            </h1>
        </header>
    );
};

export default Header;