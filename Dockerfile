FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencies
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# Iniciar
EXPOSE 5000
CMD ["npm", "start"]
