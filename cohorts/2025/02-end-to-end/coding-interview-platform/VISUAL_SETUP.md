# 🎯 Visual Setup Guide - Concurrently

## The Old Way ❌

```
┌─────────────────────┐         ┌─────────────────────┐
│  Terminal 1         │         │  Terminal 2         │
│  cd backend         │         │  cd frontend        │
│  npm run dev        │         │  npm run dev        │
└─────────────────────┘         └─────────────────────┘
```

Multiple terminal windows = Hard to manage 😫

---

## The New Way ✅

```
┌──────────────────────────────────────┐
│  Terminal                            │
│  npm run dev                         │
│                                      │
│  [0] Backend on :5000               │
│  [1] Frontend on :3000              │
│                                      │
│  Ctrl+C stops BOTH                  │
└──────────────────────────────────────┘
```

Single terminal window = Clean and simple! 😎

---

## Setup Steps (Visual)

### Step 1️⃣ Install Concurrently
```bash
npm install --save-dev concurrently
```
✅ Downloads concurrently package

### Step 2️⃣ Install All Dependencies
```bash
npm run install:all
```
✅ Installs dependencies for backend + frontend

### Step 3️⃣ Run Both Services
```bash
npm run dev
```
✅ Both backend and frontend start together

### Step 4️⃣ Open Browser
```
http://localhost:3000
```
✅ Ready to use!

---

## Command Overview

```
┌─────────────────────────────────────────────────────┐
│ npm run dev                                         │
│ Run backend AND frontend with hot-reload            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ npm run dev:backend                                 │
│ Run ONLY backend                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ npm run dev:frontend                                │
│ Run ONLY frontend                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ npm test                                            │
│ Run ALL tests (backend + frontend)                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ npm run test:backend                                │
│ Run backend tests only                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ npm run install:all                                 │
│ Install all dependencies                            │
└─────────────────────────────────────────────────────┘
```

---

## What's Running

```
┌──────────────────────────────────────────┐
│         http://localhost:3000            │
│         (Frontend - Next.js)             │
│  ┌────────────────────────────────────┐  │
│  │  Interview Room                    │  │
│  │  Code Editor  │  Participants      │  │
│  │  Output Panel │                    │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
           ↕ (WebSocket)
┌──────────────────────────────────────────┐
│         http://localhost:5000            │
│         (Backend - Express.js)           │
│  REST API + WebSocket Server             │
│  - Session Management                    │
│  - Real-time Sync                        │
│  - Code Execution                        │
└──────────────────────────────────────────┘
```

---

## Stopping Services

```
Press Ctrl+C in the terminal

↓

Both backend and frontend stop immediately

✅ No more managing separate terminals!
```

---

## File Structure

```
coding-interview-platform/
│
├── package.json ← NEW (runs both services)
│
├── backend/
│   ├── package.json (unchanged)
│   ├── __tests__/
│   ├── server.js
│   └── ...
│
├── frontend/
│   ├── package.json (unchanged)
│   ├── pages/
│   ├── components/
│   └── ...
│
└── [documentation files...]
```

---

## Quick Decision Tree

```
Do you want to run...?

├─ Both services together?
│  └─ npm run dev ✅
│
├─ Only backend?
│  └─ npm run dev:backend
│
├─ Only frontend?
│  └─ npm run dev:frontend
│
└─ Tests?
   ├─ All tests?
   │  └─ npm test
   │
   ├─ Backend tests?
   │  └─ npm run test:backend
   │
   └─ Frontend tests?
      └─ npm run test:frontend
```

---

## Time Comparison

### Before (Multiple Terminals)
```
⏱️ Open terminal 1
⏱️ cd backend
⏱️ npm run dev
⏱️ Open terminal 2
⏱️ cd frontend
⏱️ npm run dev
⏱️ Switch between terminals to see output
⏱️ Stop terminal 1
⏱️ Stop terminal 2

Total: ~2 minutes setup + annoying management
```

### After (Concurrently)
```
⏱️ npm run dev

Total: ~5 seconds! 🚀
```

---

## Benefits Summary

| Feature | Before | After |
|---------|--------|-------|
| Terminal Windows | 2+ | 1 ✅ |
| Setup Time | 2+ minutes | 5 seconds ✅ |
| Stop Process | Kill 2 processes | 1 Ctrl+C ✅ |
| View Output | Switch between windows | In one place ✅ |
| Manage Processes | Manual | Automatic ✅ |

---

## Common Questions

**Q: Can I still run them separately?**
A: Yes! Use `npm run dev:backend` or `npm run dev:frontend`

**Q: Does hot-reload still work?**
A: Yes! Both services auto-reload on file changes

**Q: How do I stop everything?**
A: Press Ctrl+C once

**Q: What if one service crashes?**
A: You'll see the error in the output. The other service keeps running

**Q: How do I see which output is from which service?**
A: `[0]` prefix = backend, `[1]` prefix = frontend

---

## Ready? 🚀

```bash
# 1. Install concurrently
npm install --save-dev concurrently

# 2. Install dependencies
npm run install:all

# 3. Run both services
npm run dev

# 4. Open browser
# http://localhost:3000
```

**Done!** Both services are running. 🎉

---

For more details, see:
- `RUN_BOTH.md` - Quick reference
- `SETUP_CONCURRENTLY.md` - Installation guide
- `CONCURRENTLY.md` - Detailed guide
