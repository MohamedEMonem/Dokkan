# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./
COPY api ./api
COPY libs ./libs
COPY prisma ./prisma

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build the API
RUN npx nx build api --prod

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --prod --legacy-peer-deps && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist/api ./dist/api
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Run Prisma migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/api/main.js"]
