# 🚀 Setup Guide - Run Backend and Frontend Together

## Overview

Your project now supports running both the backend and frontend servers simultaneously using `concurrently`.

## Quick Setup (3 Steps)

### Step 1: Install Concurrently
```bash
npm install --save-dev concurrently
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

This installs dependencies for:
- Root project
- Backend
- Frontend

### Step 3: Run Both Services
```bash
npm run dev
```

Done! 🎉 Open http://localhost:3000

---

## What Happens When You Run `npm run dev`

Both services start automatically:

```
[0] Server running on port 5000 (backend)
[1] ready - started server on 0.0.0.0:3000 (frontend)
```

- `[0]` = backend messages
- `[1]` = frontend messages

## All Available Commands

### Start Services
```bash
npm run dev              # Both with hot-reload
npm run dev:backend     # Backend only
npm run dev:frontend    # Frontend only
npm start               # Production mode
```

### Run Tests
```bash
npm test                          # All tests
npm run test:backend              # Backend only
npm run test:backend:integration  # Integration tests
npm run test:backend:unit         # Unit tests
npm run test:frontend             # Frontend only
```

### Installation
```bash
npm run install:all     # Install all dependencies
```

---

## Installation Details

### Option A: Quick Install (Recommended)
```bash
# From project root
npm run install:all
```

### Option B: Manual Install
```bash
# From project root
npm install

# From backend
cd backend && npm install

# From frontend
cd ../frontend && npm install
```

---

## File Structure

The root `package.json` has been created with these scripts:

```
package.json (ROOT - NEW)
├── scripts for starting both services
├── scripts for testing both services
├── scripts for installing all dependencies
└── concurrently as devDependency
```

Individual service package.json files remain unchanged:
- `backend/package.json` (unchanged)
- `frontend/package.json` (unchanged)

---

## Key Features

✅ **One Terminal** - Run both services in one window
✅ **Hot Reload** - Both services auto-reload on file changes
✅ **Easy Stop** - Press Ctrl+C once to stop all services
✅ **Clear Output** - Prefixed logs show which service each message is from
✅ **Separate Mode** - Can still run services individually if needed
✅ **Production Ready** - Works in development and production modes

---

## Stopping Services

Simply press: **Ctrl+C**

This stops both backend and frontend at once.

---

## Using Individual Services

If you need to run services separately:

```bash
# Just backend
npm run dev:backend
# or
cd backend && npm run dev

# Just frontend
npm run dev:frontend
# or
cd frontend && npm run dev
```

---

## Next Steps

1. Install concurrently: `npm install --save-dev concurrently`
2. Install all dependencies: `npm run install:all`
3. Start both services: `npm run dev`
4. Open browser: http://localhost:3000

---

## Troubleshooting

**"npm: command not found"?**
- Make sure Node.js is installed
- Try `node --version`

**"concurrently: command not found"?**
```bash
npm install --save-dev concurrently
npm run dev
```

**Port 5000 or 3000 already in use?**
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Services don't start?**
```bash
# Clear everything and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
npm run dev
```

---

## Documentation References

- **RUN_BOTH.md** - Quick reference card
- **CONCURRENTLY.md** - Detailed concurrently guide
- **QUICK_REFERENCE.md** - All commands
- **README_COMPREHENSIVE.md** - Complete guide

---

**Status**: ✅ Ready to use
**Last Updated**: December 8, 2025
