import { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
}

const authApi = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    withCredentials: true,
});

const getStoredToken = (): string | null => {
    return localStorage.getItem('adminToken');
};

const setStoredToken = (token: string): void => {
    localStorage.setItem('adminToken', token);
};

const removeStoredToken = (): void => {
    localStorage.removeItem('adminToken');
};

authApi.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

authApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        if (error.response?.status === 401) {
            console.log('🔄 Получена 401 ошибка, проверяем возможность обновления токена');
        }
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('Получена 401 ошибка, пытаемся обновить токен');
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return authApi(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('🔄 Пытаемся обновить токен через /admin/refresh');
                console.log('📄 Cookies в браузере:', document.cookie);
                
                const refreshTokenCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('refreshToken='));
                console.log('🍪 Refresh token cookie:', refreshTokenCookie);
                
                
                console.log('📤 Отправляем запрос на /admin/refresh');
                const refreshResponse = await authApi.post('/admin/refresh');
                console.log('📥 Ответ refresh:', refreshResponse);
                
                if (refreshResponse.status === 201 && refreshResponse.data.accessToken) {
                    const newToken = refreshResponse.data.accessToken;
                    console.log('✅ Получен новый токен:', newToken);
                    setStoredToken(newToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    processQueue(null, newToken);
                    
                    console.log('🔄 Повторяем оригинальный запрос с новым токеном');
                    return authApi(originalRequest);
                } else {
                    console.error('Неожиданный ответ refresh:', refreshResponse);
                    throw new Error('Не удалось получить новый токен');
                }
            } catch (refreshError: any) {
                console.error('Ошибка при обновлении токена:', refreshError);
                console.error('Детали ошибки:', {
                    message: refreshError.message,
                    status: refreshError.response?.status,
                    data: refreshError.response?.data,
                    url: refreshError.config?.url
                });
                
                processQueue(refreshError, null);
                removeStoredToken();
                
                console.log('🔄 useAuth: Перенаправляем на страницу логина после неудачного обновления токена');
                setTimeout(() => {
                    window.location.replace('/admin/login');
                }, 100);
                
                return Promise.reject(refreshError);
            } finally {
                console.log('Завершаем процесс обновления токена, isRefreshing = false');
                isRefreshing = false;
            }
        }
        
        console.log('🔴 Интерсептор НЕ обрабатывает ошибку (не 401 или уже retry)');
        return Promise.reject(error);
    }
);

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        token: null,
        loading: true,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = getStoredToken();
        if (token) {
            verifyToken(token);
        } else {
            setAuthState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    const verifyToken = async (token: string) => {
        try {
            console.log('Проверяем валидность токена:', token);
            const response = await authApi.get('/admin/check', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log('Ответ проверки токена:', response);
            if (response.status === 200) {
                setAuthState({
                    isAuthenticated: true,
                    token,
                    loading: false,
                });
                console.log('Токен валиден, состояние обновлено');
            }
        } catch (error) {
            console.error('Ошибка проверки токена:', error);
            removeStoredToken();
            setAuthState({
                isAuthenticated: false,
                token: null,
                loading: false,
            });
            console.log('Токен недействителен, состояние сброшено');
        }
    };

    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
        try {
            setAuthState(prev => ({ ...prev, loading: true }));
            console.log('Отправляем запрос на вход:', credentials);
            
            const response = await authApi.post<AuthResponse>('/admin/login', credentials);
            console.log('Ответ сервера:', response);
            console.log('Данные ответа:', response.data);
            
            if (response.status === 201 && response.data.accessToken) {
                const { accessToken } = response.data;
                console.log('Получен accessToken:', accessToken);
                console.log('Длина accessToken:', accessToken.length);
                
                setStoredToken(accessToken);
                
                setAuthState({
                    isAuthenticated: true,
                    token: accessToken,
                    loading: false,
                });
                
                console.log('✅ Состояние обновлено, loading: false');
                console.log('✅ Токен сохранен в localStorage:', accessToken);
                console.log('🍪 Cookies после входа:', document.cookie);
                
                const refreshTokenCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('refreshToken='));
                console.log('🍪 Refresh token cookie:', refreshTokenCookie);
                
                if (refreshTokenCookie) {
                    const refreshToken = refreshTokenCookie.split('=')[1];
                    console.log('🍪 Refresh token значение:', refreshToken);
                    console.log('🍪 Длина refresh token:', refreshToken.length);
                    console.log('🔍 Токены одинаковые?', accessToken === refreshToken);
                }
                
                return { success: true };
            }
            
            console.log('Неожиданный ответ сервера:', response);
            return { success: false, error: 'Неожиданная ошибка сервера' };
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setAuthState(prev => ({ ...prev, loading: false }));
            
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Ошибка входа';
                console.log('Сообщение об ошибке:', message);
                return { success: false, error: message };
            }
            
            return { success: false, error: 'Произошла ошибка при входе' };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authApi.post('/admin/logout');
        } catch (error) {
            console.warn('Ошибка при выходе:', error);
        } finally {
            removeStoredToken();
            setAuthState({
                isAuthenticated: false,
                token: null,
                loading: false,
            });
            
            navigate('/admin/login');
        }
    };

    const refreshToken = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await authApi.post('/admin/refresh');
            
            if (response.status === 201 && response.data.accessToken) {
                const newToken = response.data.accessToken;
                setStoredToken(newToken);
                
                setAuthState(prev => ({
                    ...prev,
                    token: newToken,
                    isAuthenticated: true,
                }));
                
                return { success: true };
            }
            
            return { success: false, error: 'Не удалось обновить токен' };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Ошибка обновления токена';
                return { success: false, error: message };
            }
            
            return { success: false, error: 'Произошла ошибка при обновлении токена' };
        }
    };

    const getAuthenticatedApi = () => {
        return authApi;
    };

    return {
        ...authState,
        login,
        logout,
        refreshToken,
        getAuthenticatedApi,
    };
};

export default useAuth;
