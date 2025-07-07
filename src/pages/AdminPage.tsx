import { Outlet } from 'react-router-dom'
import './AdminPage.css'
const AdminPage:React.FC = () => {
    return (
        <>
        <div className="sidebar">
        <h2>Панель управления</h2>
        <ul>
            <li><a href="dashboard.html"><i className="fas fa-home"></i> Главная</a></li>
            <li><a href="admin.html" className="active"><i className="fas fa-box"></i> Все товары</a></li>
            <li><a href="popular.html"><i className="fas fa-star"></i> Популярное</a></li>
            <li><a href="new.html"><i className="fas fa-clock"></i> Новинки</a></li>
            <li><a href="#" className="categories-link"><i className="fas fa-tags"></i> Категории</a>
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