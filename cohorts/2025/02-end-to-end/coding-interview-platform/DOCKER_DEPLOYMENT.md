# Docker Deployment Guide

Complete guide for building and deploying the Coding Interview Platform using Docker.

## Overview

The application is packaged in a single Docker container that runs:
- **Backend:** Express.js server (Port 5000)
- **Frontend:** Next.js application (Port 3000)

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Container                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐         ┌──────────────────┐     │
│  │   Next.js Frontend│         │ Express Backend  │     │
│  │   (Port 3000)    │◄───────►│  (Port 5000)    │     │
│  └──────────────────┘         └──────────────────┘     │
│         │                              │                │
│         │ Socket.io                    │                │
│         └──────────────────────────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
         │                          │
    Port 3000 ◄──────────────────► Port 5000
    (exposed)                      (exposed)
```

## Building the Docker Image

### Method 1: Build with Docker CLI

```bash
# Build the image
docker build -t coding-interview-platform:latest .

# Verify the image was built
docker images | grep coding-interview-platform
```

### Method 2: Build with Docker Compose

```bash
# Build and start with Docker Compose
docker-compose -f docker-compose.prod.yml up --build

# Build without starting
docker-compose -f docker-compose.prod.yml build
```

## Running the Container

### Method 1: Using Docker Run

```bash
# Basic run
docker run -p 5000:5000 -p 3000:3000 coding-interview-platform:latest

# With environment variables
docker run \
  -p 5000:5000 \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  coding-interview-platform:latest

# Detached mode (background)
docker run -d \
  -p 5000:5000 \
  -p 3000:3000 \
  --name interview-app \
  coding-interview-platform:latest

# With container name and restart policy
docker run -d \
  -p 5000:5000 \
  -p 3000:3000 \
  --name interview-app \
  --restart unless-stopped \
  coding-interview-platform:latest
```

### Method 2: Using Docker Compose

```bash
# Start the application
docker-compose -f docker-compose.prod.yml up

# Start in detached mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop the application
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes
docker-compose -f docker-compose.prod.yml down -v
```

## Accessing the Application

Once the container is running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Sessions endpoint:** http://localhost:5000/api/sessions

## Container Management

### View Running Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a
```

### View Container Logs

```bash
# View logs
docker logs <container-id>

# Follow logs (tail -f)
docker logs -f <container-id>

# View last 100 lines
docker logs --tail 100 <container-id>

# With timestamps
docker logs -t <container-id>
```

### Stop and Remove

```bash
# Stop container
docker stop <container-id>

# Start container
docker start <container-id>

# Restart container
docker restart <container-id>

# Remove container
docker rm <container-id>

# Force remove (if running)
docker rm -f <container-id>
```

## Image Management

### View Images

```bash
# List all images
docker images

# List images with details
docker images -a

# Search for image
docker images | grep coding-interview
```

### Remove Images

```bash
# Remove image
docker rmi coding-interview-platform:latest

# Remove unused images
docker image prune

# Force remove
docker rmi -f coding-interview-platform:latest
```

## Debugging

### Access Container Shell

```bash
# Interactive shell in running container
docker exec -it <container-id> sh

# Bash shell (if available)
docker exec -it <container-id> bash

# Example commands inside container:
# ps aux                 # View running processes
# curl http://localhost:5000/api/sessions  # Test backend
# ls -la /app           # View app directory
```

### Check Health Status

```bash
# View container health
docker inspect <container-id> | grep -A 5 '"Health"'

# Manual health check
docker exec <container-id> node -e "require('http').get('http://localhost:5000/api/sessions', (r) => console.log(r.statusCode))"
```

### View Container Stats

```bash
# Real-time stats
docker stats <container-id>

# One-time snapshot
docker stats --no-stream <container-id>
```

## Environment Variables

Configure the container with environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `5000` | Backend server port |
| `CLIENT_URL` | `http://localhost:3000` | Frontend URL for CORS |

### Setting Environment Variables

```bash
# With docker run
docker run -e NODE_ENV=production -e PORT=5000 ...

# With docker-compose (in docker-compose.prod.yml)
environment:
  NODE_ENV: production
  PORT: 5000
  CLIENT_URL: http://localhost:3000
```

## Performance Optimization

### Image Size

Current image size: ~400-500MB (includes Node 18 + dependencies)

**To reduce size:**

```dockerfile
# Use node:18-alpine-slim (even smaller base)
FROM node:18-alpine-slim

# Remove unnecessary files after build
RUN npm install --production && \
    npm cache clean --force && \
    rm -rf /tmp/*
```

### Build Optimization

The Dockerfile uses multi-stage builds to:
- Keep image size small (unused build tools removed)
- Reduce dependencies (only production deps in final image)
- Optimize build caching (separate stages build independently)

### Runtime Performance

```bash
# Monitor resource usage
docker stats coding-interview-platform

# Limit container resources
docker run --cpus="1.5" --memory="1g" ...
```

## Network Configuration

### Container Communication

```bash
# Create custom network
docker network create interview-network

# Run container on custom network
docker run --network interview-network \
  -p 5000:5000 \
  -p 3000:3000 \
  coding-interview-platform:latest
```

### Port Mapping

```bash
# Map to different host ports
docker run -p 8000:5000 -p 8080:3000 ...

# Expose to all interfaces
docker run -p 0.0.0.0:5000:5000 -p 0.0.0.0:3000:3000 ...
```

## Persistence

### Data Volumes

```bash
# Create named volume
docker volume create interview-data

# Run with volume
docker run -v interview-data:/app/data ...

# List volumes
docker volume ls

# Remove volume
docker volume rm interview-data
```

### Bind Mounts (Development)

```bash
# Mount host directory
docker run -v /path/to/local:/app/data ...

# Example: Mount backend logs
docker run -v $(pwd)/logs:/app/backend/logs ...
```

## Deployment Best Practices

### 1. Security

- Use specific image tags (not `latest`)
- Don't run as root
- Limit container resources
- Use read-only filesystems where possible

```dockerfile
# Add user (in Dockerfile)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

### 2. Logging

Configure proper logging:

```dockerfile
# In Dockerfile
ENV NODE_LOG_LEVEL=info

# Docker logging driver
docker run --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 ...
```

### 3. Health Checks

Container includes health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/sessions', ...)"
```

### 4. Restart Policy

```bash
# In docker-compose
restart: unless-stopped

# Or with docker run
docker run --restart unless-stopped ...
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs <container-id>

# Check image integrity
docker inspect coding-interview-platform:latest
```

### Port already in use

```bash
# Find process using port
lsof -i :5000
lsof -i :3000

# Use different ports
docker run -p 9000:5000 -p 9001:3000 ...
```

### Memory issues

```bash
# Check container memory usage
docker stats <container-id>

# Limit memory
docker run --memory="512m" --memory-swap="1g" ...
```

### Frontend can't connect to backend

```bash
# Check container network
docker network inspect bridge

# Verify backend is running
docker exec <container-id> curl http://localhost:5000/api/sessions

# Check CLIENT_URL environment variable
docker inspect <container-id> | grep CLIENT_URL
```

## Advanced Configuration

### Multi-container Setup (Optional)

For separated services:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: backend-builder
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: frontend-builder
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### Custom Environment Files

```bash
# Create .env file
echo "NODE_ENV=production" > .env
echo "PORT=5000" >> .env

# Use with docker run
docker run --env-file .env ...

# Use with docker-compose
docker-compose --env-file .env up
```

## Production Deployment

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `CLIENT_URL`
- [ ] Set resource limits (CPU, memory)
- [ ] Configure restart policy
- [ ] Enable health checks
- [ ] Set up logging
- [ ] Configure backups (if needed)
- [ ] Test failover/recovery

### Kubernetes Deployment (Optional)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coding-interview-platform
spec:
  replicas: 1
  selector:
    matchLabels:
      app: coding-interview-platform
  template:
    metadata:
      labels:
        app: coding-interview-platform
    spec:
      containers:
      - name: app
        image: coding-interview-platform:latest
        ports:
        - containerPort: 5000
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/sessions
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Cleanup

### Remove everything

```bash
# Stop and remove container
docker-compose -f docker-compose.prod.yml down

# Remove image
docker rmi coding-interview-platform:latest

# Remove all unused images, containers, volumes
docker system prune -a --volumes

# Remove specific volume
docker volume rm interview-data
```

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js in Docker](https://github.com/nodejs/docker-node)

---

**Last Updated:** December 9, 2025
**Status:** Production Ready
