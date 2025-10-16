import React from 'react';
import './ErrorNotification.css';

interface ErrorNotificationProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ 
    isOpen, 
    onClose, 
    message = "Неправильный логин или пароль" 
}) => {
    if (!isOpen) return null;

    return (
        <div className="error-notification-overlay" onClick={onClose}>
            <div className="error-notification-modal" onClick={(e) => e.stopPropagation()}>
                <button 
                    className="error-notification-close" 
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    <i className="fas fa-times"></i>
                </button>
                
                <div className="error-notification-content">
                    <h3 className="error-notification-title">Ошибка входа</h3>
                    <p className="error-notification-message">{message}</p>
                </div>
                
                <div className="error-notification-footer">
                    <button 
                        className="error-notification-btn" 
                        onClick={onClose}
                    >
                        Понятно
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorNotification;
