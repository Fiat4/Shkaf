import React, { useState, useEffect } from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import HeadMeta from "../Components/HeadMeta/HeadMeta";
import WorkCard from "../Components/WorkCard/WorkCard";
import "./CategoryPage.css";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';


const works = [
    {
        images: ["/img/sofa.jpg", "/img/bed.jpg", "/img/chair.jpg"],
        title: "ТЕКСТ",
        description: "Lorem Ipsum Dolor Sit Amet Consectetur.",
    },
    {
        images: ["/img/bed.jpg"],
        title: "ТЕКСТ",
        description: "Lorem Ipsum Dolor Sit Amet Consectetur.",
    },
    {
        images: ["/img/chair.jpg", "/img/kit.jpg"],
        title: "ТЕКСТ",
        description: "Lorem Ipsum Dolor Sit Amet Consectetur.",
    },
    {
        images: ["/img/kit.jpg"],
        title: "ТЕКСТ",
        description: "Lorem Ipsum Dolor Sit Amet Consectetur.",
    },
    {
        images: ["/img/wal.jpg", "/img/kitchen_main.jpg"],
        title: "ТЕКСТ",
        description: "Lorem Ipsum Dolor Sit Amet Consectetur.",
    },
    {
        images: ["/img/kitchen_main.jpg"],
        title: "ТЕКСТ",
        description: "Lorem Ipsum Dolor Sit Amet Consectetur.",
    },
];

const WorksPage: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

    useEffect(() => {
        if (!modalOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'Escape') setModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, modalIndex, modalPhotoIndex]);

    const openModal = (idx: number) => {
        setModalIndex(idx);
        setModalPhotoIndex(0);
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);
    const nextPhoto = () => {
        setModalPhotoIndex((prev) => (prev + 1) % works[modalIndex].images.length);
    };
    const prevPhoto = () => {
        setModalPhotoIndex((prev) => (prev - 1 + works[modalIndex].images.length) % works[modalIndex].images.length);
    };
    return (
        <>
            <HeadMeta />
            <Header />
            <div className="breadcrumb breadcrumb--top">
                <a href="/">Главная</a>
                <span>/</span>
                <span style={{ color: "black" }}>Наши работы</span>
            </div>
            <h1 className="works-title">НАШИ РАБОТЫ</h1>
            <div className="category-container__cat">
                <div className="products-column__cat">
                    <div className="biggest-image-container">
                        <img
                            src="/img/cont.JPG"
                            alt="Наши работы"
                            className="category-image__cat"
                        />
                    </div>
                    <div className="products-grid__cat">
                        {works.map((work, idx) => (
                            <WorkCard
                                key={idx}
                                image={work.images[0]}
                                title={work.title}
                                description={work.description}
                                onClick={() => openModal(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {modalOpen && (
                <div className="modal-gallery-overlay" onClick={closeModal}>
                    <div className="modal-gallery" onClick={e => e.stopPropagation()}>
                        <button className="modal-gallery-arrow left" onClick={prevPhoto}>&#8592;</button>
                        <img src={works[modalIndex].images[modalPhotoIndex]} alt="Фото работы" className="modal-gallery-image" />
                        <button className="modal-gallery-arrow right" onClick={nextPhoto}>&#8594;</button>
                        <div className="modal-gallery-thumbs">
                            {works[modalIndex].images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt="thumb"
                                    className={"modal-gallery-thumb" + (i === modalPhotoIndex ? " active" : "")}
                                    onClick={() => setModalPhotoIndex(i)}
                                />
                            ))}
                        </div>
                        <button className="modal-gallery-close" onClick={closeModal}>&times;</button>
                    </div>
                </div>
            )}
            <div className="mobile-works-img-container">
                <img src="/img/cont.JPG" className="mobile-works-img"></img>
                <h4 className="mobile-gallery-text">nigga</h4>
            </div>

            <div className="mobile-works-gallery">
                <PhotoProvider>
                    <PhotoView src="/img/sofa.jpg">
                        <div className="mobile-gallery-element">
                            <div className="mobile-gallery-wrapper">
                                <img className="mobile-gallery-img" src="/img/sofa.jpg" alt="" />
                            </div>
                            <h4 className="mobile-gallery-text">nigga</h4>
                        </div>
                    </PhotoView>
                    <PhotoView src="/img/bed.jpg">
                        <div className="mobile-gallery-element">
                            <div className="mobile-gallery-wrapper">
                                <img className="mobile-gallery-img" src="/img/bed.jpg" alt="" />
                            </div>
                            <h4 className="mobile-gallery-text">nigga</h4>
                        </div>
                    </PhotoView>
                    <PhotoView src="/img/chair.jpg">
                        <div className="mobile-gallery-element">
                            <div className="mobile-gallery-wrapper">
                                <img className="mobile-gallery-img" src="/img/chair.jpg" alt="" />
                            </div>
                            <h4 className="mobile-gallery-text">nigga</h4>
                        </div>
                    </PhotoView>
                    <PhotoView src="/img/kit.jpg">
                        <div className="mobile-gallery-element">
                            <div className="mobile-gallery-wrapper">
                                <img className="mobile-gallery-img" src="/img/kit.jpg" alt="" />
                            </div>
                            <h4 className="mobile-gallery-text">nigga</h4>
                        </div>
                    </PhotoView>
                    <PhotoView src="/img/wal.jpg">
                        <div className="mobile-gallery-element">
                            <div className="mobile-gallery-wrapper">
                                <img className="mobile-gallery-img" src="/img/wal.jpg" alt="" />
                            </div>
                            <h4 className="mobile-gallery-text">nigga</h4>
                        </div>
                    </PhotoView>
                    <PhotoView src="/img/kitchen_main.jpg">
                        <div className="mobile-gallery-element">
                            <div className="mobile-gallery-wrapper">
                                <img className="mobile-gallery-img" src="/img/kitchen_main.jpg" alt="" />
                            </div>
                            <h4 className="mobile-gallery-text">nigga</h4>
                        </div>
                    </PhotoView>
                </PhotoProvider>
            </div>
            <Footer />
        </>
    );
};

export default WorksPage; 