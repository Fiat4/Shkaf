import { Link } from 'react-router-dom'
import './AdminMain.css'
import { useEffect, useState } from 'react'
import useAdminApi from '../../hook/useAdminApi'
import { CircularProgress } from '@mui/material'

const AdminMain: React.FC = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        popularProducts: 0,
        newProducts: 0,
        totalOrders: 0
    });

    const [popularProducts, setPopularProducts] = useState<any[]>([]);
    const [newProducts, setNewProducts] = useState<any[]>([]);
    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { 
        getAllProducts, 
        getOrders, 
        getReviews,
        getPopularProducts,
        getRecentProducts,
        loading: productsLoading 
    } = useAdminApi();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            console.log('🔍 Начинаем загрузку данных дашборда...');
            
            console.log('🔍 Проверяем методы API:', {
                getAllProducts: typeof getAllProducts,
                getOrders: typeof getOrders,
                getPopularProducts: typeof getPopularProducts,
                getRecentProducts: typeof getRecentProducts,
                getReviews: typeof getReviews
            });


            console.log('🔍 Вызываем getAllProducts...');
            const products: any = await getAllProducts();
            console.log('Products response:', products);
            console.log('Products type:', typeof products);
            console.log('Products keys:', products ? Object.keys(products) : 'undefined');
            setStats(prev => ({ ...prev, totalProducts: products?.length || products?.data?.length || 0 }));

            console.log('🔍 Вызываем getOrders...');
            const orders: any = await getOrders('order', 'active');
            console.log('Orders response:', orders);
            console.log('Orders type:', typeof orders);
            setStats(prev => ({ ...prev, totalOrders: orders?.length || orders?.data?.length || 0 }));

            console.log('🔍 Вызываем getPopularProducts...');
            const popular: any = await getPopularProducts('desc');
            console.log('Popular products response:', popular);
            console.log('Popular type:', typeof popular);
            const popularData = popular?.data || popular || [];
            setPopularProducts(popularData.slice(0, 5));
            setStats(prev => ({ ...prev, popularProducts: popularData.length }));

            console.log('🔍 Вызываем getRecentProducts...');
            const recent: any = await getRecentProducts('desc', 10);
            console.log('Recent products response:', recent);
            console.log('Recent type:', typeof recent);
            const recentData = recent?.data || recent || [];
            setNewProducts(recentData.slice(0, 5));
            setStats(prev => ({ ...prev, newProducts: recentData.length }));

            console.log('🔍 Вызываем getReviews...');
            const reviews: any = await getReviews(1, 'organization', 'created_at', 'desc', undefined, 5);
            console.log('Reviews response:', reviews);
            console.log('Reviews type:', typeof reviews);
            const reviewsData = reviews?.data || reviews || [];
            setRecentReviews(reviewsData);
            
            console.log('✅ Загрузка данных завершена');
            
        } catch (error) {
            console.error('❌ Ошибка при загрузке данных дашборда:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-box"></i>
                </div>
                <div className="stat-info">
                    <h3>Всего товаров</h3>
                    <p>{isLoading ? <CircularProgress size={20} /> : stats.totalProducts}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-star"></i>
                </div>
                <div className="stat-info">
                    <h3>Популярные товары</h3>
                    <p>{isLoading ? <CircularProgress size={20} /> : stats.popularProducts}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                    <h3>Новинки</h3>
                    <p>{isLoading ? <CircularProgress size={20} /> : stats.newProducts}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">
                    <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-info">
                    <h3>Заказы</h3>
                    <p>{isLoading ? <CircularProgress size={20} /> : stats.totalOrders}</p>
                </div>
            </div>
        </div>

        <div className="dashboard-content">
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
                        </tbody>
                    </table>
                </div>
            </div>

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
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="dashboard-section reviews-section-bottom">
            <div className="section-header">
                <h2><i className="fas fa-comments"></i> Последние отзывы</h2>
                <Link to="/admin/reviews" className="view-all">Все отзывы <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="reviews-grid">
                {recentReviews.slice(0,6).map((review) => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <i className="fas fa-user-circle"></i>
                            <div className="reviewer-info">
                                <h4>{review.username}</h4>
                                <div className="stars">
                                    {[...Array(review.rating)].map((_, index) => (
                                        <i key={index} className="fas fa-star"></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="review-text">{review.review}</p>
                        <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString('ru-RU')}
                        </span>
                    </div>
                ))}
                {recentReviews.length === 0 && !isLoading && (
                    <div style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                        Нет отзывов
                    </div>
                )}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                        <CircularProgress size={20} />
                    </div>
                )}
            </div>
        </div>
    </div>
        </>
    )
}
export default AdminMain