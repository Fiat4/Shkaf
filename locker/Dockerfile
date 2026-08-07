# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app

# Avoid production omit during install (compose may inject NODE_ENV=production)
ENV NODE_ENV=development
ENV CI=true

COPY package.json package-lock.json* ./
RUN npm ci
# Fail early with a clear message if CRA toolchain is missing
RUN test -x node_modules/.bin/react-scripts \
  || (echo "ERROR: react-scripts not installed" && ls -la node_modules | head -50 && exit 1)

COPY . .
ARG REACT_APP_API_URL=http://localhost:3000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_ENV=production
# Call local binary — do not use npx (it may hit registry and timeout)
RUN ./node_modules/.bin/react-scripts build

FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
