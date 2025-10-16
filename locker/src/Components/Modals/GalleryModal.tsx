




import React from 'react';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeImage: number;
    onImageChange: (index: number) => void;
    images: string[];
}

const GalleryModal: React.FC<GalleryModalProps> = ({
    isOpen,
    onClose,
    activeImage,
    onImageChange,
    images
}) => {
    if (!isOpen) return null;

    const nextImage = () => {
        onImageChange((activeImage + 1) % images.length);
    };

    const prevImage = () => {
        onImageChange((activeImage - 1 + images.length) % images.length);
    };

    return (
        <div className="modal-gallery-overlay" onClick={onClose}>
            <div className="modal-gallery" onClick={e => e.stopPropagation()}>
                <div className="modal-gallery-stage">
                    <button 
                        className="modal-gallery-arrow left" 
                        onClick={prevImage}
                    >
                        &#8592;
                    </button>
                    <img 
                        src={images[activeImage]} 
                        alt="Фото отзыва" 
                        className="modal-gallery-image" 
                    />
                    <button 
                        className="modal-gallery-arrow right" 
                        onClick={nextImage}
                    >
                        &#8594;
                    </button>
                </div>
                <div className="modal-gallery-thumbs">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="thumb"
                            className={`modal-gallery-thumb ${activeImage === index ? "active" : ""}`}
                            onClick={() => onImageChange(index)}
                        />
                    ))}
                </div>
                <button className="modal-gallery-close" onClick={onClose}>&times;</button>
            </div>
        </div>
    );
};

export default GalleryModal;
