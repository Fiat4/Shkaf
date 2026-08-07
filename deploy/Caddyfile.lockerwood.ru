# Caddy на хосте РФ (авто-HTTPS)
# Файл: /etc/caddy/Caddyfile

lockerwood.ru, www.lockerwood.ru {
	encode gzip
	reverse_proxy 127.0.0.1:80
}

api.lockerwood.ru {
	encode gzip
	reverse_proxy 127.0.0.1:3000
}
