import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../../hook/useAuthCheck';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading, error } = useAuthCheck();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            console.log('🔒 Redirecting to login, error:', error);
            window.location.replace('/admin/login');
        }
    }, [isAuthenticated, loading, error]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Проверка авторизации...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
