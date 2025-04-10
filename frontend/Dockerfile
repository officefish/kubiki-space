# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Используем флаг --legacy-peer-deps, чтобы обойти конфликт зависимостей
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Serve stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist .
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
