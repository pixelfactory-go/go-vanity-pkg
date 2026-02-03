# Build stage
FROM oven/bun:1-alpine@sha256:b0885548002187f088af5c7e04008f852c0a30cbe4192b5d75c3266a7f0b01f5 AS builder

# Set working directory
WORKDIR /build

# Copy package files
COPY package*.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build assets (CSS and JS)
RUN bun run css:build && bun run js:build

# Production stage
FROM oven/bun:1-alpine@sha256:b0885548002187f088af5c7e04008f852c0a30cbe4192b5d75c3266a7f0b01f5

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lockb* ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Copy built assets from builder
COPY --from=builder /build/public ./public
COPY --from=builder /build/styles.css ./styles.css

# Copy application source and config
COPY src ./src
COPY server.ts ./
COPY tsconfig.json ./
COPY config.example.json ./config.json

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the server with Bun (native TypeScript support)
CMD ["bun", "run", "server.ts"]
