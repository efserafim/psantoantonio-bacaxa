FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar ALL dependencies
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# Remover source files
RUN rm -rf client server script shared src .local .env vite.config.ts tsconfig.json

# Install apenas production deps
RUN npm prune --omit=dev

# Iniciar
EXPOSE 5000
CMD ["npm", "start"]
