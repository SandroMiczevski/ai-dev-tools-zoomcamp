# Quick Start Guide

## 📦 Installation

### Option 1: Automated Setup (Recommended)

**On Windows:**
```cmd
setup.bat
```

**On macOS/Linux:**
```bash
node setup.js
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

Terminal output should show:
```
Server running on port 5000
```

### Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
```

Terminal output should show:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Access the App
Open your browser and go to: **http://localhost:3000**

---

## 🎯 Using the Platform

### Create a Session
1. Click "🚀 Start Interview Session" button on the home page
2. You'll be redirected to the interview room
3. Enter your name when prompted

### Invite Candidates
1. Click "📋 Copy Share Link" button
2. Paste the link and send it to candidates
3. Candidates join by opening the link and entering their name

### Collaborate
- **Edit Code**: Type directly in the code editor
- **Change Language**: Select language from the dropdown
- **Execute Code**: Click the "Execute" button to run code
- **See Participants**: View active participants in the right panel
- **View Output**: Code execution results appear in the output panel

---

## 🐳 Docker Setup

If you have Docker installed:

```bash
docker-compose up
```

Access the app at **http://localhost:3000**

---

## 📋 Troubleshooting

### Backend won't start
- Make sure port 5000 is not in use
- Check Node.js version: `node --version` (need v16+)
- Try: `npm install` again

### Frontend won't start
- Make sure port 3000 is not in use
- Clear `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Try: `npm install` again

### Can't connect to backend
- Make sure backend is running on port 5000
- Check `.env.local` in frontend has correct API URL
- Restart both servers

### Code execution fails
- Some languages may not be available on Piston API
- Try simple console.log() for JavaScript
- Check browser console for errors (F12)

---

## 🎨 Features Demo

### Supported Languages
```
JavaScript | Python | Java | C++ | C# | Ruby | Go | Rust | PHP
```

### Real-time Collaboration
- All edits sync instantly
- Multiple users can type simultaneously
- Language changes broadcast to all users

### Syntax Highlighting
- Automatic for all supported languages
- Beautiful dark theme
- Line numbers

### Code Execution
- Uses Piston API for safe execution
- See output in real-time
- Error messages displayed

---

## 🔧 Environment Variables

### Backend (backend/.env)
```
PORT=5000                           # Server port
CLIENT_URL=http://localhost:3000   # Frontend URL for CORS
```

### Frontend (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API URL
```

---

## 📚 Useful Commands

```bash
# Backend
npm run dev        # Start development server with auto-reload
npm start          # Start production server

# Frontend
npm run dev        # Start development server with hot-reload
npm run build      # Build for production
npm start          # Start production server
```

---

## 💡 Tips

1. **Multiple Sessions**: Open multiple browser tabs/windows to test collaboration
2. **Share Link**: The share link includes the session ID
3. **Session Duration**: Sessions last 24 hours by default
4. **Code Persistence**: Code is stored in memory while session is active

---

## 🆘 Need Help?

1. Check the README.md for detailed documentation
2. Review component code in frontend/components/
3. Check backend/server.js for API implementation
4. Look at browser console (F12) for JavaScript errors

---

## 🎉 You're Ready!

Start collaborating on code interviews. Happy coding! 🚀
