# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
# CRA needs react-scripts from devDependencies during build
ENV NPM_CONFIG_PRODUCTION=false
RUN npm ci
COPY . .
ARG REACT_APP_API_URL=http://localhost:3000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
