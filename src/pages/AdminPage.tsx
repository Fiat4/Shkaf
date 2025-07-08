import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import './AdminPage.css'
import { useEffect, useState } from 'react'
const AdminPage:React.FC = () => {
    const [active, setActive] = useState<string>()
    const param = useLocation()
    return (
        <>
        <div className="sidebar">
        <h2>Панель управления</h2>
        <ul>
            <li><NavLink end to="/admin"><i className="fas fa-home"></i> Главная</NavLink></li>
            <li><NavLink to="/admin/prods"><i className="fas fa-box"></i> Все товары</NavLink></li>
            <li><NavLink to="/admin/pops"><i className="fas fa-star"></i> Популярное</NavLink></li>
            <li><NavLink to="/admin/new"><i className="fas fa-clock"></i> Новинки</NavLink></li>
            <li><NavLink to="/admin/cats" className="categories-link"><i className="fas fa-tags"></i> Категории</NavLink>
                <ul>
                    <li><a href="#" data-category="Шкафы">Шкафы</a></li>
                    <li><a href="#" data-category="Кровати">Кровати</a></li>
                    <li><a href="#" data-category="Кухни">Кухни</a></li>
                    <li><a href="#" data-category="Стенки">Стенки</a></li>
                </ul>
            </li>
            <li><a href="reviews.html"><i className="fas fa-comments"></i> Отзывы</a></li>
            <li><a href="#"><i className="fas fa-shopping-cart"></i> Заказы</a></li>
            <li><a href="#"><i className="fas fa-users"></i> Пользователи</a></li>
            <li><a href="#"><i className="fas fa-cog"></i> Настройки</a></li>
        </ul>
    </div>

        <Outlet/>
        </>
    )
} 

export default AdminPage