#!/bin/sh
set -e

echo "Waiting for database..."
sleep 3

echo "Applying schema (prisma db push)..."
npx prisma db push --skip-generate

echo "Seeding admin (if empty)..."
npx prisma db seed || true

echo "Starting API..."
if [ -f dist/main.js ]; then
  exec node dist/main.js
elif [ -f dist/src/main.js ]; then
  exec node dist/src/main.js
else
  echo "ERROR: main.js not found under dist/"
  ls -la dist || true
  ls -la dist/src || true
  exit 1
fi
