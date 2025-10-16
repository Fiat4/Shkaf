import React from 'react';
import './FullscreenImageModal.css';

interface FullscreenImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentImage: string;
    currentIndex: number;
    totalImages: number;
    onPrevious: () => void;
    onNext: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

const FullscreenImageModal: React.FC<FullscreenImageModalProps> = ({
    isOpen,
    onClose,
    currentImage,
    currentIndex,
    totalImages,
    onPrevious,
    onNext,
    onTouchStart,
    onTouchMove,
    onTouchEnd
}) => {
    if (!isOpen) return null;

    return (
        <div className="fullscreen-modal" onClick={onClose}>
            <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={currentImage} 
                    alt="Полноэкранное изображение" 
                    className="fullscreen-image"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                />
                
                <button 
                    className="fullscreen-nav-button left"
                    onClick={onPrevious}
                    aria-label="Предыдущее изображение"
                >
                    ‹
                </button>
                
                <button 
                    className="fullscreen-nav-button right"
                    onClick={onNext}
                    aria-label="Следующее изображение"
                >
                    ›
                </button>
                
                <button 
                    className="fullscreen-close-button"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>
                
                <div className="fullscreen-counter">
                    {currentIndex + 1} / {totalImages}
                </div>
            </div>
        </div>
    );
};

export default FullscreenImageModal;





