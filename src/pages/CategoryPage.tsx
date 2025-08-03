import Footer from "../Components/Footer/Footer"
import Header from "../Components/Header/Header"
import './MainPage.css'
import './CategoryPage.css'
import Filter from "../Components/Filter/Filter"
import ProductCard from "../Components/ProductCard/ProductCard"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import HeadMeta from "../Components/HeadMeta/HeadMeta"

interface ICategoryPageProps {
    product: string
}

const CategoryPage: React.FC<ICategoryPageProps> = ({ product }) => {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    const [categoryItems] = useState([
        { id: 1, image: "/img/bed.jpg", alt: "Кровати", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: true },
        { id: 2, image: "/img/shkaf.jpg", alt: "Шкафы", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false },
        { id: 3, image: "/img/kit.jpg", alt: "Кухни", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false },
        { id: 4, image: "/img/wal.jpg", alt: "Стенки", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false },
        { id: 5, image: "/img/wal.jpg", alt: "Стенки", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false },
        { id: 6, image: "/img/wal.jpg", alt: "Стенки", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false },
        { id: 7, image: "/img/wal.jpg", alt: "Стенки", name: "nigga", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", price: "10000", href: "#", new: false },
    ]);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // wait ~500ms for scroll to finish (adjust as needed)
        setTimeout(() => {
            document.body.classList.add('filters-open')
        }, 500);
    };

    const useWindowWidth = () => {
        const [width, setWidth] = useState<number | null>(null);

        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            handleResize();

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return width;
    };

    const windowWidth = useWindowWidth();
    const isMobile = windowWidth !== null && windowWidth <= 768;

    return (
        <>
            <HeadMeta />
            <Header ref={headerRef} variant="tabless" />
            <div className="category-container__cat">
                <div className="filters-column">
                    <div className="href-header desktop-only">
                        <div className="breadcrumb">
                            <Link to="/">Главная</Link>
                            <span>/</span>
                            <span style={{ color: "black" }}>{product}</span>
                        </div>
                    </div>
                    <div className="mobile-category-top">
                        <img className="top-img" src="../img/kitchen_main.jpg" alt="Кухни" />
                        <div className="category-title-holder">
                            <h1 className="breadcrumb_title">{product.toUpperCase()}</h1>
                            <button className="open-filters-button" onClick={handleClick}>
                                <i className="fa-solid fa-sliders fa-rotate-270"></i>
                            </button>
                        </div>
                    </div>




                    <div className="filter-overlay">
                        <div className="filter-overlay-inner" style={isMobile ? { paddingTop: `${headerHeight + 15}px` } : {}}>
                            <div className="category-title-holder">
                                <h1 className="breadcrumb_title">{product.toUpperCase()}</h1>
                                <button className="open-filters-button" onClick={() => document.body.classList.remove('filters-open')}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <Filter />
                        </div>
                    </div>
                    {/* <Filter/> */}
                </div>

                <div className="mobile-new-container">
                    {categoryItems.map((item, index) => (
                        <div className="mobile-new-item">
                            <div className="mobile-new-img-wrapper">
                                <img className="mobile-new-img" src={item.image} alt={item.alt} />
                            </div>
                            <div className="mobile-new-name-container">
                                <h4 className="mobile-new-primary">{item.name}</h4>
                                {item.new && (
                                    <h5 className="mobile-new-secondary mobile-new-tag">НОВИНКА</h5>
                                )}
                            </div>
                            <h5 className="mobile-new-secondary">{item.description}</h5>
                            <div className="mobile-new-price-container">
                                <h4 className="mobile-new-price">{item.price} руб</h4>
                                <button className="mobile-new-fav-button">
                                    <i className="fa-regular fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="products-column__cat">

                    <div className="search-container">
                        <input type="text" className="search-input" placeholder="ПОИСК" />
                        <button className="search-button">
                            <img src="../img/searcher.png" alt="Поиск" />
                        </button>
                    </div>

                    <div className="biggest-image-container">
                        <img src="../img/kitchen_main.jpg" alt="Кухни" className="category-image__cat" />
                    </div>

                    <div className="products-grid__cat">
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />


                    </div>

                    <div className="pagination">
                        <div className="pagination-numbers">
                            <button className="pagination-button" id="prev-button" aria-label="Предыдущая страница" />
                            <button className="page-number active">1</button>
                            <button className="page-number">2</button>
                            <button className="page-number">3</button>
                            <span className="page-dots">...</span>
                            <button className="page-number">7</button>
                            <button className="pagination-button" id="next-button" aria-label="Следующая страница" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default CategoryPage