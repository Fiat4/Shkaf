import { useState, useEffect } from 'react';
import axios from 'axios';

interface AuthCheckState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export const useAuthCheck = () => {
    const [authState, setAuthState] = useState<AuthCheckState>({
        isAuthenticated: false,
        loading: true,
        error: null,
    });
    
    const [hasChecked, setHasChecked] = useState(false);

    const checkAuth = async () => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            
            const token = localStorage.getItem('adminToken');
            if (!token) {
                console.log('❌ Токен не найден в localStorage');
                setAuthState({
                    isAuthenticated: false,
                    loading: false,
                    error: 'No token',
                });
                return false;
            }
            
            console.log('🔍 Проверяем валидность токена через API');
            const response = await axios.get('http://localhost:3000/admin/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                timeout: 5000
            });
            
            if (response.status === 200) {
                console.log('✅ Токен валиден, пользователь авторизован');
                setAuthState({
                    isAuthenticated: true,
                    loading: false,
                    error: null,
                });
                return true;
            } else {
                throw new Error('Неожиданный ответ сервера');
            }
        } catch (error: any) {
            console.log('❌ Ошибка при проверке авторизации:', error);
            
            if (error.response?.status === 401) {
                console.log('❌ Токен недействителен, очищаем localStorage');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('refreshToken');
            }
            
            setAuthState({
                isAuthenticated: false,
                loading: false,
                error: error.message,
            });
            
            return false;
        }
    };

    useEffect(() => {
        if (!hasChecked) {
            checkAuth();
            setHasChecked(true);
        }
    }, [hasChecked]);

    return {
        ...authState,
        checkAuth,
    };
};