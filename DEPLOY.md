# Деплой Locker Wood (Docker)

## Архитектура

| Сервер | Что крутится | Данные |
|--------|----------------|--------|
| **РФ** | `docker compose`: Postgres + API + Web | БД, uploads, заявки (ПДн) |
| **KZ** | `deploy/kz-telegram-proxy` | Только прокси к Telegram, без ПДн |

Рекомендуемые домены:
- `https://lockerwood.ru` → web (порт 80/443)
- `https://api.lockerwood.ru` → api (порт 3000/443)
- `https://tg.ваш-kz.kz` → Telegram proxy

---

## 0. Что нужно сегодня

1. VPS в РФ (2 vCPU / 4 GB) с Docker + Docker Compose
2. (Опционально сразу) VPS в KZ (1 vCPU / 1 GB) для Telegram
3. Домен с A-записями на РФ (и на KZ для прокси)

Установка Docker на Ubuntu:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# перелогиньтесь
```

---

## 1. Запуск на РФ-сервере

```bash
git clone <ваш-репозиторий> lockerwood
cd lockerwood
cp .env.example .env
nano .env   # заполните пароли, URL, Telegram
```

Минимум в `.env` для первого старта по IP:

```env
POSTGRES_PASSWORD=...
ADMIN_PASSWORD=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
URL=http://СЕРВЕР_IP:3000
REACT_APP_API_URL=http://СЕРВЕР_IP:3000
CORS_ORIGIN=http://СЕРВЕР_IP,http://СЕРВЕР_IP:80
WEB_PORT=80
API_PORT=3000
```

Сборка и запуск:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api
```

Проверка:
- сайт: `http://СЕРВЕР_IP/`
- api: `http://СЕРВЕР_IP:3000/product`
- админка: `http://СЕРВЕР_IP/admin/login`

### Перенос фото/товаров с локальной машины

На локальном ПК (где уже есть данные):

```bash
# дамп БД
docker compose exec -T db pg_dump -U locker lockerwood > dump.sql
# или если БД локальная не в docker:
# pg_dump ... > dump.sql

# архив uploads
tar -czf uploads.tgz -C server uploads
```

На сервере:

```bash
docker compose exec -T db psql -U locker lockerwood < dump.sql
docker compose cp uploads.tgz api:/tmp/
docker compose exec api sh -c "cd /app && tar -xzf /tmp/uploads.tgz"
```

Если в БД URL картинок вида `http://localhost:3000/...`, замените:

```sql
UPDATE products
SET avatar = REPLACE(avatar, 'http://localhost:3000', 'http://СЕРВЕР_IP:3000'),
    imgs = ARRAY(
      SELECT REPLACE(x, 'http://localhost:3000', 'http://СЕРВЕР_IP:3000')
      FROM unnest(imgs) AS x
    );
```

---

## 2. Telegram через KZ

На KZ:

```bash
cd deploy/kz-telegram-proxy
docker compose up -d
```

Поставьте DNS `tg.ваш-домен.kz` → IP KZ.  
Позже добавьте HTTPS (Caddy/Cloudflare).

На РФ в `.env`:

```env
TELEGRAM_API_ROOT=http://IP_KZ
# или после SSL:
# TELEGRAM_API_ROOT=https://tg.ваш-домен.kz
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_IDS=666344039,743115948
```

```bash
docker compose up -d api
docker compose logs -f api | grep -i telegram
```

---

## 3. Прод с доменами + HTTPS (когда DNS готов)

Самый быстрый вариант — Cloudflare Proxy (оранжевое облако) или Caddy перед compose.

Пример Caddyfile на хосте РФ (TLS 1.2+, web на порту 8080):

```caddy
(tls12) {
  tls {
    protocols tls1.2 tls1.3
  }
}

lockerwood.ru, www.lockerwood.ru {
  import tls12
  reverse_proxy 127.0.0.1:8080
}

api.lockerwood.ru {
  import tls12
  reverse_proxy 127.0.0.1:3000
}
```

Тогда в `.env`:

```env
URL=https://api.lockerwood.ru
REACT_APP_API_URL=https://api.lockerwood.ru
CORS_ORIGIN=https://lockerwood.ru,https://www.lockerwood.ru
COOKIE_DOMAIN=.lockerwood.ru
```

После смены `REACT_APP_API_URL` обязательно пересобрать web:

```bash
docker compose up -d --build web
```

---

## 4. Полезные команды

```bash
docker compose logs -f api web db
docker compose restart api
docker compose down
docker compose up -d --build
```

Бэкап:

```bash
docker compose exec -T db pg_dump -U locker lockerwood > backup-$(date +%F).sql
docker run --rm -v lockerwood_uploads:/data -v ${PWD}:/backup alpine \
  tar -czf /backup/uploads-$(date +%F).tgz -C /data .
```

---

## 5. Чеклист на сегодня

- [ ] Docker на РФ VPS
- [ ] `.env` заполнен
- [ ] `docker compose up -d --build`
- [ ] Открывается главная и каталог
- [ ] Логин в админку
- [ ] Перенесены БД + uploads (или seed)
- [ ] KZ proxy + `TELEGRAM_API_ROOT`
- [ ] Тестовая заявка → сообщение в Telegram
