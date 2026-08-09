import './MainPage.css'
import './CartPage.css'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import HeadMeta from '../Components/HeadMeta/HeadMeta'
import Popular from '../Components/Popular/Popular'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import IProduct from '../Types/Product'

const FAVORITES_KEY = 'favorites'

const CartPage: React.FC = () => {
    const [favorites, setFavorites] = useState<IProduct[]>([])

    useEffect(() => {
        try {
            const raw = localStorage.getItem(FAVORITES_KEY)
            setFavorites(raw ? JSON.parse(raw) : [])
        } catch {
            setFavorites([])
        }
    }, [])

    const removeFavorite = (id: string) => {
        const next = favorites.filter((item) => item.id !== id)
        setFavorites(next)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    }

    return (
        <>
            <HeadMeta
                title="Избранное"
                description="Сохранённые товары Locker Wood — мебель на заказ, которая вам понравилась."
                keywords="избранное, мебель на заказ, Locker Wood"
                noindex
            />
            <Header variant='searchless' />

            <main className="cart-page">
                <div className="breadcrumbs">
                    <Link to="/">Главная</Link> / <span>Избранное</span>
                </div>

                <div className="cart-container">
                    <div className="cart-items">
                        <h1 className='desktop-only'>ИЗБРАННОЕ</h1>
                        {favorites.length === 0 && (
                            <div style={{ padding: '24px 0' }}>
                                <p>В избранном пока ничего нет.</p>
                                <Link to="/">Перейти в каталог</Link>
                            </div>
                        )}
                        {favorites.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <div className="item-image">
                                    <Link to={`/product/${item.id}`}>
                                        <img src={item.avatar} alt={item.name} />
                                    </Link>
                                </div>
                                <div className="item-details">
                                    <h3>
                                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                                    </h3>
                                    <p>{item.price?.toLocaleString('ru-RU')} ₽</p>
                                </div>
                                <div className='button-wrapper'>
                                    <button
                                        className="remove-item"
                                        onClick={() => removeFavorite(item.id)}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>ВАШ ЗАПРОС</h2>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>{favorites.length} ТОВАР(ОВ)</span>
                            </div>
                        </div>
                        <div className="delivery-info">
                            <p style={{ fontSize: '18px', color: '#444' }}>
                                Чтобы оформить заказ, откройте карточку товара и
                                отправьте заявку. Стоимость рассчитывается
                                индивидуально.
                            </p>
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
