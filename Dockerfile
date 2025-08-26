# Dockerfile para Portfolio Alexandre Barros
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar build de produção
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para executar
CMD ["npm", "start"]
