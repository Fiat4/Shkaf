




import { useState, useEffect } from 'react';

interface UseImageGalleryProps {
    images: string[];
}

export const useImageGallery = ({ images }: UseImageGalleryProps) => {
    const [activeImg, setActiveImg] = useState<number>(0);
    const [activeGalleryImage, setActiveGalleryImage] = useState<number>(0);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);

    const nextImage = () => {
        setActiveImg((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImg((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleGalleryImageChange = (index: number) => {
        setActiveGalleryImage(index);
    };

    const openGalleryModal = () => {
        setIsGalleryModalOpen(true);
    };

    const closeGalleryModal = () => {
        setIsGalleryModalOpen(false);
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                prevImage();
            } else if (event.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return {
        activeImg,
        activeGalleryImage,
        isGalleryModalOpen,
        nextImage,
        prevImage,
        setActiveImg,
        handleGalleryImageChange,
        openGalleryModal,
        closeGalleryModal
    };
};
