# Application Docker file Configuration
# Visit https://docs.docker.com/engine/reference/builder/
# Using multi stage build

# Prepare the image when build
# also use to minimize the docker image
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build


# Build the image as production
# So we can minimize the size
# Builder stage
FROM node:20 AS stage-1
WORKDIR /app
ENV PORT=4000
ENV NODE_ENV=production
COPY --from=builder /app .
RUN npm install --legacy-peer-deps
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}
# Final stage

CMD ["npm", "run", "start"]