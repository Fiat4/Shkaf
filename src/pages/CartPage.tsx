import './MainPage.css'
import './CartPage.css'
import Header from '../Components/Header/Header'
const CartPage: React.FC = () => {
    return (
        <>
           <Header/>

    <main className="cart-page">
        <div className="breadcrumbs">
            <a href="Index.html">Главная</a> / <span>Избранное</span>
        </div>

        <div className="cart-container">
            <div className="cart-items">
                <h1>ИЗБРАННОЕ</h1>
                <button className="select-all">Выбрать все</button>

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
                    <button className="remove-item">×</button>
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
                    <button className="remove-item">×</button>
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
                        <span>-30 000 руб</span>
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
    <footer className="footer">
        <div className="footer-content_1">
            <section className="footer-section-left">
                <div className="footer-logo"></div>
            </section>
    
            <section className="footer-section-right">
                <button className="button_footer">
                    Подписаться на рассылку
                    <img className="telegram_icon" src="ic/Telegram.svg" alt="Телеграм"/>
                </button>
                <p>Телефон: +7 (999) 999-99-99</p>
                <p>Email: info@example.com</p>
                <address>Адрес: ул. Пушкина, д. 1, Москва, Россия</address>
            </section>
        </div>
        <hr/>
        <div className="footer-content_2">
            <section className="footer-section-social">
                <p>СОЦИАЛЬНЫЕ СЕТИ:</p>
            </section>
            <section className="footer-section-networks">
                <a href="#"><i className="fa-brands fa-telegram"></i></a>
                <a href="#" id="insta"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" id="vk"><i className="fa-brands fa-vk"></i></a>
            </section>
            <section className="footer-section-copyright">
                <p>© 2025 LockerWood. Все права защищены.</p>
            </section>
        </div>

        
    </footer>
        </>
    )
}

export default CartPage