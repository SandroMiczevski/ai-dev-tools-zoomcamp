# 🚀 Concurrently Setup Guide

## Overview

The project now supports running both the backend and frontend simultaneously using `concurrently`. This eliminates the need for multiple terminal windows during development.

## Installation

First, install dependencies:

```bash
# Install root dependencies and all subpackages
npm run install:all

# Or manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Running the Application

### Option 1: Both Services in One Terminal (Recommended)
```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

Both services run with hot-reload enabled (using `nodemon` for backend and Next.js dev server for frontend).

### Option 2: Run Services Individually
```bash
# Only backend
npm run dev:backend

# Only frontend
npm run dev:frontend

# Or from service directories
cd backend && npm run dev
cd frontend && npm run dev
```

### Option 3: Production Mode
```bash
npm start
```

Starts both services in production mode.

## Available Commands

### Development
```bash
npm run dev              # Both backend & frontend with hot-reload
npm run dev:backend     # Backend only with hot-reload
npm run dev:frontend    # Frontend only with hot-reload
```

### Production
```bash
npm start               # Both backend & frontend in production
npm run start:backend   # Backend only in production
npm run start:frontend  # Frontend only in production
npm run build           # Build frontend for production
```

### Testing
```bash
npm test                      # Run all backend and frontend tests
npm run test:backend          # Run all backend tests
npm run test:backend:integration  # Run integration tests only
npm run test:backend:unit     # Run unit tests only
npm run test:frontend         # Run frontend tests only
```

### Installation
```bash
npm run install:all    # Install dependencies for all packages
```

## What is Concurrently?

`concurrently` is an npm package that allows you to run multiple commands in parallel in a single terminal window. It:

- Runs multiple processes at the same time
- Prefixes output from each process for easy identification
- Manages process lifecycle (stops all processes when you exit)
- Simplifies development workflow

## Root Package.json

The root `package.json` file has been added with scripts to coordinate both services:

```json
{
  "name": "coding-interview-platform",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "start": "concurrently \"cd backend && npm start\" \"cd frontend && npm start\"",
    "test": "concurrently \"cd backend && npm test\" \"cd frontend && npm test\"",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

## Quick Start Checklist

- [x] Root `package.json` created with concurrently
- [x] Development script runs both backend and frontend
- [x] Production script runs both backend and frontend
- [x] Test script runs tests for both services
- [x] Install script installs dependencies for all packages
- [x] Individual scripts available for each service

## Viewing Output

When running `npm run dev`, you'll see output like:

```
[0] Server running on port 5000
[1] ready - started server on 0.0.0.0:3000, url: http://localhost:3000
[0] POST /api/sessions 201 - 2.5ms
[1] GET /interview/abc123 200 - 15.3ms
```

The `[0]` prefix indicates backend output, `[1]` indicates frontend output.

## Stopping the Services

Press `Ctrl+C` to stop all services at once. No need to stop individual terminals!

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Kill process on port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

### Concurrently Not Found
```bash
npm install
npm run install:all
```

### Services Not Starting
```bash
# Try running individually first
npm run dev:backend
npm run dev:frontend

# If they work separately, the issue is likely concurrently-related
# Try clearing node_modules
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## Comparison: Before vs After

### Before (Two Terminals)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### After (One Terminal)
```bash
npm run dev
```

Much simpler! 🎉

---

**Version**: 1.0.0
**Last Updated**: 2024
