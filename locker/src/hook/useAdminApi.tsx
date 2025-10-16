import { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
}

interface ErrorData {
    statusCode: number;
    message: string;
    error: string;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const adminApi = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

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

adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 useAdminApi: Добавлен токен в запрос:', config.url, 'Токен длина:', token.length);
        } else {
            console.log('❌ useAdminApi: Токен отсутствует для запроса:', config.url);
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                console.log('❌ useAdminApi: Токен отсутствует в запросе, перенаправляем на логин');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

adminApi.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        console.log('🔍 useAdminApi: Получена ошибка:', error.response?.status, error.config?.url);
        
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                console.log('❌ useAdminApi: Токен отсутствует, перенаправляем на логин');
                setTimeout(() => {
                    window.location.replace('/admin/login');
                }, 100);
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return adminApi(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('🔄 useAdminApi: Пытаемся обновить токен через /admin/refresh');
                console.log('🔄 useAdminApi: Проверяем cookies перед запросом refresh:', document.cookie);
                
                const refreshResponse = await adminApi.post('/admin/refresh');
                
                console.log('🔄 useAdminApi: Ответ от /admin/refresh:', refreshResponse.status, refreshResponse.data);
                
                if (refreshResponse.status === 201 && refreshResponse.data.accessToken) {
                    const newToken = refreshResponse.data.accessToken;
                    console.log('✅ useAdminApi: Получен новый токен, длина:', newToken.length);
                    
                    localStorage.setItem('adminToken', newToken);
                    console.log('✅ useAdminApi: Новый токен сохранен в localStorage');
                    
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    processQueue(null, newToken);
                    
                    console.log('🔄 useAdminApi: Повторяем оригинальный запрос с новым токеном');
                    return adminApi(originalRequest);
                } else {
                    console.log('❌ useAdminApi: Неожиданный ответ от refresh:', refreshResponse.status, refreshResponse.data);
                    throw new Error('Не удалось получить новый токен');
                }
            } catch (refreshError: any) {
                console.log('❌ useAdminApi: Ошибка при обновлении токена:', refreshError);
                console.log('❌ useAdminApi: Статус ошибки:', refreshError.response?.status);
                console.log('❌ useAdminApi: Данные ошибки:', refreshError.response?.data);
                
                if (refreshError.response?.status === 401) {
                    console.log('❌ useAdminApi: Refresh token тоже недействителен - сессия истекла');
                } else {
                    console.log('❌ useAdminApi: Другая ошибка при обновлении токена:', refreshError.message);
                }
                
                processQueue(refreshError, null);
                
                localStorage.removeItem('adminToken');
                localStorage.removeItem('refreshToken');
                
                isRefreshing = false;
                
                console.log('🔄 useAdminApi: Перенаправляем на страницу логина после ошибки обновления токена');
                setTimeout(() => {
                    window.location.replace('/admin/login');
                }, 100);
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        if (error.response?.status === 401) {
            console.log('❌ useAdminApi: Получена 401 ошибка, очищаем токен и перенаправляем');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('refreshToken');
            
            console.log('🔄 useAdminApi: Перенаправляем на страницу логина (fallback)');
            setTimeout(() => {
                window.location.replace('/admin/login');
            }, 100);
        }
        
        return Promise.reject(error);
    }
);

const useAdminApi = <T = any>() => {
    const [data, setData] = useState<T>();
    const [error, setError] = useState<ApiError | null>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async (url: string, options: RequestOptions = {}) => {
        setError(null);
        setLoading(true);


        try {
            const { method = 'GET', headers = {}, body } = options;
            
            let response;
            if (method === 'GET') {
                response = await adminApi.get(url, { headers });
            } else if (method === 'POST') {
                response = await adminApi.post(url, body, { headers });
            } else if (method === 'PUT') {
                response = await adminApi.put(url, body, { headers });
            } else if (method === 'PATCH') {
                response = await adminApi.patch(url, body, { headers });
            } else if (method === 'DELETE') {
                response = await adminApi.delete(url, { headers });
            } else {
                throw new Error(`Unsupported method: ${method}`);
            }

            setData(response.data);
            return response.data;
        } catch (error: any) {
            console.log('useAdminApi error:', error);
            
            
            if (error.response) {
                setError(new ApiError(
                    error.response.data?.message || `HTTP Error ${error.response.status}`,
                    error.response.status,
                    error.response.data
                ));
            } else {
                setError(new ApiError(
                    error.message || 'Network Error',
                    0,
                    error
                ));
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAllProducts = async () => await fetchData('/product', { method: 'GET' });
    const getProductsByCategory = async (category: string) => await fetchData(`/product?category=${category}`, { method: 'GET' });
    const createProduct = async (product: any) => await fetchData('/product', { method: 'POST', body: product });
    const deleteProductById = async (id: string) => await fetchData(`/product/${id}`, { method: 'DELETE' });
    const updateProduct = async (id: string, body: any) => await fetchData(`/product/${id}`, { method: 'PATCH', body });
    const getProductsById = async (id: string) => await fetchData(`/product/${id}`, { method: 'GET' });

    const getOrders = async (type: 'consultation' | 'order', status: 'active' | 'completed' | 'canceled') => {
        const urlParams = new URLSearchParams();
        urlParams.append('type', type);
        urlParams.append('status', status);
        return await fetchData(`/order?${urlParams.toString()}`, { method: 'GET' });
    };
    const changeOrderStatus = async (id: string, status: 'active' | 'canceled' | 'completed') => 
        await fetchData(`/order/${id}`, { method: 'PUT', body: JSON.stringify({ status }), headers: { 'Content-Type': 'application/json' } });

    const getReviews = async (page: number = 1, type?: 'organization' | 'product', sortEntity?: 'username' | 'rating' | 'created_at', sortOrder?: 'desc' | 'asc' | null, searchWord?: string, limit: number = 3) => {
        const urlParams = new URLSearchParams();
        urlParams.append('limit', limit.toString());
        urlParams.append('page', page.toString());
        if (sortOrder) urlParams.append('order', sortOrder);
        if (sortEntity) urlParams.append('sortBy', sortEntity);
        if (searchWord) urlParams.append('search', searchWord);
        if (type) urlParams.append('type', type);
        return await fetchData(`/reviews?${urlParams.toString()}`, { method: 'GET' });
    };
    const removeReview = async (id: string) => await fetchData(`/reviews/${id}`, { method: 'DELETE' });
    const getReviewsByType = async (param: 'product' | 'organization') => await fetchData(`/reviews/${param}`, { method: 'GET' });
    const getProductReview = async (id: string) => await fetchData(`/reviews/product/${id}`, { method: 'GET' });

    const getPopularProducts = async (popularitySortOrder: 'desc' | 'asc') => {
        const urlParams = new URLSearchParams();
        if (popularitySortOrder) {
            urlParams.append('sortBy', 'popularityScore');
            urlParams.append('order', popularitySortOrder);
            urlParams.append('limit', '40');
        }
        return await fetchData(`/product?${urlParams.toString()}`, { method: 'GET' });
    };

    const getRecentProducts = async (sortOrder: 'desc' | 'asc', limit = 40) => {
        const urlParams = new URLSearchParams();
        if (sortOrder) {
            urlParams.append('sortBy', 'created_at');
            urlParams.append('order', sortOrder);
            urlParams.append('limit', `${limit}`);
        }
        return await fetchData(`/product?${urlParams.toString()}`, { method: 'GET' });
    };

    return {
        data,
        error,
        loading,
        fetchData,
        getAllProducts,
        getProductsByCategory,
        createProduct,
        deleteProductById,
        updateProduct,
        getProductsById,
        getOrders,
        changeOrderStatus,
        getReviews,
        removeReview,
        getReviewsByType,
        getProductReview,
        getPopularProducts,
        getRecentProducts
    };
};

export default useAdminApi;