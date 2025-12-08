# 🎯 Run Both Services - Quick Reference

## One Simple Command

```bash
npm run dev
```

That's it! 🎉

---

## What It Does

Runs **both** backend and frontend simultaneously:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`

All output appears in **one terminal window**.

---

## First Time Setup

```bash
# Step 1: Install all dependencies
npm run install:all

# Step 2: Start both services
npm run dev

# Step 3: Open browser to
http://localhost:3000
```

---

## All Commands at a Glance

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Run backend + frontend (with hot-reload) |
| `npm run dev:backend` | Run backend only |
| `npm run dev:frontend` | Run frontend only |
| `npm start` | Run backend + frontend (production) |
| `npm test` | Run all tests (backend + frontend) |
| `npm run test:backend` | Run backend tests only |
| `npm run test:frontend` | Run frontend tests only |
| `npm run install:all` | Install dependencies for all packages |

---

## Before & After

### ❌ Before (Old Way)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (in new window)
cd frontend && npm run dev
```
⚠️ Requires managing 2 terminal windows

### ✅ After (New Way)
```bash
npm run dev
```
✨ Everything in one terminal!

---

## Stopping Services

Press **Ctrl+C** once to stop everything.

No need to stop individual terminals anymore!

---

## Troubleshooting

**Services not starting?**
```bash
npm run install:all
npm run dev
```

**Port already in use?**
```bash
# Kill port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## How It Works

Uses `concurrently` npm package to run multiple commands in parallel.

See **CONCURRENTLY.md** for details.

---

**Ready to start?** Run: `npm run dev`
