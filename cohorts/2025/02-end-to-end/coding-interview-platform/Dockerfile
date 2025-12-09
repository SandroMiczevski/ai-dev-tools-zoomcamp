# Multi-stage Dockerfile for Coding Interview Platform
# Combines backend (Express) and frontend (Next.js) in a single container

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies (production only)
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Stage 3: Final runtime image
FROM node:18-alpine

WORKDIR /app

# Install dumb-init to handle process signals properly
RUN apk add --no-cache dumb-init

# Create app directories
RUN mkdir -p /app/backend /app/frontend/.next

# Copy backend files from builder
COPY --from=backend-builder /app/backend /app/backend

# Copy frontend build output from builder
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=frontend-builder /app/frontend/package*.json /app/frontend/
COPY --from=frontend-builder /app/frontend/next.config.js /app/frontend/

# Install frontend runtime dependencies only (excluding dev dependencies)
WORKDIR /app/frontend
RUN npm ci --only=production

# Switch back to app root
WORKDIR /app

# Copy root package.json
COPY package*.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV CLIENT_URL=http://localhost:3000

# Expose ports
# 5000: Backend Express server
# 3000: Frontend Next.js server (for health checks)
EXPOSE 5000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/sessions', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start both services
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]
