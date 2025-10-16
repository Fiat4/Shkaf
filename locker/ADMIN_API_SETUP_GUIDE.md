# 🔐 Настройка авторизованных запросов для админ панели

## ✅ Что создано:

### **Новый хук `useAdminApi`**
- Использует **axios** вместо fetch
- **Автоматически добавляет токен** в заголовки запросов
- **Автоматически обновляет токен** при истечении
- **Обрабатывает ошибки** и редиректы

### **Ключевые особенности:**

#### 1. **Автоматическое добавление токена**
```typescript
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);
```

#### 2. **Автоматическое обновление токена**
```typescript
adminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Обновляем токен через /admin/refresh
            const refreshResponse = await adminApi.post('/admin/refresh');
            // Повторяем оригинальный запрос с новым токеном
        }
    }
);
```

#### 3. **Доступные методы**
- `getAllProducts()` - получить все продукты
- `createProduct(product)` - создать продукт
- `updateProduct(id, body)` - обновить продукт
- `deleteProductById(id)` - удалить продукт
- `getOrders(type, status)` - получить заказы
- `changeOrderStatus(id, status)` - изменить статус заказа
- `getReviews(...)` - получить отзывы
- `removeReview(id)` - удалить отзыв

## 🔄 Как использовать:

### **В компонентах админ панели:**
```typescript
import useAdminApi from '../../hook/useAdminApi';

const MyComponent = () => {
    const { getAllProducts, loading, error } = useAdminApi();
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        const products = await getAllProducts();
        console.log(products);
    };
};
```

### **Автоматические возможности:**
- ✅ **Токен добавляется** в каждый запрос
- ✅ **Токен обновляется** при истечении
- ✅ **Ошибки обрабатываются** автоматически
- ✅ **Редирект на логин** при неудачном обновлении

## 🧪 Как тестировать:

### 1. **Войдите в админ панель** на `/admin/login`
### 2. **Перейдите в админ панель** - все запросы должны работать
### 3. **Дождитесь истечения access token** (20 секунд)
### 4. **Выполните любой API запрос** - токен должен обновиться автоматически
### 5. **Проверьте логи** в консоли

## 📋 Что искать в логах:

### **При обновлении токена:**
```
🔄 useAdminApi: Пытаемся обновить токен через /admin/refresh
✅ useAdminApi: Получен новый токен
```

### **При ошибке обновления:**
```
❌ useAdminApi: Ошибка при обновлении токена
```

## 🎯 Ожидаемый результат:

Теперь все запросы в админ панели должны:
- **Автоматически включать токен** авторизации
- **Обновлять токен** при истечении
- **Работать прозрачно** для пользователя
- **Обрабатывать ошибки** корректно

## 🔄 Миграция:

Замените `useApi` на `useAdminApi` во всех компонентах админ панели для получения автоматической авторизации.

Попробуйте сейчас! 🚀
