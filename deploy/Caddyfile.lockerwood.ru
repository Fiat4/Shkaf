# Caddy на хосте РФ (авто-HTTPS, TLS 1.2+)
# Файл: /etc/caddy/Caddyfile

{
	# Глобально: только TLS 1.2 и 1.3 (без 1.0/1.1)
	servers {
		protocols h1 h2
	}
}

(tls12) {
	tls {
		protocols tls1.2 tls1.3
	}
}

lockerwood.ru, www.lockerwood.ru {
	import tls12
	encode gzip
	reverse_proxy 127.0.0.1:8080
}

api.lockerwood.ru {
	import tls12
	encode gzip
	reverse_proxy 127.0.0.1:3000
}
