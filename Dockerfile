FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencies
RUN npm ci --omit=dev

# Copiar código
COPY . .

# Build
RUN npm run build

# Remover dev dependencies and source files desnecessários
RUN rm -rf node_modules client server script shared *.ts *.js *.json 2>/dev/null || true
RUN npm ci --omit=dev --production

# Iniciar
EXPOSE 5000
CMD ["npm", "start"]
