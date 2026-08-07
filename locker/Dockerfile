# syntax=docker/dockerfile:1
# Serves a pre-built CRA `build/` folder (no npm on the server).

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
