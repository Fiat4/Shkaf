import React from 'react';
import { Link } from 'react-router-dom';
import HeadMeta from '../Components/HeadMeta/HeadMeta';
import './Error404Page.css';

const Error404Page: React.FC = () => {
    return (
        <div className="error-404-container">
            <HeadMeta
                title="Страница не найдена"
                description="Запрашиваемая страница не существует. Вернитесь на главную Locker Wood."
                noindex
            />
            <div className="error-404-content">
                <div className="error-404-number">404</div>
                <h1 className="error-404-title">СТРАНИЦА НЕ НАЙДЕНА</h1>
                <p className="error-404-description">
                    К сожалению, запрашиваемая страница не существует или была перемещена.
                </p>
                <Link to="/" className="error-404-button">
                    ВЕРНУТЬСЯ НА ГЛАВНУЮ СТРАНИЦУ
                </Link>
            </div>
        </div>
    );
};

export default Error404Page;
