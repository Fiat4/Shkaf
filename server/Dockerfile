# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS deps
WORKDIR /app
# Timeweb/RF: deb.debian.org часто очень медленный в build
RUN sed -i 's|deb.debian.org|mirror.yandex.ru|g; s|security.debian.org|mirror.yandex.ru|g' /etc/apt/sources.list.d/debian.sources \
    || sed -i 's|deb.debian.org|mirror.yandex.ru|g; s|security.debian.org|mirror.yandex.ru|g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
# RF: binaries.prisma.sh часто таймаутится — зеркало npmmirror
ENV PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM deps AS build
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN sed -i 's|deb.debian.org|mirror.yandex.ru|g; s|security.debian.org|mirror.yandex.ru|g' /etc/apt/sources.list.d/debian.sources \
    || sed -i 's|deb.debian.org|mirror.yandex.ru|g; s|security.debian.org|mirror.yandex.ru|g' /etc/apt/sources.list
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/uploads/product /app/uploads/review

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
