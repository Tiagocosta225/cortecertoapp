FROM postgres:15-alpine

# Instala extensões úteis
RUN apk add --no-cache \
    postgresql-contrib \
    curl

# Copia arquivos de configuração
# COPY /postgres/init/conf/postgresql.conf /etc/postgresql/postgresql.conf
COPY init/ /docker-entrypoint-initdb.d/

# Define permissões
#RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# Expõe porta padrão
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
