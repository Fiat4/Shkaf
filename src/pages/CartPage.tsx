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
                title="Главная"
                description="Магазин мебели - качественная мебель для вашего дома"
                keywords="мебель, шкафы, кровати, кухни, стенки, интерьер"
            />
            <Header variant='searchless' />

            <main className="cart-page">
                <div className="breadcrumbs">
                    <a href="/">Главная</a> / <span>Избранное</span>
                </div>

                <div className="cart-container">
                    <div className="cart-items">
                        <h1 className='desktop-only'>ИЗБРАННОЕ</h1>
                        {/* Здесь будут только избранные товары, без цены и количества */}
                        <div className="cart-item">
                            <div className="item-image">
                                <img src="img/bed.jpg" alt="КРОВАТЬ 'НАЗВАНИЕ'" />
                            </div>
                            <div className="item-details">
                                <h3>КРОВАТЬ "НАЗВАНИЕ"</h3>
                            </div>
                            <div className='button-wrapper'>
                                <button className="remove-item">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                        <div className="cart-item">
                            <div className="item-image">
                                <img src="img/kit.jpg" alt="КУХНЯ 'НАЗВАНИЕ'" />
                            </div>
                            <div className="item-details">
                                <h3>КУХНЯ "НАЗВАНИЕ"</h3>
                            </div>
                            <div className='button-wrapper'>
                                <button className="remove-item">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="cart-summary">
                        <h2>ВАШ ЗАПРОС</h2>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>2 ТОВАРА</span>
                            </div>
                        </div>
                        <div className='checkout-wrapper' style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                            <input type="tel" className="phone-input" placeholder="Ваш телефон" style={{ padding: '12px', fontSize: '18px', border: '1px solid #ccc', borderRadius: '6px' }} />
                            <input type="text" className="size-input" placeholder="Желаемые размеры (ДxШxВ, см)" style={{ padding: '12px', fontSize: '18px', border: '1px solid #ccc', borderRadius: '6px' }} />
                            <button className="checkout-btn">УЗНАТЬ ЦЕНУ</button>
                        </div>
                        <div className="delivery-info">
                            <p style={{ fontSize: '18px', color: '#444' }}>Стоимость рассчитывается индивидуально для каждого заказа. Мы свяжемся с вами для уточнения деталей и расчёта стоимости.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Popular dynamicText="МОЖЕТ ПОНРАВИТЬСЯ" />
            <Footer />
        </>
    )
}

export default CartPage