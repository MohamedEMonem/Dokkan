# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY package*.json ./
COPY nx.json tsconfig.base.json ./
COPY web ./web
COPY libs ./libs

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build the web app
RUN npx nx build web --prod

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist/web ./dist

# Expose port
EXPOSE 4200

# Start the application
CMD ["serve", "-s", "dist", "-l", "4200"]
