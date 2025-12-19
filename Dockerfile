FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar ALL dependencies (inclui dev)
RUN npm ci

# Copiar código
COPY . .

# Build
RUN npm run build

# Remover pasta desnecessária
RUN rm -rf client server script shared src .local .env

# Instalar apenas dependencies de produção
RUN npm prune --omit=dev

# Iniciar
EXPOSE 5000
CMD ["npm", "start"]
