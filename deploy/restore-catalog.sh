#!/bin/sh
# Восстановление каталога на прод-сервере (MSK).
# Перед запуском положите в /root/:
#   lockerwood_dump.sql
#   uploads.tgz   (архив папки server/uploads с ПК)
set -e

cd /root/lockerwood

DUMP="${1:-/root/lockerwood_dump.sql}"
UPLOADS="${2:-/root/uploads.tgz}"
API_URL="${3:-https://api.lockerwood.ru}"

if [ ! -f "$DUMP" ]; then
  echo "Нет файла дампа: $DUMP"
  exit 1
fi
if [ ! -f "$UPLOADS" ]; then
  echo "Нет архива uploads: $UPLOADS"
  exit 1
fi

echo "Останавливаем API..."
docker compose stop api

echo "Восстанавливаем БД из $DUMP ..."
docker compose exec -T db psql -U locker -d lockerwood -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker compose exec -T db psql -U locker -d lockerwood < "$DUMP"

echo "Обновляем URL картинок -> $API_URL ..."
docker compose exec -T db psql -U locker -d lockerwood <<EOF
UPDATE products
SET avatar = regexp_replace(avatar, '^https?://[^/]+', '$API_URL', 'g')
WHERE avatar IS NOT NULL AND avatar <> '';

UPDATE products
SET imgs = ARRAY(
  SELECT regexp_replace(x, '^https?://[^/]+', '$API_URL', 'g')
  FROM unnest(imgs) AS x
)
WHERE imgs IS NOT NULL;

UPDATE reviews
SET avatar = regexp_replace(avatar, '^https?://[^/]+', '$API_URL', 'g')
WHERE avatar IS NOT NULL AND avatar <> '';

UPDATE reviews
SET imgs = ARRAY(
  SELECT regexp_replace(x, '^https?://[^/]+', '$API_URL', 'g')
  FROM unnest(imgs) AS x
)
WHERE imgs IS NOT NULL;
EOF

echo "Распаковываем uploads..."
docker compose cp "$UPLOADS" api:/tmp/uploads.tgz
docker compose exec api sh -c 'cd /app && tar -xzf /tmp/uploads.tgz && rm -f /tmp/uploads.tgz'
docker compose exec api sh -c 'ls -la /app/uploads/product | head -10'

echo "Запускаем API..."
docker compose up -d api

sleep 3
echo "Проверка:"
curl -s "http://127.0.0.1:3000/product?limit=3" | head -c 400
echo
