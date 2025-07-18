import { Link, NavLink, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom'
import './AdminPage.css'
import { useEffect, useState } from 'react'

const AdminPage:React.FC = () => {
    const [active, setActive] = useState<string>()
    const param = useLocation()
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (darkMode) {
        document.body.classList.add('admin-dark');
      } else {
        document.body.classList.remove('admin-dark');
      }
      return () => {
        document.body.classList.remove('admin-dark');
      };
    }, [darkMode]);

    return (
        <>
        <div className="sidebar">
        <h2>Панель управления</h2>
        <ul>
            <li><NavLink end to="/admin"><i className="fas fa-home"></i> Главная</NavLink></li>
            <li><NavLink to="/admin/prods"><i className="fas fa-box"></i> Все товары</NavLink></li>
            <li><NavLink to="/admin/pops"><i className="fas fa-star"></i> Популярное</NavLink></li>
            <li><NavLink to="/admin/new"><i className="fas fa-clock"></i> Новинки</NavLink></li>
            <li><NavLink to="/admin/reviews"><i className="fas fa-comments"></i> Отзывы</NavLink></li>
            <li><NavLink to="/admin/requests"><i className="fas fa-file-alt"></i> Заявки</NavLink></li>
            <li><NavLink to="/admin/user"><i className="fas fa-users"></i> Пользователь</NavLink></li>
        </ul>
        <div className="theme-switcher">
        <img src="/icons/sun.png" alt="Тёмная тема" className="theme-icon" style={{width: 20, height: 20}} />
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider round"></span>
          </label>
          <img src="/icons/moon.png" alt="Тёмная тема" className="theme-icon" style={{width: 20, height: 20}} />
        </div>
    </div>

        <Outlet/>
        </>
    )
} 

export default AdminPage