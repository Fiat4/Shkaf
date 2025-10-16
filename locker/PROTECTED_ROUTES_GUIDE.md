# 🛡️ Защита админ маршрутов с Outlet

## ✅ Что настроено:

### 1. **Защищенные маршруты**
Все админ маршруты теперь защищены через `ProtectedRoute`:

```tsx
<Route path="admin" element={
    <ProtectedRoute>
        <AdminPage/>
    </ProtectedRoute>
}>
    <Route index element={<AdminMain/>}/>
    <Route path="prods" element={<AdminProducts/>}/>
    <Route path="pops" element={<AdminPopularProducts/>}/>
    <Route path="new" element={<AdminNew/>}/>
    <Route path="reviews" element={<AdminReviews/>}/>
    <Route path="requests" element={<AdminRequests/>}/>
    <Route path="user" element={<AdminUser/>}/>
</Route>
```

### 2. **Логика защиты**
- `ProtectedRoute` проверяет аутентификацию через `useAuth`
- При отсутствии токена происходит редирект на `/admin/login`
- Показывается индикатор загрузки во время проверки
- `AdminPage` с `Outlet` отображается только после успешной аутентификации

## 🧪 Тестирование защиты:

### 1. **Тест без авторизации**
- Перейдите напрямую на: `http://localhost:3001/admin`
- **Ожидаемый результат**: автоматический редирект на `/admin/login`

### 2. **Тест с авторизацией**
- Войдите в систему через `/admin/login`
- Перейдите на любой админ маршрут:
  - `http://localhost:3001/admin` (главная)
  - `http://localhost:3001/admin/prods` (товары)
  - `http://localhost:3001/admin/reviews` (отзывы)
  - и т.д.
- **Ожидаемый результат**: страница загружается корректно

### 3. **Тест истечения токена**
- Войдите в систему
- Удалите токен из localStorage: `localStorage.removeItem('adminToken')`
- Обновите страницу или перейдите на другой админ маршрут
- **Ожидаемый результат**: редирект на `/admin/login`

### 4. **Тест выхода**
- Войдите в систему
- Нажмите кнопку "Выйти" в админ панели
- **Ожидаемый результат**: редирект на `/admin/login`

## 🔧 Как это работает:

1. **При загрузке админ маршрута**:
   - `ProtectedRoute` проверяет `isAuthenticated` из `useAuth`
   - Если `loading = true` → показывает "Проверка авторизации..."
   - Если `isAuthenticated = false` → редирект на `/admin/login`
   - Если `isAuthenticated = true` → рендерит `AdminPage` с `Outlet`

2. **AdminPage с Outlet**:
   - Отображает сайдбар с навигацией
   - `<Outlet/>` рендерит дочерние маршруты (AdminMain, AdminProducts и т.д.)
   - Все дочерние компоненты автоматически защищены

3. **Автоматическая проверка токена**:
   - При каждом запросе к API проверяется валидность токена
   - При получении 401 ошибки происходит автоматический выход

## 🎯 Готово!

Все админ маршруты с `Outlet` теперь полностью защищены. Система автоматически проверяет аутентификацию и перенаправляет неавторизованных пользователей на страницу логина.
