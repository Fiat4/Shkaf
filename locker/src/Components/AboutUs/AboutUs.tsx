import React, { useState, useEffect, useRef, useCallback } from "react";

type AboutUsProps = {
    category?: string;
};

const AboutUs: React.FC<AboutUsProps> = ({ category }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isWhySectionVisible, setIsWhySectionVisible] = useState(false);
    const [screenDarkness, setScreenDarkness] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrollingUp, setIsScrollingUp] = useState(false);

    const getCategoryImage = () => {
        switch (category) {
            case 'kitchen':
                return './img/kitchen_mainn.jpg';
            case 'walls':
                return './img/walls_main.jpg';
            case 'hallway':
                return './img/hallway_main.jpg';
            case 'bathroom':
                return './img/bathroom_main.jpg';
            case 'wardrobe':
                return './img/wardrobe_main.jpg';
            default:
                return './img/kitchen_mainn.jpg';
        }
    };
    
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScrollOptimized = useCallback(() => {
        const currentScrollY = window.scrollY;
        
        const scrollingUp = currentScrollY < lastScrollY;
        setIsScrollingUp(scrollingUp);
        setLastScrollY(currentScrollY);

        const aboutSection = document.querySelector('.about-us-section');
        const whySection = document.querySelector('.why-choose-us-section');
        const gallerySection = document.querySelector('.about-us-gallery-section');
        
        if (aboutSection && whySection) {
            const aboutRect = aboutSection.getBoundingClientRect();
            const whyRect = whySection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const totalDistance = whyRect.top - aboutRect.bottom;
            const scrolledDistance = windowHeight - aboutRect.bottom;
            const progress = Math.max(0, Math.min(1, scrolledDistance / totalDistance));
            
            setScrollProgress(progress);

            const whySectionTop = whyRect.top;
            const whySectionBottom = whyRect.bottom;
            const isVisible = whySectionTop < windowHeight && whySectionBottom > 0;
            setIsWhySectionVisible(isVisible);
            
            let darknessProgress = 0;
            
            if (scrollingUp) {
                darknessProgress = 0;
            } else {
                if (gallerySection) {
                    const galleryRect = gallerySection.getBoundingClientRect();
                    if (galleryRect.top < windowHeight && galleryRect.bottom > 0) {
                        darknessProgress = 0;
                    } else {
                         if (whySectionTop < windowHeight && whySectionBottom > 0) {
                             if (whySectionTop >= 0) {
                                 darknessProgress = 1;
                             } else {
                                 const visibleHeight = Math.min(whyRect.height, whySectionBottom);
                                 const threshold = windowHeight * 0.5;
                                 if (visibleHeight > threshold) {
                                     darknessProgress = Math.min(1, (visibleHeight - threshold) / (windowHeight * 0.3));
                                 } else {
                                     darknessProgress = 0;
                                 }
                             }
                         } else if (whySectionTop > windowHeight) {
                             const distanceFromBottom = whySectionTop - windowHeight;
                             const maxDistance = windowHeight * 0.1;
                             darknessProgress = Math.max(0, 1 - (distanceFromBottom / maxDistance));
                         }
                    }
                } else {
                    if (whySectionTop < windowHeight && whySectionBottom > 0) {
                        if (whySectionTop >= 0) {
                            darknessProgress = 1;
                        } else {        
                            const visibleHeight = Math.min(whyRect.height, whySectionBottom);
                            const threshold = windowHeight * 0.5;
                            if (visibleHeight > threshold) {
                                darknessProgress = Math.min(1, (visibleHeight - threshold) / (windowHeight * 0.3));
                            } else {
                                darknessProgress = 0;
                            }
                        }
                    } else if (whySectionTop > windowHeight) {
                        const distanceFromBottom = whySectionTop - windowHeight;
                        const maxDistance = windowHeight * 0.1;
                        darknessProgress = Math.max(0, 1 - (distanceFromBottom / maxDistance));
                    }
                }
            }
            
            setScreenDarkness(darknessProgress);
        }
    }, [lastScrollY]);

     useEffect(() => {
         let timeoutId: NodeJS.Timeout;
         
         const scrollHandler = () => {
             if (timeoutId) {
                 clearTimeout(timeoutId);
             }
             
             timeoutId = setTimeout(() => {
                 handleScrollOptimized();
             }, 16);
         };
         
         window.addEventListener('scroll', scrollHandler, { passive: true });
         
         return () => {
             window.removeEventListener('scroll', scrollHandler);
             if (timeoutId) {
                 clearTimeout(timeoutId);
             }
             if (scrollTimeoutRef.current) {
                 clearTimeout(scrollTimeoutRef.current);
             }
         };
     }, [handleScrollOptimized]);

    return (
        <>
            <div 
                className="screen-darkness-overlay"
                style={{
                    opacity: screenDarkness
                }}
            ></div>
            
            <div 
                className={`green-shadow-overlay ${isWhySectionVisible ? 'visible' : ''}`}
            ></div>
    
            <section id="about" className="about-us-section">
                <div className="about-us-container">
                    <div className="about-us-header">
                        <h2 className="about-us-title">О НАС</h2>
                        <div className="about-us-divider"></div>
                    </div>

                    <div className="about-us-content">
                        <div className="about-us-image-container">
                            <img 
                                src={getCategoryImage()} 
                                alt="Locker Wood - качественная мебель" 
                                className="about-us-main-image"
                            />
                            <div className="about-us-image-overlay">
                                <div className="about-us-badge">
                                    <span className="about-us-badge-text">С 2020 года</span>
                                </div>
                            </div>
                        </div>

                        <div className="about-us-text-container">
                            <div className="about-us-text-content">
                                <h3 className="about-us-subtitle">
                                    Locker Wood — мебель, в которую влюбляются
                                </h3>
                                <p className="about-us-description">
                                    Приветствуем вас в Locker Wood — молодой, но страстно увлечённой мебельной мастерской, 
                                    где каждая деталь создаётся с мыслью о вас. Мы специализируемся на создании уникальной, 
                                    качественной мебели, которая не просто украшает ваш дом, но и становится его душой.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="about-us-features">
                        <div className="about-us-feature">
                            <div className="about-us-feature-icon">
                                <i className="fas fa-leaf"></i>
                            </div>
                            <div className="about-us-feature-text">
                                <h4>Экологичные материалы</h4>
                                <p>Используем только натуральное дерево и безопасные материалы</p>
                            </div>
                        </div>
                        
                        <div className="about-us-feature">
                            <div className="about-us-feature-icon">
                                <i className="fas fa-tools"></i>
                            </div>
                            <div className="about-us-feature-text">
                                <h4>Ручная работа</h4>
                                <p>Каждое изделие создается мастерами с многолетним опытом</p>
                            </div>
                        </div>
                        
                        <div className="about-us-feature">
                            <div className="about-us-feature-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <div className="about-us-feature-text">
                                <h4>Индивидуальный подход</h4>
                                <p>Создаем мебель специально под ваши потребности и стиль</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="scroll-to-next-container">
                    <div className="scroll-progress-bar">
                        <div 
                            className="scroll-progress-fill" 
                            style={{ width: `${scrollProgress * 100}%` }}
                        ></div>
                    </div>
                    
                    <div className="scroll-hint">
                        <span>Прокрутите вниз</span>
                        <div className="scroll-hint-arrow">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12l7 7 7-7"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <section 
                className={`why-choose-us-section ${isWhySectionVisible ? 'visible' : ''}`}
            >
                <div className="why-choose-us-container">
                    <div className="why-choose-us-header">
                        <h2 className="why-choose-us-title">
                            <span className="why-choose-us-title-accent">ПОЧЕМУ</span> ВЫБИРАЮТ 
                            <br />
                            ИМЕННО <span className="why-choose-us-title-accent">НАС</span>
                        </h2>
                    </div>

                    <div className="why-choose-us-grid">
                        <div className="why-choose-us-card">
                            <div className="why-choose-us-card-image">
                                <img src="./img/cont_1.jpg" alt="Качество материалов" />
                                <div className="why-choose-us-card-overlay">
                                    <div className="why-choose-us-card-number">01</div>
                                </div>
                            </div>
                            <div className="why-choose-us-card-content">
                                <h3 className="why-choose-us-card-title">МЫ ЗА КАЧЕСТВО</h3>
                                <p className="why-choose-us-card-description">
                                    Мы гарантируем высокое качество нашей продукции и используем только лучшие материалы. 
                                    Наша команда профессионалов следит за каждым этапом производства, чтобы вы получили идеальный результат.
                                </p>
                            </div>
                        </div>

                        <div className="why-choose-us-card">
                            <div className="why-choose-us-card-image">
                                <img src="./img/cont_2.jpg" alt="Помощь с идеями" />
                                <div className="why-choose-us-card-overlay">
                                    <div className="why-choose-us-card-number">02</div>
                                </div>
                            </div>
                            <div className="why-choose-us-card-content">
                                <h3 className="why-choose-us-card-title">ПОМОЖЕМ С ИДЕЕЙ</h3>
                                <p className="why-choose-us-card-description">
                                    Наши дизайнеры помогут воплотить ваши мечты в жизнь. От концепции до готового изделия — 
                                    мы сопровождаем вас на каждом этапе создания идеальной мебели для вашего дома.
                                </p>
                            </div>
                        </div>

                        <div className="why-choose-us-card">
                            <div className="why-choose-us-card-image">
                                <img src="./img/cont_3.jpg" alt="Индивидуальный подход" />
                                <div className="why-choose-us-card-overlay">
                                    <div className="why-choose-us-card-number">03</div>
                                </div>
                            </div>
                            <div className="why-choose-us-card-content">
                                <h3 className="why-choose-us-card-title">ИНДИВИДУАЛЬНЫЙ ПОДХОД</h3>
                                <p className="why-choose-us-card-description">
                                    Каждый проект уникален. Мы создаем мебель специально под ваши потребности, 
                                    учитывая особенности пространства, стиль интерьера и ваши личные предпочтения.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-us-gallery-section">
                <div className="about-us-gallery-container">
                    <div className="about-us-gallery-header">
                        <div className="about-us-gallery-title-container">
                            <h2 className="about-us-gallery-title">НАШИ РАБОТЫ</h2>
                            <a href="/works" className="about-us-gallery-portfolio-btn">
                                Перейти к портфолио
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                </svg>
                            </a>
                        </div>
                        <p className="about-us-gallery-subtitle">
                            Посмотрите на примеры нашей работы и вдохновитесь идеями для вашего дома
                        </p>
                    </div>
                    
                    <div className="about-us-gallery-grid">
                        <div className="about-us-gallery-item about-us-gallery-item-large">
                            <img src="./img/Portfolio/work_2_1.jpg" alt="Работа 1" />
                            <div className="about-us-gallery-overlay">
                                <div className="about-us-gallery-info">
                                    <h4>Кухонный гарнитур</h4>
                                    <p>Комфортное и удобмное решение</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="about-us-gallery-item">
                            <img src="./img/Portfolio/work_3_1.jpg" alt="Работа 2" />
                            <div className="about-us-gallery-overlay">
                                <div className="about-us-gallery-info">
                                    <h4>Стенка</h4>
                                    <p>Уютная стена с закрытыми секциями</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="about-us-gallery-item">
                            <img src="./img/Portfolio/work_5_1.jpg" alt="Работа 3" />
                            <div className="about-us-gallery-overlay">
                                <div className="about-us-gallery-info">
                                    <h4>Прихожая</h4>
                                    <p>Вместительная прихожая</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="about-us-gallery-item">
                            <img src="./img/Portfolio/work_1_1.jpg" alt="Работа 4" />
                            <div className="about-us-gallery-overlay">
                                <div className="about-us-gallery-info">
                                    <h4>Шкаф</h4>
                                    <p>Распашной шкаф</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutUs