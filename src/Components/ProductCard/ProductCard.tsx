const ProductCard: React.FC = () => {
    return (
        <div className="product-card__cat" >
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
                            <div className="button-container">
                                <button className="add-to-cart-button" >ДОБАВИТЬ В КОРЗИНУ</button>
                                <button className="favorite-button">♡</button>
                            </div>
                        </div>
                    </div>
                </div>

    )
}
export default ProductCard