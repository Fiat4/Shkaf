import { useEffect, useState } from 'react'
import ProductCard from '../Components/ProductCard/ProductCard'
import './MainPage.css'
import './ProductPage.css'
import { Link } from 'react-router-dom'
import Header from '../Components/Header/Header'
import HeadMeta from '../Components/HeadMeta/HeadMeta'
import Footer from '../Components/Footer/Footer'
import Popular from '../Components/Popular/Popular'

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

    const reviews = [
    {
        name: "Анна Петрова",
        rating: 5,
        text: "Очень довольна качеством кухни! Все сделано на высшем уровне.",
        image: './img/kit.jpg'
    },
    {
        name: "Игорь Смирнов",
        rating: 4,
        text: "Шкаф немного задержали, но сборка прошла отлично.",
        image: './img/shkaf.jpg'
    },
    {
        name: "Мария Иванова",
        rating: 5,
        text: "Диван просто супер — мягкий и стильный. Рекомендую!",
        image: './img/sofa.jpg'
    }
    ];

    const [activeReview, setActiveReview] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const changeReview = (direction: 'next' | 'prev') => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveReview((prev) => {
            if (direction === 'next') return (prev + 1) % reviews.length;
            return (prev - 1 + reviews.length) % reviews.length;
            });
            setIsAnimating(false);
        }, 200);
    };

    const menuItems = [
    {
        key: menuEn.descr,
        label: 'ОПИСАНИЕ',
        content: `Lorem ipsum dolor sit amet consectetur. A nulla lacus ac sed ullamcorper vitae at sem elementum...`
    },
    {
        key: menuEn.sost,
        label: 'СОСТАВ',
        content: (
        <div className="composition-columns">
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
        </div>
        )
    },
    {
        key: menuEn.dil,
        label: 'ДОСТАВКА',
        content: `Доставка осуществляется в течение 3–5 рабочих дней. Мы предлагаем бесплатную доставку при заказе от 50 000 РУБ.`
    },
    {
        key: menuEn.size,
        label: 'РАЗМЕРЫ',
        content: (
        <div className="composition-columns">
            <div className="column">
            <p>• Ширина: 200 см</p>
            <p>• Высота: 90 см</p>
            </div>
            <div className="column">
            <p>• Глубина: 60 см</p>
            <p>• Вес: 50 кг</p>
            </div>
        </div>
        )
    }
    ];

    const [toggles, setToggles] = useState<boolean[]>(Array(menuItems.length).fill(false));


    return (
        <>
        <HeadMeta/>
        <Header variant='searchless'/>
            
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
                <div className='title-new-container'>
                    <h1 className="product-main-title">КУХНЯ "ДЛЯ ПРОВЕРКИ"</h1>
                    <h5 className="mobile-new-secondary mobile-new-tag">НОВИНКА</h5>
                </div>
                

                <div className='price-button-container'>
                    <div className="product-main-price">
                        <span className="price-current">120 000 РУБ</span>
                        <span className="price-original">136 000 РУБ</span>
                    </div>
                    <button className="add-to-cart-button">В ИЗБРАННОЕ</button>
                </div>

                <div className="product-main-price desktop-only">
                    <span className="price-current">120 000 РУБ</span>
                    <span className="price-original">136 000 РУБ</span>
                </div>
                <div className="button-container desktop-only">
                    <button className="add-to-cart-button">ДОБАВИТЬ В КОРЗИНУ</button>
                    <button className="favorite-button"><i className="fa-regular fa-heart"></i></button>
                </div>
            </div>
        </div>
    </div>
    
    <div className="menu-container desktop-only">
        <div className="menu-items">
            {menuItems.map((item) => (
                <span
                key={item.key}
                className={`menu-item ${menu === item.key ? 'active' : ''}`}
                onClick={() => setMenu(item.key)}
                >
                {item.label}
                </span>
            ))}
            </div>
        <div className="menu-content">
        {menuItems.find((item) => item.key === menu)?.content}
        </div>
    </div>

    <div className='mobile-dropdown'>
        {menuItems.map((item, index) => (
            <div className="product-collapsible-card" key={item.key}>
            <div
                className="product-collapsible-header"
                onClick={() => setToggles((prev) => {
                const newState = [...prev];
                newState[index] = !newState[index];
                return newState;
                })}
            >
                <h4 className="mobile-new-secondary">{item.label}</h4>
                <i className={`fa-solid fa-chevron-up product-arrow-icon-top ${toggles[index] ? "expanded" : ""}`} />
            </div>
            <div
                className={`product-collapsible-content ${toggles[index] ? 'expanded' : ''}`}
                // style={{
                // height: toggles[index] ? "10rem" : "0px",
                // paddingBottom: toggles[index] ? "5%" : "0px",
                // overflow: 'hidden',
                // transition: 'height 0.3s ease'
                // }}
            >
                {item.content}
            </div>
            </div>
        ))}
    </div>
    

    <div className="reviews-rating-container">
        <h2 className="reviews-title">ОТЗЫВЫ И РЕЙТИНГ</h2>
        <Link to="/review" className="open-all-reviews desktop-only">открыть все &#8594;</Link>
        <div className="reviews-columns">
            <div className="ratings-column">
                <div className="ratings-micro-columns">
                    <div className="rating-score">
                        <div className='rating-top'>
                            4.8 
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <div className="rating-bot-text">оценка товара</div>
                    </div>
                    <div className="review-recommend">
                        92% <div className="rating-bot-text">рекомендуют</div>
                    </div>
                </div>
                <div className="rating">
                    <div className="rating-stars-column">
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 5
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 4
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 3
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 2
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 1
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



            <div className="ratings-column desktop-only">
                <div className="ratings-micro-columns">
                    <div className="rating-score">
                        4.8 
                        <i className="fa-solid fa-star"></i>
                        <div className="rating-bot-text">на основе 12 отзывов</div>
                    </div>
                    <div className="review-recommend">
                        92% <div className="rating-bot-text">рекомендуют</div>
                    </div>
                </div>
                <div className="rating">
                    <div className="rating-stars-column">
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 5
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 4
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 3
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 2
                        </div>
                        <div className="rating-item">
                            <i className="fa-solid fa-star"></i> 1
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
            <div className="review-column desktop-only">
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
    <div className="main-review-container">
        <div className={`review-card ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            <div className="review-content">
                <div className="review-name">
                    {reviews[activeReview].name}
                    <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                            <i
                            key={i}
                            className={`fa-star ${i < reviews[activeReview].rating ? 'fa-solid' : 'fa-regular'}`}
                            ></i>
                        ))}
                    </div>
                </div>
                <p className="product-review-text">{reviews[activeReview].text}</p>
                <div className='review-img-wrapper'>
                    <img
                    src={reviews[activeReview].image}
                    alt="Фото отзыва"
                    className="review-photo"
                    />
                </div>
            </div>
            <button
                className="review-button left"
                aria-label="Предыдущий отзыв"
                onClick={() => changeReview('prev')}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button
                className="review-button right"
                aria-label="Следующий отзыв"
                onClick={() => changeReview('next')}
            >
                <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </div>
    <Popular dynamicText='ПОХОЖИЕ ТОВАРЫ'/>
    <Popular dynamicText='МОЖЕТ ПОНРАВИТЬСЯ'/>
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
    <Footer/>
        </>
    )
}

export default ProductPage