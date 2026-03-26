FROM nginx:alpine

# Remove arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/nginx.conf

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/

# Copia os arquivos buildados do frontend
COPY build/ /usr/share/nginx/html/

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
