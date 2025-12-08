# 🚀 START HERE

Welcome to the **Online Coding Interview Platform**!

This is a complete, production-ready web application for conducting real-time collaborative coding interviews.

---

## ⚡ 30-Second Summary

- **Frontend:** Next.js (React)
- **Backend:** Express.js
- **Real-time:** Socket.io WebSockets
- **Languages:** 9+ programming languages supported
- **Status:** ✅ Complete and ready to use

---

## 🎯 What Can You Do?

✅ Create interview sessions with shareable links
✅ Code together in real-time (multiple users)
✅ Get syntax highlighting for 9+ languages
✅ Execute code directly in the browser
✅ See all participants and their status

---

## 📝 3-Step Quick Start

### Step 1: Setup (Choose One)

**Option A - Automated (Recommended):**
```bash
setup.bat          # Windows
# or
node setup.js      # macOS/Linux
```

**Option B - Manual:**
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Run Backend
```bash
cd backend
npm run dev
```
✅ See: "Server running on port 5000"

### Step 3: Run Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
✅ See: "ready started server on port 3000"

---

## 🌐 Open Your Browser

**→ http://localhost:3000**

You should see the home page with "Start Interview Session" button.

---

## 🧪 Test It

1. Click "Start Interview Session"
2. Enter your name
3. You're now in the interview room!
4. Copy the share link
5. Open in another browser/tab
6. Enter a different name
7. **→ Type code in one tab, watch it sync in the other!**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[INDEX.md](INDEX.md)** | Full documentation index |
| **[QUICKSTART.md](QUICKSTART.md)** | Detailed setup guide |
| **[README.md](README.md)** | Project overview |
| **[API.md](API.md)** | API reference |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production deployment |
| **[CONFIG.md](CONFIG.md)** | Configuration reference |

---

## 🎨 Test Features

### 1. Test Real-time Collaboration
- Open in 2 browser tabs
- Type code in one tab
- Watch it appear instantly in the other ✨

### 2. Test Code Execution
- Click language dropdown (top right)
- Select a language (e.g., Python)
- Write code: `print('Hello, World!')`
- Click "Execute" button
- See output below ✅

### 3. Test Syntax Highlighting
- See colors change as you type
- Different colors for keywords, strings, numbers
- Works for all supported languages

### 4. Test Participant List
- See who's online
- Watch it update when users join/leave

---

## 🚀 Deploy to Production

**Easiest:** Use Railway.app
1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables
4. Deploy ✅

See [DEPLOYMENT.md](DEPLOYMENT.md) for other options.

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check port 5000 is free
# Kill process: netstat -ano | findstr :5000
# Then: taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Clear cache
rm -rf .next  # or: rmdir /s .next on Windows
npm install
npm run dev
```

### Can't connect to backend
- Make sure backend is running on port 5000
- Check `.env.local` has correct API URL
- Restart both servers

---

## 📊 Project Structure

```
coding-interview-platform/
├── backend/              Express.js server
├── frontend/             Next.js app
├── [docs]               Documentation files
└── docker-compose.yml   Docker configuration
```

---

## 🎯 Next Steps

**After setup:**

1. **Explore the code**
   - `backend/server.js` - Main backend (well-commented)
   - `frontend/pages/interview/[sessionId].js` - Interview room
   - `frontend/components/` - Reusable components

2. **Read the docs**
   - Start with [README.md](README.md)
   - Then [API.md](API.md) for technical details

3. **Customize it**
   - Change colors in `frontend/styles/`
   - Add more languages
   - Add authentication
   - Add chat feature
   - etc.

4. **Deploy it**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Choose your platform
   - Go live!

---

## 💡 Key Features

| Feature | Status | Location |
|---------|--------|----------|
| Create sessions | ✅ | backend/server.js |
| Share links | ✅ | frontend/pages/index.js |
| Real-time sync | ✅ | WebSocket events |
| Syntax highlight | ✅ | frontend/components/CodeEditor.js |
| Code execution | ✅ | Piston API |
| Participants | ✅ | frontend/components/Participants.js |

---

## 🌍 Supported Languages

```
JavaScript | Python | Java | C++ | C#
Ruby | Go | Rust | PHP
```

(And more can be added - see CONFIG.md)

---

## 🐳 Docker

Run everything in one command:

```bash
docker-compose up
```

Then open: http://localhost:3000

---

## ❓ FAQ

**Q: How long are sessions saved?**
A: 24 hours (then automatically deleted)

**Q: How many people can join?**
A: Unlimited (depends on your server)

**Q: Is code execution safe?**
A: Yes - uses sandboxed Piston API

**Q: Can I use this for interviews?**
A: Yes! That's what it's for!

**Q: Can I deploy it?**
A: Yes! See DEPLOYMENT.md for guides

---

## 📞 Need Help?

1. Check [QUICKSTART.md](QUICKSTART.md) - Most issues covered
2. Check [API.md](API.md) - For API questions
3. Check code comments - Well documented
4. Check browser console (F12) - Error details

---

## 🎉 You're All Set!

Everything is ready to go. Just:

1. Run `setup.bat` (or `node setup.js`)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Open http://localhost:3000
5. **Start interviewing!** 🚀

---

## 📚 Full Documentation

Not sure where to go? Check [INDEX.md](INDEX.md) for complete index of all documentation.

---

**Questions?** Most answers are in the docs. Start with [QUICKSTART.md](QUICKSTART.md).

**Ready?** Let's code! 💻

---

**Built with ❤️ for coding interviews**

*Last updated: December 4, 2024*
