import Footer from "../Components/Footer/Footer"
import Header from "../Components/Header/Header"
import './MainPage.css'
import './CategoryPage.css'
import Filter from "../Components/Filter/Filter"
import ProductCard from "../Components/ProductCard/ProductCard"
import OrderModal from "../Components/OrderModal/OrderModal"
import "../Components/OrderModal/OrderModal.css"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import HeadMeta from "../Components/HeadMeta/HeadMeta"
import useApi from "../hook/UseApi"
import {Categories, CategoriesPathParam, getCategoryNameSafe} from "../Types/ProductCategoriesEnum";
import { ProductsResponse } from "../Types/Product"
import { CircularProgress } from "@mui/material"
import { PaginationMeta } from "../Types/ApiResponse"


const CategoryPage: React.FC = () => {
    const {category} = useParams<{ category: CategoriesPathParam }>()
    const [popularSortOrder, setPopularSortOrder] = useState<null | 'desc' | 'asc'>(null)
    const [page, setPage] = useState<number>(1) 
    const {getCategoryPageContent, data, loading, error} = useApi<ProductsResponse>()
    const [ searchWord, setSearchWord] = useState<string>('')
    const navigate = useNavigate();

    const getCategoryImage = () => {
        switch (category) {
            case 'kitchen':
                return '../img/Kitchen_1_1.JPG';
            case 'walls':
                return '../img/wall_1.jpg';
            case 'hallway':
                return '../img/prihozh_1.JPG';
            case 'bathroom':
                return '../img/San_1.PNG';
            case 'wardrobe':
                return '../img/shkaf_1_1.JPG';
            case 'bedrooms':
                return '../img/Bed.PNG';
            default:
                return '../img/kitchen_main.jpg';
        }
    };
    useEffect(()=> {
        if (!category || !Object.keys(Categories).includes(category.toUpperCase())) {
            navigate('/')
        }
    } ,[])

    useEffect(() => {
        setPage(1);
    }, [ searchWord, popularSortOrder]);

    useEffect(() => {
        setPage(1);
        setSearchWord('')
        setPopularSortOrder(null)
    }, [category]);

    useEffect(() => {   
        if (category) {
            getCategoryPageContent(category, page, popularSortOrder, searchWord ,4)
        }
    }, [popularSortOrder,category, page, searchWord]);


    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            document.body.classList.add('filters-open')
        }, 500);
    };

    const categoryTitle = category ? getCategoryNameSafe(category) : 'Каталог';
    const categoryImage = getCategoryImage().replace(/^\.\.\//, '/');

    return (
        <>
            <HeadMeta
                title={`${categoryTitle} — каталог`}
                description={`${categoryTitle} на заказ от Locker Wood. Смотрите каталог, размеры и фото — оставьте заявку на консультацию.`}
                keywords={`${categoryTitle}, мебель на заказ, Locker Wood, каталог мебели`}
                image={categoryImage}
            />
            <Header/>
            <div className="category-container__cat">
                <div className="filters-column">
                    <div className="href-header desktop-only">
                        <div className="breadcrumb">
                            <Link to="/">Главная</Link>
                            <span>/</span>
                            <span style={{ color: "black" }}>{category ? getCategoryNameSafe(category): null}</span>
                        </div>
                    </div>
                    
                    <div className="desktop-only">
                        <h2 className="filters-title">Фильтр</h2>
                    </div>
                    
                    <div className="mobile-category-top">
                        <img className="top-img" src={getCategoryImage()} alt={category ? getCategoryNameSafe(category) : 'Мебель'} />
                        <div className="category-title-holder">
                            <h1 className="breadcrumb_title">{category ? getCategoryNameSafe(category) : ''}</h1>
                            <button className="open-filters-button" onClick={handleClick}>
                                <i className="fa-solid fa-sliders fa-rotate-270"></i>
                            </button>
                        </div>
                    </div>

                    <div 
                        className="filter-overlay"
                        onClick={() => document.body.classList.remove('filters-open')}
                    >
                        <div 
                            className="filter-overlay-inner"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mobile-category-top">
                                <img className="top-img" src={getCategoryImage()} alt={category ? getCategoryNameSafe(category) : 'Мебель'} />
                                <div className="category-title-holder">
                                    <h1 className="breadcrumb_title">{category ? getCategoryNameSafe(category) : ''}</h1>
                                </div>
                            </div>
                            <Filter 
                                setSortOrder={setPopularSortOrder} 
                                sortEnts={popularSortOrder}
                            />
                            
                            <div className="mobile-filter-apply-container">
                                <button 
                                    className="mobile-filter-apply-button"
                                    onClick={() => document.body.classList.remove('filters-open')}
                                >
                                    ПРИМЕНИТЬ
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mobile-new-container">
                        {loading ? <div className="center"><CircularProgress size={60} color={'success'}/></div> : null}
                        
                        {data?.data && !loading && data?.data.length > 0 ?
                            data?.data.map((product) => (
                                    <Link key={product.id} to={'/product/' + product.id} className="mobile-new-item">
                                    <div className="mobile-new-img-wrapper">
                                        <img className="mobile-new-img" src={product.avatar} alt={product.name} />
                                    </div>
                                    <div className="mobile-new-content">
                                        <div className="mobile-new-name-container">
                                            <h4 className="mobile-new-primary">{product.name}</h4>
                                        </div>
                                        <h5 className="mobile-new-secondary">{product.description}</h5>
                                    </div>
                                </Link>
                            ))
                            : 
                            null}
                        {data?.data && !loading && data?.data.length <= 0 ?
                            <div className="center">Товары не найдены</div>
                            : 
                            null}
                        
                        {data?.meta ? <Pagination meta={data?.meta} setPage={setPage}/> : null}
                    </div>
                </div>

                <div className="products-column__cat">

                    <div className="search-container">
                        <input type="text" className="search-input" placeholder="ПОИСК" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
                    </div>

                    <div className="biggest-image-container">
                        <img src={getCategoryImage()} alt={category ? getCategoryNameSafe(category) : 'Мебель'} className="category-image__cat" />
                    </div>

                    
                    {loading ? <div className="products-grid__cat center"><CircularProgress size={60} color={'success'}/></div> : null}

                    {data?.data && !loading && data?.data.length > 0 ?
                        <div className="products-grid__cat">{data?.data.map((i) => <ProductCard product={i}/>)}</div>
                        : 
                        null}
                    {data?.data && !loading && data?.data.length <= 0 ?
                        <div className="products-grid__cat center">Товары не найдены</div>
                        : 
                        null}

                    

                    {data?.meta ? <Pagination meta={data?.meta} setPage={setPage}/> : null}

                 
                </div>
            </div>

            <Footer />
        </>
    )
}

const Pagination: FC<{meta: PaginationMeta, setPage: React.Dispatch<React.SetStateAction<number>>}> = ({meta, setPage}) => {
    const {totalPages, page} = meta
    const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    if (page > 2) {
      pages.push(1);
      if (page > 3) {
        pages.push('...');
      }
    }
    
    if (page > 1) {
      pages.push(page - 1);
    }
    
    pages.push(page);
    
    if (page < totalPages) {
      pages.push(page + 1);
    }
    
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages()
    return (
        <div className="pagination">
            <div className="pagination-numbers">
                <button className="pagination-button" id="prev-button" disabled={page===1} aria-label="Предыдущая страница" onClick={() => setPage(page - 1)}/>
                {visiblePages.map((pageNum, index) => {
                    if (typeof pageNum === 'string') {
                        return (
                            <span key={`dots-${index}`} className="page-dots">
                                {pageNum}
                            </span>
                        )
                    } else {
                        return (
                             <button
                                key={pageNum}
                                className={`page-number ${pageNum === page ? 'active' : ''}`}
                                onClick={() => setPage(pageNum)}
                                >
                                {pageNum}
                                </button>
                        )
                    }
                })}
                <button className="pagination-button" id="next-button" disabled={page===totalPages} aria-label="Следующая страница" onClick={() => setPage(page + 1)}/>
            </div>
        </div>
    )
}

export default CategoryPage