import React, { useEffect, useState, useRef } from 'react'
import './MainPage.css'
import './ProductPage.css'
import { Link, useParams } from 'react-router-dom'
import Header from '../Components/Header/Header'
import HeadMeta from '../Components/HeadMeta/HeadMeta'
import Footer from '../Components/Footer/Footer'
import Popular from '../Components/Popular/Popular'
import { ReviewModal, AllReviewsModal, OrderModal, FullscreenImageModal } from '../Components/Modals'
import useApi from '../hook/UseApi'
import IProduct from '../Types/Product'
import { IOrder } from '../Types/Orders'
import { PopUp } from '../Components/PopUp/PopUp'
import { IReview } from '../Types/Reviews'
import { Categories, getRussianCategoryName } from '../Types/ProductCategoriesEnum'

const ReviewCard: React.FC<{ review: IReview }> = ({ review }) => {
    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="reviewer-info">
                    <div className="reviewer-avatar">
                        {review.avatar ? <img src={review.avatar} alt="Аватар пользователя"/> : <span>{review.username.charAt(0)}</span>}
                    </div>
                    <div className="reviewer-details">
                        <h4>{review.username}</h4>
                        <div className="review-rating-stars">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fa-star ${i < review.rating ? 'fa-solid' : 'fa-regular'}`}
                                ></i>
                            ))}
                        </div>
                        <span className="review-date">{new Date(review.created_at).toLocaleDateString('ru-RU', {day: '2-digit',month: '2-digit', year: 'numeric'})}</span>
                    </div>
                </div>
            </div>
            
            <div className="review-content">
                <p>{review.review}</p>
            </div>

            {review.imgs && review.imgs.length > 0 && (
                <div className="review-photos">
                    <div className="main-photo">
                        <img src={review.imgs[0]} alt="Фото отзыва"/>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProductPage: React.FC = () => {

    const params = useParams()

    const {getProductsById, loading: productLoading, error:productError, data:productData} = useApi<IProduct>()
    const OrderApi = useApi<IOrder>()
    const createReviweApi = useApi<IReview>()
    const product = productData

    const getReviewApi = useApi<{reviews: IReview[], averageRating: number,totalReviews: number, ratingDistribution: any }>()
    useEffect(() => {
        if (params.id) {
            getProductsById(params.id)
            getReviewApi.getProductReview(params.id)
            setCurrentImageIndex(0)

            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 50);
        }
    }, [params.id])

    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false)
    const [popUp, setPopUp] = useState<boolean>(false)

    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

    const [desktopDropdown, setDesktopDropdown] = useState<'desc' | 'materials' | 'size' | 'delviery'>('desc')
    const [mobileDropdown, setMobileDropdown] = useState<{desc: boolean, materials: boolean, size: boolean, delviery: boolean}>({desc: true, materials: false, size: false, delviery: false})

    const [showAllReviewsModal, setShowAllReviewsModal] = useState<boolean>(false);

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLDivElement>(null);
    
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
    const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);

    useEffect(() => {
        if (carouselRef.current) {
            const activeItem = carouselRef.current.querySelector('.carousel-item.active') as HTMLElement;
            if (activeItem) {
                activeItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [currentImageIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPreviousImage();
            } else if (e.key === 'ArrowRight') {
                goToNextImage();
            }
        };

        if (product) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [productData, currentImageIndex]);

    const goToPreviousImage = () => {
        if (product) {
            const totalImages = [product.avatar, ...product.imgs].length;
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? totalImages - 1 : prevIndex - 1
            );
        }
    };

    const goToNextImage = () => {
        if (product) {
            const totalImages = [product.avatar, ...product.imgs].length;
            setCurrentImageIndex((prevIndex) => 
                prevIndex === totalImages - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const getCurrentImage = () => {
        if (product) {
            const images = [product.avatar, ...product.imgs];
            return images[currentImageIndex] || product.avatar;
        }
        return '';
    };

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNextImage();
        }
        if (isRightSwipe) {
            goToPreviousImage();
        }
    };

    const openFullscreen = () => {
        setIsFullscreenOpen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreenOpen(false);
    };

    const handleFullscreenSwipe = (e: React.TouchEvent) => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNextImage();
        }
        if (isRightSwipe) {
            goToPreviousImage();
        }
    };

    if (productLoading) {
        return (
            <>
                <HeadMeta title="Загрузка товара" noindex />
                <Header variant='searchless' />
                <div style={{ padding: '80px', textAlign: 'center' }}>Загрузка товара...</div>
            </>
        )
    }

    if (!params.id || productError || !product) {
        return (
            <>
                <HeadMeta title="Товар не найден" noindex />
                <Header variant='searchless' />
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <h1>Товар не найден</h1>
                    <Link to="/">Вернуться на главную</Link>
                </div>
            </>
        )
    }

    const productDescription =
        product.description?.length > 160
            ? `${product.description.slice(0, 157)}...`
            : product.description || `${product.name} — мебель на заказ от Locker Wood.`;

    return (
        <>
            <HeadMeta
                title={product.name}
                description={productDescription}
                keywords={`${product.name}, ${getRussianCategoryName(product.category)}, мебель на заказ, Locker Wood`}
                image={product.avatar}
            />
            <Header variant='searchless' />

            <div className="breadcrumb">
                <Link to="/">Главная</Link>
                <span>/</span>
                <Link to={`/category/${product.category.toLowerCase()}`}>{getRussianCategoryName(product.category)}</Link>
                <span>/</span>
                <span className="current">{product.name}</span>
            </div>
            {openOrderModal && (
                    <OrderModal 
                        onClose={() => setOpenOrderModal(false)}
                        api={OrderApi}
                        productId={params.id}
                        setNotification={() => setPopUp(true)} 
                    /> 
               )}
                 {popUp && OrderApi.data && <PopUp message="Заявка успешно отправлена! Мы перезвоним вам позже!" status="success" showTime={3000} setStateFunction={setPopUp}/>}
                            {popUp && OrderApi.error && <PopUp message="Ошибка отправки! Попробуйте позже." status="error" showTime={3000} setStateFunction={setPopUp}/>}
            <div className="category-container">
                <div className="large-image-column">
                    <div className="main-image-container" ref={mainImageRef}>
                        <img 
                            src={getCurrentImage()} 
                            alt="Кухни" 
                            className="main-category-image"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onClick={openFullscreen}
                        />
                        <button
                            className="carousel-button left"
                            aria-label="Предыдущая картинка"
                            onClick={goToPreviousImage}
                        >
                            &lsaquo;
                        </button>
                        <button
                            className="carousel-button right"
                            aria-label="Следующая картинка"
                            onClick={goToNextImage}
                        >
                            &rsaquo;
                        </button>
                    </div>
                    <div className="carousel" ref={carouselRef}>
                        {[product.avatar, ...product.imgs].map((item, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`carousel-item ${i === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => goToImage(i)}
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
                            <h1 className="product-main-title">{product.name}</h1>
                        </div>

                        <div className='price-button-container'>
                            <button onClick={() => setOpenOrderModal(true)} className="add-to-cart-button">ЗАКАЗАТЬ</button>
                        </div>

                        <div className="desktop-favorite-button-container">
                            <button onClick={() => setOpenOrderModal(true)} className="desktop-favorite-button">
                                <i className="fa-solid fa-shopping-cart"></i>
                                <span>ЗАКАЗАТЬ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="menu-container desktop-only">
                <div className="menu-items">
                    <span className={`menu-item ${desktopDropdown === 'desc' ? 'active' : ''}`} onClick={() => setDesktopDropdown('desc')}>ОПИСАНИЕ</span>
                    <span className={`menu-item ${desktopDropdown === 'materials' ? 'active' : ''}`} onClick={() => setDesktopDropdown('materials')}>СОСТАВ</span>
                    <span className={`menu-item ${desktopDropdown === 'size' ? 'active' : ''}`} onClick={() => setDesktopDropdown('size')}>РАЗМЕРЫ</span>
                    <span className={`menu-item ${desktopDropdown === 'delviery' ? 'active' : ''}`} onClick={() => setDesktopDropdown('delviery')}>ДОСТАВКА</span>
                </div>
                <div className="menu-content">
                    {desktopDropdown === 'desc' && <div>{product.description}</div>}
                    {desktopDropdown === 'materials' && <div>{product.materials}</div>}
                    {desktopDropdown === 'size' && <div>{product.width} x {product.height} x {product.depth}</div>}
                    {desktopDropdown === 'delviery' && <div>Бесплатная доставка по Москве и области. Доставка транспортными компаниями.</div>}
                </div>
            </div>

            <div className='mobile-dropdown'>
                <div className="product-collapsible-card" onClick={() => setMobileDropdown(v => ({...v, desc: !v.desc}))}>
                    <div className="product-collapsible-header">
                        <h4 className="mobile-new-secondary">ОПИСАНИЕ</h4>
                        <i className="fa-solid fa-chevron-up product-arrow-icon-top" />
                    </div>
                    <div className={`product-collapsible-content ${mobileDropdown.desc ? "expanded" : ""}`}>
                        <div>{product.description}</div>
                    </div>
                </div>
                <div className="product-collapsible-card" onClick={() => setMobileDropdown(v => ({...v, materials: !v.materials}))}>
                    <div className="product-collapsible-header">
                        <h4 className="mobile-new-secondary">СОСТАВ</h4>
                        <i className="fa-solid fa-chevron-up product-arrow-icon-top" />
                    </div>
                    <div className={`product-collapsible-content ${mobileDropdown.materials ? "expanded" : ""}`}>
                        <div className="composition-columns">
                            <div>{product.materials}</div>
                        </div>
                    </div>
                </div>
                <div className="product-collapsible-card" onClick={() => setMobileDropdown(v => ({...v, size: !v.size}))}>
                    <div className="product-collapsible-header">
                        <h4 className="mobile-new-secondary">РАЗМЕРЫ</h4>
                        <i className="fa-solid fa-chevron-up product-arrow-icon-top" />
                    </div>
                    <div className={`product-collapsible-content ${mobileDropdown.size ? 'expanded' : ''}`} >
                        <div className="composition-columns">
                            {mobileDropdown.size && (
                            <>
                                <div className="column">
                                    <p>• Ширина: {product.width} см</p>
                                    <p>• Высота: {product.height} см</p>
                                </div>
                                <div className="column">
                                    <p>• Глубина: {product.depth} см</p>
                                </div>
                            </>
                               

                           )}
                        </div>
                    </div>
                </div>

                <div className="product-collapsible-card" onClick={() => setMobileDropdown(v => ({...v, delviery: !v.delviery}))}>
                    <div className="product-collapsible-header">
                        <h4 className="mobile-new-secondary">Доставка</h4>
                        <i className="fa-solid fa-chevron-up product-arrow-icon-top" />
                    </div>
                    <div className={`product-collapsible-content ${mobileDropdown.delviery ? "expanded" : ""}`}>
                        <div>Бесплатная доставка в пределах мкад. Доставка в регионы транспортными компаниями.</div>
                    </div>
                </div>
            </div>

            <div className="reviews-rating-container">
                <h2 className="reviews-title">ОТЗЫВЫ И РЕЙТИНГ</h2>
                <div className="reviews-columns">
                    <div className="ratings-column mobile">
                        <div className="ratings-micro-columns">
                        
                            <><div className="rating-score">
                                <div className='rating-top'>
                                    {getReviewApi.data ? getReviewApi.data.averageRating.toFixed(1) : 0}
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="rating-bot-text">оценка товара</div>
                            </div>
                            <div className="review-recommend">
                                {getReviewApi.data ? ((getReviewApi.data.averageRating/5)*100).toFixed(0) : 0}% <div className="rating-bot-text">рекомендуют</div>
                            </div> </>
                        </div>
                        <div className="rating">
                            <div className="rating-stars-column">
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>5
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>4
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>3
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>2
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>1
                                </div>
                            </div>
                            <div className="rating-lines-column">
                            
                                {
                                    getReviewApi.data ? Object.entries(getReviewApi.data.ratingDistribution || {})
                                        .map(([rating, data]: [string, any]) => ({
                                        rating: parseInt(rating),
                                        count: data.count,
                                        percentage: data.percentage
                                        }))
                                        .sort((a, b) => b.rating - a.rating)
                                        .map((item) => {
                                            console.log(item)
                                            return <div key={item.rating} className="line-item" style={{ '--percentage': `${item.percentage}%`} as React.CSSProperties}></div>
                                        }) : (
                                            <>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                            </>
                                        )
                                } 
                            </div>
                            <div className="rating-percentages-column">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className="percentage-item">
                                        {getReviewApi.data?.ratingDistribution?.[rating]?.percentage.toFixed(0) || 0}%
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="ratings-column desktop-only">
                        <div className="ratings-micro-columns">
                            <div className="rating-score">
                                <div className='rating-score-top'>
                                    {getReviewApi.data ? getReviewApi.data.averageRating.toFixed(1) : 0}
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="rating-bot-text">на основе {getReviewApi.data ? getReviewApi.data.totalReviews : 0} отзывов</div>
                            </div>
                            <div className="review-recommend">
                                { getReviewApi.data ? ((getReviewApi.data.averageRating/5)*100).toFixed(0) : 0}% <div className="rating-bot-text">рекомендуют</div>
                            </div>
                        </div>
                        <div className="rating">
                            <div className="rating-stars-column">
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>5
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>4
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>3
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>2
                                </div>
                                <div className="rating-item">
                                        <i className="fa-solid fa-star"></i>1
                                </div>
                            </div>
                            <div className="rating-lines-column">
                                
                                {
                                   getReviewApi.data ? Object.entries(getReviewApi.data.ratingDistribution || {})
                                        .map(([rating, data]: [string, any]) => ({
                                        rating: parseInt(rating),
                                        count: data.count,
                                        percentage: data.percentage
                                        }))
                                        .sort((a, b) => b.rating - a.rating)
                                        .map((item) => {
                                            console.log(item)
                                            return <div key={item.rating} className="line-item" style={{ '--percentage': `${item.percentage}%`} as React.CSSProperties}></div>
                                        }) : (
                                            <>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                                <div className="line-item"></div>
                                            </>
                                        )
                                }
                            </div>
                            <div className="rating-percentages-column">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className="percentage-item">
                                    {getReviewApi.data?.ratingDistribution?.[rating]?.percentage.toFixed(0) || 0}%
                                </div>
                            ))}
                            </div>
                        </div>
                    </div> 
                    <div className="review-column">
                        <div className="review-header">
                            <h3>ОТЗЫВЫ ({getReviewApi.data ? getReviewApi.data.reviews.length : 0})</h3>
                            <div className="review-stats">
                                <span className="review-count">{getReviewApi.data ? getReviewApi.data.reviews.length: 0} отзывов</span>
                                <span className="review-rating">{getReviewApi.data ? getReviewApi.data.averageRating.toFixed(1) : 0} ★</span>
                            </div>
                            <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>
                                <i className="fa-solid fa-plus"></i>
                                ОСТАВИТЬ ОТЗЫВ
                            </button>
                        </div>
                    {getReviewApi.data && (
                        <div className="reviews-preview">
                            {!getReviewApi.loading && !getReviewApi.error &&
                            getReviewApi.data.reviews.slice(0,2).map((review: IReview) => (
                                <ReviewCard 
                                    key={review.id} 
                                    review={review} 
                                />
                            ))}
                        </div>
                    )}
                       
                        { getReviewApi.data && getReviewApi.data.reviews.length > 2 && (
                                <button 
                                className="show-all-reviews-btn" 
                                onClick={() => setShowAllReviewsModal(true)}
                                disabled={!getReviewApi.data ? true : false}
                                >
                                Посмотреть все отзывы ({getReviewApi.data.reviews.length})
                                </button>
                        )}
                       
                    </div>
                </div>
                
                <ReviewModal
                    productId={params.id}
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    api={createReviweApi}
                    setNotification={() => setPopUp(true)} 
                />
                {popUp && createReviweApi.data && <PopUp message="Спасибо за отзыв!" status="success" showTime={3000} setStateFunction={setPopUp}/>}
                {popUp && createReviweApi.error && <PopUp message="Ошибка отправки! Попробуйте позже." status="error" showTime={3000} setStateFunction={setPopUp}/>}
                        {getReviewApi.data && (
                <AllReviewsModal
                    isOpen={showAllReviewsModal}
                    onClose={() => setShowAllReviewsModal(false)}
                    reviews={getReviewApi.data.reviews}
                />
                        )}
            </div> 
            <Popular dynamicText='МОЖЕТ ПОНРАВИТЬСЯ' />

            <FullscreenImageModal
                isOpen={isFullscreenOpen}
                onClose={closeFullscreen}
                currentImage={getCurrentImage()}
                currentIndex={currentImageIndex}
                totalImages={[product.avatar, ...product.imgs].length}
                onPrevious={goToPreviousImage}
                onNext={goToNextImage}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={handleFullscreenSwipe}
            />

            <Footer />
        </>
    )
}

export default ProductPage