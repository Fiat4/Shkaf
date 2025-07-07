import './MainPage.css'
import './CartPage.css'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import HeadMeta from '../Components/HeadMeta/HeadMeta'
import Popular from '../Components/Popular/Popular'
const CartPage: React.FC = () => {
    return (
        <>
        <HeadMeta
				title="LW - Главная"
				description="Магазин мебели - качественная мебель для вашего дома"
				keywords="мебель, шкафы, кровати, кухни, стенки, интерьер"
		/>
        <Header/>

    <main className="cart-page">
        <div className="breadcrumbs">
            <a href="/">Главная</a> / <span>Избранное</span>
        </div>

        <div className="cart-container">
            <div className="cart-items">
                <h1 className='desktop-only'>ИЗБРАННОЕ</h1>
                <button className="select-all desktop-only">Выбрать все</button>

                <div className="cart-item">
                    <div className="item-image">
                        <img src="img/bed.jpg" alt="КРОВАТЬ 'НАЗВАНИЕ'"/>
                    </div>
                    <div className="item-details">
                        <h3>КРОВАТЬ "НАЗВАНИЕ"</h3>
                        <p className="price">123 000 руб</p>
                        <p className="old-price">200 000 руб</p>
                        <div className="quantity-controls">
                            <button className="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" className="quantity-input"/>
                            <button className="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <div className='button-wrapper'>
                        <button className="remove-item">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <div className="cart-item">
                    <div className="item-image">
                        <img src="img/bed.jpg" alt="КРОВАТЬ 'НАЗВАНИЕ'"/>
                    </div>
                    <div className="item-details">
                        <h3>КРОВАТЬ "НАЗВАНИЕ"</h3>
                        <p className="price">123 000 руб</p>
                        <p className="old-price">200 000 руб</p>
                        <div className="quantity-controls">
                            <button className="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" className="quantity-input"/>
                            <button className="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <div className='button-wrapper'>
                        <button className="remove-item">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                
            </div>

            <div className="cart-summary">
                <h2>ВАШ ЗАКАЗ</h2>
                <div className="summary-details">
                    <div className="summary-row">
                        <span>2 ТОВАРА</span>
                        <span>123 000 руб</span>
                    </div>
                    <div className="summary-row discount">
                        <span>СКИДКА НА ТОВАРЫ</span>
                        <span className='summary-row-discount'>-30 000 руб</span>
                    </div>
                </div>

                <div className="promo-code">
                    <input type="text" placeholder="ПРОМОКОД"/>
                    <p className="promo-hint">*если у вас имеется промокод, вы можете ввести его сюда</p>
                </div>

                <div className="total">
                    <span>ИТОГО</span>
                    <span className="total-price">93 000 руб</span>
                </div>

                <button className="checkout-btn">ПЕРЕЙТИ К ОФОРМЛЕНИЮ</button>

                <div className="delivery-info">
                    <h3>ДОСТАВКА В <span className="city">МОСКВА</span></h3>
                    <div className="delivery-options">
                        <div className="delivery-option">
                            <h4>Курьером</h4>
                            <p>с 11 марта, от 100 руб</p>
                        </div>
                        <div className="delivery-option">
                            <h4>Самовывоз со склада</h4>
                            <p>с 11 марта, бесплатно</p>
                        </div>
                    </div>
                    <button type="button" className="delivery-details">Подробнее о способах доставки</button>
                </div>
            </div>
        </div>
    </main>
    <Popular dynamicText="МОЖЕТ ПОНРАВИТЬСЯ"/>
    <Footer/>
    </>
    )
}

export default CartPage