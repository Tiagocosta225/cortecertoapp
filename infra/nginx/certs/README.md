Coloque aqui os arquivos do Cloudflare Origin Certificate usados pelo Nginx.

Arquivos esperados:
- `origin.crt`
- `origin.key`

Os caminhos padrao estao em `infra/docker/.env`:
- `SSL_CERT_PATH=/etc/nginx/certs/origin.crt`
- `SSL_KEY_PATH=/etc/nginx/certs/origin.key`

Passos:
1. No painel da Cloudflare, gere um Origin Certificate para os hosts configurados.
2. Salve o certificado em `infra/nginx/certs/origin.crt`.
3. Salve a chave privada em `infra/nginx/certs/origin.key`.
4. Suba a stack com `docker compose -f infra/docker/docker-compose.yml up -d --build`.
5. Na Cloudflare, use SSL/TLS mode `Full (strict)`.
