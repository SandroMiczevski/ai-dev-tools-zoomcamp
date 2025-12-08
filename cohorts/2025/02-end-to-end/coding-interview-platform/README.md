# Online Coding Interview Platform

A real-time collaborative coding interview platform built with Next.js frontend and Express.js backend. Features syntax highlighting, code execution, and real-time collaboration for multiple participants.

## 🎯 Features

- ✅ **Create Shareable Links**: Generate unique interview session links
- ✅ **Real-time Collaboration**: Multiple users can edit code simultaneously
- ✅ **Syntax Highlighting**: Support for 9+ programming languages
- ✅ **Code Execution**: Execute code safely in the browser using Piston API
- ✅ **Live Updates**: All changes sync instantly across connected users
- ✅ **Participant Tracking**: See who's currently in the session
- ✅ **Output Display**: View code execution results in real-time

## 📋 Supported Languages

- JavaScript
- Python
- Java
- C++
- C#
- Ruby
- Go
- Rust
- PHP

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The frontend will run on `http://localhost:3000`

### Access the Application

1. Open `http://localhost:3000` in your browser
2. Click "Start Interview Session" to create a new session
3. Share the generated link with candidates
4. Start collaborating!

## 📁 Project Structure

```
coding-interview-platform/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment variables template
│   └── README.md          # Backend documentation
├── frontend/
│   ├── pages/
│   │   ├── index.js       # Home page
│   │   ├── _app.js        # Next.js app wrapper
│   │   ├── _document.js   # HTML document wrapper
│   │   └── interview/
│   │       └── [sessionId].js  # Interview room
│   ├── components/
│   │   ├── CodeEditor.js  # Code editor component
│   │   ├── OutputPanel.js # Output display
│   │   └── Participants.js # Participants list
│   ├── styles/            # CSS modules
│   ├── package.json       # Frontend dependencies
│   ├── next.config.js     # Next.js configuration
│   ├── .env.example       # Environment variables template
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## 🔧 API Endpoints

### REST API

- `POST /api/sessions` - Create a new coding session
- `GET /api/sessions/:sessionId` - Get session details
- `GET /health` - Health check

### WebSocket Events

**Client → Server:**
- `join_session` - Join a coding session
- `code_update` - Update code content
- `language_change` - Change programming language
- `cursor_update` - Update user cursor position

**Server → Client:**
- `sync_code` - Sync current code state
- `code_changed` - Code update notification
- `language_changed` - Language change notification
- `user_joined` - User joined notification
- `user_left` - User left notification
- `participants_list` - List of participants

## 🎨 Architecture

### Frontend Architecture
- **Next.js**: React framework for production
- **Socket.io Client**: Real-time communication
- **Highlight.js**: Syntax highlighting
- **CSS Modules**: Component-scoped styling

### Backend Architecture
- **Express.js**: Web framework
- **Socket.io**: WebSocket communication
- **Node-Cache**: Session storage (24-hour TTL)
- **CORS**: Cross-origin requests support

## 🔐 Code Execution

Code execution is handled by the [Piston API](https://piston.readthedocs.io/), which runs code in isolated containers for security. The API supports multiple programming languages and is perfect for educational platforms.

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🌐 Deployment

### Docker Deployment

Build and run with Docker:

```bash
# Build backend
cd backend
docker build -t coding-interview-backend .

# Build frontend
cd frontend
docker build -t coding-interview-frontend .

# Run backend
docker run -p 5000:5000 coding-interview-backend

# Run frontend
docker run -p 3000:3000 coding-interview-frontend
```

### Cloud Deployment

The application can be deployed to:
- **Vercel** (Frontend) - https://vercel.com
- **Heroku** (Backend) - https://www.heroku.com
- **Railway** (Both) - https://railway.app
- **AWS** (Both) - https://aws.amazon.com

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Learning Resources

This platform demonstrates:
- Real-time collaboration with WebSockets
- Full-stack JavaScript development
- API design and implementation
- Frontend architecture with React
- Real-time synchronization patterns

## 💡 Future Enhancements

- [ ] Audio/Video chat integration
- [ ] Whiteboard for drawing
- [ ] Code review comments
- [ ] Recording sessions
- [ ] User authentication
- [ ] Session history
- [ ] Code snippets library
- [ ] Feedback system

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for coding interviews**
