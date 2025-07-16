import { useEffect, useState } from 'react'
import ProductCard from '../Components/ProductCard/ProductCard'
import './MainPage.css'
import './ProductPage.css'
import { Link } from 'react-router-dom'
import Header from '../Components/Header/Header'

enum menuEn {
    descr = 'descr',
    sost='sost',
    dil='dil',
    size='size'
}

const ProductPage: React.FC = () => {
    const [menu, setMenu] = useState<menuEn>(menuEn.descr)
    const [activeImg, setActiveImg] = useState<number>(0)
    const images = [
        './img/kit.jpg',
        './img/kitchen.jpg',
        './img/shkaf.jpg',
        './img/wal.jpg',
        './img/bed.jpg',
        './img/chair.jpg',
        './img/sofa.jpg'
    ];

    // Функции для слайдера
    const nextImage = () => {
        setActiveImg((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImg((prev) => (prev - 1 + images.length) % images.length);
    };

    // Обработчики клавиш
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

    const menuView = menu === menuEn.descr ? `Lorem ipsum dolor sit amet consectetur. A nulla lacus ac sed ullamcorper vitae at sem elementum. Nunc fringilla sed pellentesque gravida viverra. Quis aenean bibendum semper nullam et. Netus elementum accumsan phasellus ac sem pulvinar. Sit morbi at neque pharetra blandit arcu lectus at turpis. Augue fermentum porta convallis non est non pharetra egestas vehicula. Fermentum sit auctor adipiscing ac. Molestie ornare ut maecenas amet aenean habitant. Auctor amet placerat egestas adipiscing rhoncus egestas.` : menu === menuEn.sost ? (<div className="composition-columns">
                <div className="column">
                    <p>• Дерево</p>
                    <p>• МДФ</p>
                    <p>• Стекло</p>
                </div>
                <div className="column">
                    <p>• Металл</p>
                    <p>• Пластик</p>
                    <p>• Ткань</p>
                </div>
            </div>) : menu === menuEn.dil ? `Доставка осуществляется в течение 3-5 рабочих дней. Мы предлагаем бесплатную доставку при заказе от 50 000 РУБ.` : (<div className="composition-columns">
                <div className="column">
                    <p>• Ширина: 200 см</p>
                    <p>• Высота: 90 см</p>
                </div>
                <div className="column">
                    <p>• Глубина: 60 см</p>
                    <p>• Вес: 50 кг</p>
                </div>
            </div>)

    return (
        <>
        <Header/>
            
    <div className="breadcrumb">
        <Link to="../../index.html">Главная</Link>
        <span>/</span>
        <Link to="/category/kitchens">Кухни</Link>
        <span>/</span>
        <span style={{color: 'black'}}>Кухня "Для проверки"</span>
    </div>

    <div className="category-container">
        <div className="large-image-column">
            <div className="main-image-container">
                <img src={images[activeImg]} alt="Кухни" className="main-category-image"/>
                <button 
                    className="carousel-button left" 
                    aria-label="Предыдущая картинка"
                    onClick={prevImage}
                >
                    &lsaquo;
                </button>
                <button 
                    className="carousel-button right" 
                    aria-label="Следующая картинка"
                    onClick={nextImage}
                >
                    &rsaquo;
                </button>
            </div>
            <div className="carousel">
                {images.map((item, i) => {
                    return (
                        <div 
                            key={i}
                            className={`carousel-item ${i === activeImg ? 'active' : ''} ${i < activeImg - 2 || i > activeImg + 2 ? 'partial' : ''}`} 
                            onClick={() => setActiveImg(i)}
                        >
                            <img src={item} alt="Миниатюра" />
                        </div>
                    )
                })}
            </div>
        </div>
        <div className="right-column">
            <div className="product-main-title-container">
                <h1 className="product-main-title">КУХНЯ "ДЛЯ ПРОВЕРКИ"</h1>
                <div className="product-main-price">
                    <span className="price-current">120 000 РУБ</span>
                    <span className="price-original">136 000 РУБ</span>
                </div>
                <div className="button-container">
                    <button className="add-to-cart-button">ДОБАВИТЬ В КОРЗИНУ</button>
                    <button className="favorite-button"><i className="fa-regular fa-heart"></i></button>
                </div>
            </div>
        </div>
    </div>
    
    <div className="menu-container">
        <div className="menu-items">
            <span className={`menu-item ${menu === menuEn.descr ? 'active' : ''}`} onClick={() => setMenu(menuEn.descr)}>ОПИСАНИЕ</span>
            <span className={`menu-item ${menu === menuEn.sost ? 'active' : ''}`} onClick={() => setMenu(menuEn.sost)}>СОСТАВ</span>
            <span className={`menu-item ${menu === menuEn.dil ? 'active' : ''}`} onClick={() => setMenu(menuEn.dil)}>ДОСТАВКА</span>
            <span className={`menu-item ${menu === menuEn.size ? 'active' : ''}`} onClick={() => setMenu(menuEn.size)}>РАЗМЕРЫ</span>
        </div>
        <div className="menu-content">{menuView}</div>
    </div>

    <div className="reviews-rating-container">
        <h2 className="reviews-title">ОТЗЫВЫ И РЕЙТИНГ</h2>
        <Link to="/review" className="open-all-reviews">открыть все &#8594;</Link>
        <div className="reviews-columns">
            <div className="ratings-column">
                <div className="ratings-micro-columns">
                    <div className="rating-score">
                        4.8 <span className="star">&#128970;</span>
                        <div className="rating-bot-text">на основе 12 отзывов</div>
                    </div>
                    <div className="review-recommend">
                        92% <div className="rating-bot-text">рекомендуют</div>
                    </div>
                </div>
                <div className="rating">
                    <div className="rating-stars-column">
                        <div className="rating-item">
                            <span className="star">&#128970;</span> 5
                        </div>
                        <div className="rating-item">
                            <span className="star">&#128970;</span> 4
                        </div>
                        <div className="rating-item">
                            <span className="star">&#128970;</span> 3
                        </div>
                        <div className="rating-item">
                            <span className="star">&#128970;</span> 2
                        </div>
                        <div className="rating-item">
                            <span className="star">&#128970;</span> 1
                        </div>
                    </div>
                    <div className="rating-lines-column">
                        <div className="line-item" data-width="75"></div>
                        <div className="line-item" data-width="25"></div>
                        <div className="line-item" data-width="0"></div>
                        <div className="line-item" data-width="0"></div>
                        <div className="line-item" data-width="0"></div>
                    </div>
                    <div className="rating-percentages-column">
                        <div className="percentage-item">75%</div>
                        <div className="percentage-item">25%</div>
                        <div className="percentage-item">0%</div>
                        <div className="percentage-item">0%</div>
                        <div className="percentage-item">0%</div>
                    </div>
                </div>
            </div>
            <div className="review-column">
                <div className="review-line">
                    <div className="review-left-arrow">
                            -
                    </div>
                    <div className="review">
                        <h3>МИХАИЛ КОРОВИН <span className="star">&#128970;&#128970;&#128970;&#128970;&#128970;</span></h3>
                        <div className="review-text">
                            <p>Отличная кухня, очень удобная и практичная. Материал качественный, дизайн соответствует моим ожиданиям. Спасибо за оперативную доставку и установку!</p>
                            <img src="../img/kitchen.jpg" alt="Отзыв 1"/>
                            <img src="../img/kit.jpg" alt="Отзыв 1"/>
                        </div>
                    </div>
                    <div className="review-right-arrow">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>

    <section className="similar-products-section" id="similar">
        <div className="products-header">
            <h2 className="reviews-title">
                <span>ПОХОЖИЕ ТОВАРЫ</span>
            </h2>
        </div>
        <div className="products-grid">
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
        </div>
    </section>
        </>
    )
}

export default ProductPage