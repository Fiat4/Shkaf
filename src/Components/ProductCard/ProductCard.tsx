<<<<<<< HEAD
import { Link } from "react-router-dom"

const ProductCard: React.FC = () => {
    return (
        <Link className='product-link' to='/product'>
            <div className="product-card__cat" >
=======
const ProductCard: React.FC = () => {
    return (
        <div className="product-card__cat" >
>>>>>>> f413b4cf54b859b47b2b7ca185878092d6c89dca
            <div className="product-image__cat">
                <img src="../img/kit.jpg" alt="Кухня 'Практик'" />
            </div>
            <div className="product-info__cat">
                <div className="product-title__cat">
                    КУХНЯ "ПРАКТИК"
                    <span className="product-tag__cat new">НОВИНКА</span>
                </div>
                <p className="product-description__cat">Максимальная функциональность</p>
                <div className="product-price-container__cat">
                    <span className="product-price__cat">160 000 руб</span>
                    <div className="product-button-container">
                        <button className="add-to-cart-button" >ДОБАВИТЬ В КОРЗИНУ</button>
                        <button className="product-favorite-button">
                            <i className="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
<<<<<<< HEAD
        </Link>
=======
>>>>>>> f413b4cf54b859b47b2b7ca185878092d6c89dca

    )
}
export default ProductCard