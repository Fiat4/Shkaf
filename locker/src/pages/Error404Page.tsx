import React from 'react';
import './Error404Page.css';

const Error404Page: React.FC = () => {
    return (
        <div className="error-404-container">
            <div className="error-404-content">
                <div className="error-404-number">404</div>
                <h1 className="error-404-title">СТРАНИЦА НЕ НАЙДЕНА</h1>
                <p className="error-404-description">
                    К сожалению, запрашиваемая страница не существует или была перемещена.
                </p>
                <button className="error-404-button">
                    ВЕРНУТЬСЯ НА ГЛАВНУЮ СТРАНИЦУ
                </button>
            </div>
        </div>
    );
};

export default Error404Page;
