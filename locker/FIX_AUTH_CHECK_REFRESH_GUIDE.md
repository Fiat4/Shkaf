# 🔄 Исправление обновления токенов в useAuthCheck

## 🐛 Проблема была в том, что:

**`useAuthCheck` не использовал интерсептор для обновления токенов**. Когда access token истекал, он просто получал 401 ошибку и удалял токен, вместо того чтобы попытаться обновить его через refresh token.

## ✅ Что исправлено:

### **Добавлен интерсептор в `useAuthCheck`**
```typescript
authCheckApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Пытаемся обновить токен через /admin/refresh
            const refreshResponse = await authCheckApi.post('/admin/refresh');
            
            if (refreshResponse.status === 201 && refreshResponse.data.accessToken) {
                const newToken = refreshResponse.data.accessToken;
                
                // Обновляем токен в localStorage
                localStorage.setItem('adminToken', newToken);
                
                // Повторяем оригинальный запрос с новым токеном
                return authCheckApi(originalRequest);
            }
        }
    }
);
```

## 🔄 Как теперь работает:

### **При истечении access token:**
1. `useAuthCheck` делает запрос на `/admin/check`
2. Получает 401 ошибку
3. **Интерсептор автоматически обновляет токен** через `/admin/refresh`
4. **Обновляет токен в localStorage**
5. **Повторяет оригинальный запрос** с новым токеном
6. Пользователь остается авторизованным

### **При истечении refresh token:**
1. Интерсептор не может обновить токен
2. **Удаляет токен из localStorage**
3. `useAuthCheck` возвращает `isAuthenticated: false`
4. `ProtectedRoute` редиректит на логин

## 🧪 Как тестировать:

### 1. **Войдите в систему** на `/admin/login`
### 2. **Перейдите в админ панель** - токен должен быть в localStorage
### 3. **Дождитесь истечения access token** (20 секунд)
### 4. **Обновите страницу** - токен должен обновиться автоматически
### 5. **Проверьте логи** в консоли

## 📋 Что искать в логах:

### **При успешном обновлении токена:**
```
🔍 Проверяем авторизацию с токеном...
🔄 useAuthCheck: Пытаемся обновить токен через /admin/refresh
✅ useAuthCheck: Получен новый токен
✅ Авторизация подтверждена: 200
```

### **При истечении refresh token:**
```
🔍 Проверяем авторизацию с токеном...
🔄 useAuthCheck: Пытаемся обновить токен через /admin/refresh
❌ useAuthCheck: Ошибка при обновлении токена
❌ Авторизация не подтверждена: 401
🔒 Redirecting to login, error: Request failed with status code 401
```

## 🎯 Ожидаемый результат:

Теперь система должна:
- **Автоматически обновлять токены** при истечении access token
- **Пользователь остается авторизованным** до истечения refresh token
- **Корректно работать** с защищенными маршрутами
- **Не удалять токен** преждевременно

Попробуйте сейчас! 🚀
