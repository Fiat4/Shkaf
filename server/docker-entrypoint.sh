#!/bin/sh
set -e

echo "Waiting for database..."
sleep 3

echo "Applying schema (prisma db push)..."
npx prisma db push --skip-generate

echo "Seeding admin (if empty)..."
npx prisma db seed || true

echo "Starting API..."
exec node dist/main.js
