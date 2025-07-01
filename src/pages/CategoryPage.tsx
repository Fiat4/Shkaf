import Footer from "../Components/Footer/Footer"
import Header from "../Components/Header/Header"
import './MainPage.css'
import './CategoryPage.css'
import Filter from "../Components/Filter/Filter"
import ProductCard from "../Components/ProductCard/ProductCard"
import { Link } from "react-router-dom"

interface ICategoryPageProps {
    product: string
}

const CategoryPage: React.FC<ICategoryPageProps> = ({product}) => {
    return (
    <>
        <Header/>
<div className="category-container__cat">
        <div className="filters-column">
            <div className="href-header">
                <div className="breadcrumb">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span style={{color: "black"}}>{product}</span>
                </div>
            </div>
            <h1 className="breadcrumb_title">{product.toUpperCase()}</h1>
            
            <Filter/>
        </div>

        <div className="products-column__cat">

            <div className="search-container">
                <input type="text" className="search-input" placeholder="ПОИСК"/>
                <button className="search-button">
                    <img src="../img/searcher.png" alt="Поиск"/>
                </button>
            </div>

            <div className="biggest-image-container">
                <img src="../img/kitchen_main.jpg" alt="Кухни" className="category-image__cat"/>
            </div>

            <div className="products-grid__cat">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                
               
            </div>

            <div className="pagination">
                <div className="pagination-numbers">
                    <button className="pagination-button" id="prev-button" aria-label="Предыдущая страница"/>
                    <button className="page-number active">1</button>
                    <button className="page-number">2</button>
                    <button className="page-number">3</button>
                    <span className="page-dots">...</span>
                    <button className="page-number">7</button>
                    <button className="pagination-button" id="next-button" aria-label="Следующая страница"/>
                </div>
            </div>
        </div>
    </div>
        
        <Footer/>      
    </>
    )
}

export default CategoryPage