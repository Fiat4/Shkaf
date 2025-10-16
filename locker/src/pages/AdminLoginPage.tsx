import React, { useState, useEffect } from 'react';
import './AdminLoginPage.css';
import ErrorNotification from '../Components/Modals/ErrorNotification';
import useAuth from '../hook/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
    const [username, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const { login: authLogin, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {   
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setErrorMessage('Пожалуйста, заполните все поля');
            setShowError(true);
            return;
        }

        const result = await authLogin({ username, password });
        
        if (result.success) {
            navigate('/admin');
        } else {
            setErrorMessage(result.error || 'Ошибка входа');
            setShowError(true);
        }
    };

    return (
        <div className="admin-login-page-container">
            <div className="admin-login-page-form">
                <div className="admin-login-page-logo">
                    <img src="../img/logo.png" alt="Логотип" className="admin-login-page-logo-image" />
                </div>
                
                <h1 className="admin-login-page-title">Вход в личный кабинет</h1>
                
                <form onSubmit={handleSubmit} className="admin-login-page-form-container">
                    <div className="admin-login-page-form-group">
                        <label htmlFor="login" className="admin-login-page-form-label">Логин</label>
                        <input
                            type="text"
                            id="login"
                            value={username}
                            onChange={(e) => setLogin(e.target.value)}
                            className="admin-login-page-form-input"
                            required
                        />
                    </div>
                    
                    <div className="admin-login-page-form-group">
                        <label htmlFor="password" className="admin-login-page-form-label">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="admin-login-page-form-input"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="admin-login-page-submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
            
            <ErrorNotification 
                isOpen={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
            />
        </div>
    );
};

export default AdminLoginPage;
