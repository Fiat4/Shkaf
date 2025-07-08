import { Link } from 'react-router-dom'
import './AdminMain.css'
import { useEffect } from 'react'
const AdminMain: React.FC = () => {
    return (
        <>
            <div className="main-content">
        <div className="content-header">
            <h1><i className="fas fa-home"></i> Главная</h1>
            <div className="header-right">
                <div className="date">
                    
                    <i className="fas fa-calendar"></i>
                    <span id="currentDate">{new Date().toLocaleString('ru', {
                        weekday: "long",
                        day: '2-digit',
                        month:"long",
                        year: 'numeric'
                        })}</span>
                </div>
            </div>
        </div>

        <div className="dashboard-grid">
            {/* <!-- Статистические карточки --> */}
            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-box"></i>
                </div>
                <div className="stat-info">
                    <h3>Всего товаров</h3>
                    <p id="totalProducts">0</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-star"></i>
                </div>
                <div className="stat-info">
                    <h3>Популярные товары</h3>
                    <p id="popularProducts">0</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                    <h3>Новинки</h3>
                    <p id="newProducts">0</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-info">
                    <h3>Заказы</h3>
                    <p id="totalOrders">0</p>
                </div>
            </div>
        </div>

        <div className="dashboard-content">
            {/* <!-- Популярные товары --> */}
            <div className="content-section">
                <div className="section-header">
                    <h2><i className="fas fa-star"></i> Популярные товары</h2>
                    <Link to="/admin/pops" className="view-all">Все популярные <i className="fas fa-arrow-right"></i></Link>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Позиция</th>
                            </tr>
                        </thead>
                        <tbody id="popularProductsTable">
                            {/* <!-- Здесь будут отображаться популярные товары --> */}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* <!-- Новинки --> */}
            <div className="content-section">
                <div className="section-header">
                    <h2><i className="fas fa-clock"></i> Новинки</h2>
                    <Link to="/admin/new" className="view-all">Все новинки <i className="fas fa-arrow-right"></i></Link>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Дата добавления</th>
                            </tr>
                        </thead>
                        <tbody id="newProductsTable">
                            {/* <!-- Здесь будут отображаться новинки --> */}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="dashboard-section">
                <h2><i className="fas fa-comments"></i> Последние отзывы</h2>
                <div className="reviews-grid">
                    {/* <!-- Отзывы будут добавляться динамически --> */}
                </div>
            </div>
        </div>
    </div>
        </>
    )
}
export default AdminMain