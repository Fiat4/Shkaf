import React, { useState, useEffect } from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import HeadMeta from "../Components/HeadMeta/HeadMeta";
import "./WorksPage.css";

const works = [
    {
        id: 1,
        images: ["/img/Portfolio/work_1_1.jpg"],
        title: "Шкаф",
        description: "Комфортный, вместительный шкаф"
    },
    {
        id: 2,
        images: ["/img/Portfolio/work_2_1.jpg", "/img/Portfolio/work_2_2.jpg", "/img/Portfolio/work_2_3.jpg"],
        title: "Кухня",
        description: "Современная, большая кухня"
    },
    {
        id: 3,
        images: ["/img/Portfolio/work_3_1.jpg", "/img/Portfolio/work_3_2.jpg"],
        title: "Стенка",
        description: "Гостиная стенка с полками и закрытыми секциями"
    },
    {
        id: 4,
        images: ["/img/Portfolio/work_4_1.jpg"],
        title: "Кухня",
        description: "Стильная кухня"
    },
    {
        id: 5,
        images: ["/img/Portfolio/work_5_1.jpg", "/img/Portfolio/work_5_2.jpg"],
        title: "Прихожая",
        description: "Гостиная стенка с закрытыми секциями"
    },
];

const WorksPage: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalWork, setModalWork] = useState(works[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const openModal = (work: typeof works[0]) => {
        setModalWork(work);
        setCurrentImageIndex(0);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === modalWork.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? modalWork.images.length - 1 : prev - 1
        );
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && modalWork.images.length > 1) {
            nextImage();
        }
        if (isRightSwipe && modalWork.images.length > 1) {
            prevImage();
        }
    };

    useEffect(() => {
        if (!modalOpen) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeModal();
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, currentImageIndex]);

    return (
        <>
            <HeadMeta 
                title="Locker Wood - Наши работы"
                description="Портфолио работ Locker Wood - качественная мебель из натурального дерева"
                keywords="мебель, портфолио, работы, дерево, интерьер"
            />
            <Header />
            
            <section className="works-breadcrumbs">
                <div className="works-breadcrumbs-container">
                    <div className="works-breadcrumbs-content">
                        <a href="/" className="works-breadcrumbs-link">Главная</a>
                        <span className="works-breadcrumbs-separator">/</span>
                        <span className="works-breadcrumbs-current">Наши работы</span>
                    </div>
                </div>
            </section>
            
            <section className="works-hero">
                <div className="works-hero-container">
                    <div className="works-hero-content">
                        <h1 className="works-hero-title">НАШИ РАБОТЫ</h1>
                        <p className="works-hero-subtitle">
                            Посмотрите на примеры нашей работы и вдохновитесь идеями для вашего дома
                        </p>
                        <div className="works-hero-divider"></div>
                    </div>
                </div>
            </section>

            <section className="works-gallery">
                <div className="works-gallery-container">
                    <div className="works-grid">
                        {works.map((work, index) => (
                            <div 
                                key={work.id} 
                                className="works-card"
                                onClick={() => openModal(work)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="works-card-image">
                                    <img src={work.images[0]} alt={work.title} />
                                    <div className="works-card-overlay">
                                        <div className="works-card-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="works-card-content">
                                    <h3 className="works-card-title">{work.title}</h3>
                                    <p className="works-card-description">{work.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
                        
            {modalOpen && (
                <div className="works-modal-overlay" onClick={closeModal}>
                    <div className="works-modal" onClick={e => e.stopPropagation()}>
                        <button className="works-modal-close" onClick={closeModal}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                        
                        <div className="works-modal-image">
                            <img 
                                src={modalWork.images[currentImageIndex]} 
                                alt={modalWork.title}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            />
                            {modalWork.images.length > 1 && (
                                <>
                                    <button className="works-modal-arrow prev" onClick={prevImage}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 18l-6-6 6-6"/>
                                        </svg>
                                    </button>
                                    <button className="works-modal-arrow next" onClick={nextImage}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="works-modal-thumbnails">
                            {modalWork.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${modalWork.title} ${index + 1}`}
                                    className={`works-modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default WorksPage; 