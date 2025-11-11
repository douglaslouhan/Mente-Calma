import React, { useState } from 'react';
import Modal from './Modal';
import { Loader2 } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, pdfUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-[85vh] md:h-[90vh]">
        <h2 className="font-poppins text-lg font-bold text-gray-800 dark:text-white mb-4 flex-shrink-0 truncate">{title}</h2>
        <div className="relative flex-grow bg-gray-100 dark:bg-dark-bg rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-lilac" size={48} />
              <p className="ml-4 text-gray-600 dark:text-gray-300">Carregando guia...</p>
            </div>
          )}
          <iframe
            src={pdfUrl}
            className={`w-full h-full border-none rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
            title={title}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PdfViewerModal;