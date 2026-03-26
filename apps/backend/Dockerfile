FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN npm prune --production

RUN addgroup -g 1001 -S nodejs \
 && adduser -S -u 1001 nodejs \
 && chown -R nodejs:nodejs /app

USER nodejs
EXPOSE 3000

# Agora o generate roda sempre antes de iniciar
CMD ["npm", "start"]
