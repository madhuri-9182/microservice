# ---------- Stage 1: Builder ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies ( if we use npm avoid yarn)
COPY package.json package-lock.json ./ 
RUN npm ci --omit=dev

# Copy application code
COPY . .

# ---------- Stage 2: Production Image ----------
FROM node:18-alpine

# Set environment
ENV NODE_ENV=production
WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/*.jsx ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/babel.config.js ./

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
