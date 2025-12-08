# 💻 Coding Interview Platform

A real-time collaborative coding interview platform where multiple participants can write, execute, and debug code together.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## 🚀 Features

- **Real-time Code Collaboration**: Multiple users can code simultaneously with instant synchronization
- **Live Code Execution**: Execute code in 10+ programming languages using Piston API
- **Syntax Highlighting**: Beautiful syntax highlighting for all supported languages
- **Share Sessions**: Generate shareable links to invite others to interview sessions
- **Participant Management**: Real-time list of active participants with automatic join/leave notifications
- **Cursor Position Tracking**: See where other participants are typing
- **Language Support**: JavaScript, Python, Java, C++, C#, Ruby, Go, Rust, PHP, and more
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework with server-side rendering
- **React** - UI component library
- **Socket.io Client** - Real-time WebSocket communication
- **Highlight.js** - Syntax highlighting
- **Axios** - HTTP client
- **CSS Modules** - Component-scoped styling

### Backend
- **Express.js** - HTTP server framework
- **Socket.io** - Real-time bidirectional communication
- **Node-Cache** - In-memory session storage
- **UUID** - Unique session ID generation
- **CORS** - Cross-Origin Resource Sharing

### Testing
- **Jest** - Testing framework
- **@testing-library/react** - React component testing
- **socket.io-client** - WebSocket client for testing

### Deployment
- **Docker** - Container orchestration
- **Docker Compose** - Multi-container deployment

## 📦 Prerequisites

### System Requirements
- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **Docker** (optional): For containerized deployment
- **Git**: For cloning the repository

### Supported Languages for Code Execution
- JavaScript (Node.js)
- Python 3
- Java
- C++
- C#
- Ruby
- Go
- Rust
- PHP
- Kotlin
- Swift

## 🏃 Quick Start

### Option 1: Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd coding-interview-platform
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

3. **Start the application**
```bash
# Terminal 1: Start backend (port 5000)
cd backend
npm run dev

# Terminal 2: Start frontend (port 3000)
cd frontend
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Option 2: Docker Compose (All-in-One)

1. **Clone the repository**
```bash
git clone <repository-url>
cd coding-interview-platform
```

2. **Start with Docker Compose**
```bash
docker-compose up
```

3. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
coding-interview-platform/
├── backend/
│   ├── __tests__/
│   │   ├── integration.test.js      # Integration tests (WebSocket, REST API)
│   │   ├── unit.test.js             # Unit tests (Business logic)
│   │   └── jest.config.js           # Jest configuration
│   ├── server.js                    # Express server & Socket.io setup
│   ├── package.json                 # Backend dependencies
│   ├── jest.config.js               # Jest test configuration
│   └── Dockerfile                   # Docker image for backend
│
├── frontend/
│   ├── __tests__/
│   │   └── components.test.js       # Component tests
│   ├── components/
│   │   ├── CodeEditor.js            # Code editor with syntax highlighting
│   │   ├── OutputPanel.js           # Execution output display
│   │   └── Participants.js          # Active participants list
│   ├── pages/
│   │   ├── _app.js                  # Next.js app wrapper
│   │   ├── _document.js             # HTML document structure
│   │   ├── index.js                 # Home page (create/join session)
│   │   └── interview/
│   │       └── [sessionId].js       # Dynamic interview room page
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   ├── Index.module.css         # Home page styles
│   │   ├── Interview.module.css     # Interview room styles
│   │   ├── CodeEditor.module.css    # Editor styles
│   │   ├── OutputPanel.module.css   # Output panel styles
│   │   └── Participants.module.css  # Participants list styles
│   ├── next.config.js               # Next.js configuration
│   ├── package.json                 # Frontend dependencies
│   └── Dockerfile                   # Docker image for frontend
│
├── docker-compose.yml               # Multi-container setup
├── setup.js                         # Setup utilities
├── setup.bat                        # Windows setup script
├── README.md                        # This file
├── QUICKSTART.md                    # Quick start guide
├── API.md                           # API documentation
├── DEPLOYMENT.md                    # Deployment guide
├── CONFIG.md                        # Configuration reference
├── IMPLEMENTATION.md                # Implementation details
└── INDEX.md                         # Index of all documentation
```

## 🎯 Running the Application

### Development Mode

#### Both Services (Using Concurrently)
```bash
npm run dev
```
Runs both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) in one terminal.

#### Backend Only
```bash
npm run dev:backend
# or
cd backend && npm run dev
```
Runs on `http://localhost:5000`

#### Frontend Only
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```
Runs on `http://localhost:3000`

#### Both Services (Separate Terminals)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Production Mode

#### Backend
```bash
cd backend
npm run start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

### Using Docker

#### Single Service
```bash
# Build and run backend
docker build -t interview-backend ./backend
docker run -p 5000:5000 interview-backend

# Build and run frontend
docker build -t interview-frontend ./frontend
docker run -p 3000:3000 interview-frontend
```

#### All Services with Docker Compose
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Stop specific service
docker-compose down backend
```

## 🧪 Testing

### Backend Tests

#### Run All Tests
```bash
cd backend
npm test
```

#### Run Integration Tests Only
Integration tests verify the interaction between client and server, including WebSocket events, REST API endpoints, and real-time synchronization.

```bash
cd backend
npm run test:integration
```

**What Integration Tests Cover:**
- REST API endpoints (session creation, retrieval)
- WebSocket session joining and authentication
- Real-time code synchronization across multiple clients
- Language change broadcasting
- Cursor position tracking
- User join/leave notifications
- Connection management and cleanup
- Error handling and edge cases

#### Run Unit Tests Only
Unit tests verify individual business logic components and functions.

```bash
cd backend
npm run test:unit
```

**What Unit Tests Cover:**
- Session management (create, retrieve, delete)
- Participant management (add, remove, list)
- Code management (update, retrieve, history)
- Language support validation
- Room management
- Data validation and sanitization
- Error scenarios and edge cases

#### Run Tests with Coverage Report
```bash
cd backend
npm run test:coverage
```

Generates coverage report in `backend/coverage/` directory.

#### Watch Mode (Auto-rerun on Changes)
```bash
cd backend
npm run test:watch
```

#### Run Specific Test File
```bash
cd backend
npm test -- __tests__/integration.test.js
npm test -- __tests__/unit.test.js
```

#### Run Tests Matching Pattern
```bash
cd backend
npm test -- --testNamePattern="code synchronization"
```

### Frontend Tests

#### Run Component Tests
```bash
cd frontend
npm test
```

Tests React components including:
- CodeEditor (syntax highlighting, code changes, language selection, execution)
- OutputPanel (output display, loading states, error messages)
- Participants (participant list, online status, count)
- Interview page (name input, share link, welcome message)
- Home page (title, features, create button)
- User interactions (form submission, keyboard events)
- Responsive design

### Full Test Suite

Run all backend and frontend tests:
```bash
cd backend && npm test && cd ../frontend && npm test
```

### Test Configuration

#### Backend (jest.config.js)
- Environment: Node.js
- Test timeout: 10 seconds
- Test patterns: `**/__tests__/**/*.test.js`
- Auto-force exit: Closes server after tests

#### Frontend (next.config.js with Jest)
- Environment: jsdom (browser environment)
- Test utilities: @testing-library/react
- Coverage collection: Enabled

## 📡 API Documentation

### REST API Endpoints

#### Create Interview Session
```http
POST /api/sessions
Content-Type: application/json

Response: 201 Created
{
  "sessionId": "uuid-here",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Get Session Details
```http
GET /api/sessions/:sessionId

Response: 200 OK
{
  "sessionId": "uuid-here",
  "participants": [...],
  "code": "console.log('hello');",
  "language": "javascript",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Health Check
```http
GET /api/health

Response: 200 OK
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### WebSocket Events

#### Client → Server Events

**join_session**
```javascript
socket.emit('join_session', {
  sessionId: 'uuid',
  participantName: 'Alice'
});
```

**code_update**
```javascript
socket.emit('code_update', {
  sessionId: 'uuid',
  code: 'new code here'
});
```

**language_change**
```javascript
socket.emit('language_change', {
  sessionId: 'uuid',
  language: 'python'
});
```

**cursor_update**
```javascript
socket.emit('cursor_update', {
  sessionId: 'uuid',
  participantName: 'Alice',
  line: 5,
  column: 10
});
```

#### Server → Client Events

**sync_code**
```javascript
socket.on('sync_code', {
  code: 'current code',
  language: 'javascript',
  participants: ['Alice', 'Bob']
});
```

**code_changed**
```javascript
socket.on('code_changed', {
  participantName: 'Alice',
  code: 'updated code'
});
```

**language_changed**
```javascript
socket.on('language_changed', {
  language: 'python'
});
```

**participants_list**
```javascript
socket.on('participants_list', {
  participants: ['Alice', 'Bob', 'Charlie']
});
```

**user_joined**
```javascript
socket.on('user_joined', {
  participantName: 'David'
});
```

**user_left**
```javascript
socket.on('user_left', {
  participantName: 'David'
});
```

**cursor_changed**
```javascript
socket.on('cursor_changed', {
  participantName: 'Alice',
  line: 5,
  column: 10
});
```

## 🚀 Deployment

### Deploy to Cloud

#### AWS (EC2)
1. Create EC2 instance with Node.js
2. Clone repository
3. Install dependencies
4. Run `npm start` or use PM2 for process management

#### Heroku
```bash
git push heroku main
```

#### Docker Hub
```bash
docker build -t username/interview-platform ./
docker push username/interview-platform
```

#### Kubernetes
See `DEPLOYMENT.md` for detailed Kubernetes configuration.

### Environment Variables

Create `.env` files for backend and frontend:

**Backend (.env)**
```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
```

## ⚙️ Configuration

### Backend Configuration

Modify `backend/server.js`:
- Port: Line 1 (const PORT)
- CORS origins: Line 8 (cors options)
- Session storage: Node-Cache settings
- WebSocket namespace: `/socket.io`

### Frontend Configuration

Modify `frontend/next.config.js`:
- API endpoint: Update NEXT_PUBLIC_API_URL
- Socket endpoint: Update NEXT_PUBLIC_SOCKET_URL
- Language settings: Update supported languages in CodeEditor.js

See `CONFIG.md` for detailed configuration options.

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### WebSocket Connection Failed
- Check backend is running on port 5000
- Check CORS configuration
- Check firewall settings
- Try clearing browser cache

#### Code Execution Failing
- Verify Piston API is accessible
- Check syntax of submitted code
- Verify language is supported
- Check timeout settings (default: 10 seconds)

#### Hot Reload Not Working
- Restart development server
- Check file watcher limits on Linux: `sysctl fs.inotify.max_user_watches`
- Clear `.next` and `node_modules` cache

### Debug Logging

#### Backend
Enable debug logs in server.js:
```javascript
const debug = require('debug')('interview:*');
```

Run with debug:
```bash
DEBUG=interview:* npm run dev
```

#### Frontend
Browser DevTools Console and Network tab

### Test Debugging

#### Run single test
```bash
cd backend
npm test -- __tests__/integration.test.js --testNamePattern="specific test name"
```

#### Verbose output
```bash
cd backend
npm test -- --verbose
```

#### Debug test execution
```bash
cd backend
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📚 Additional Resources

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [API.md](API.md) - Complete API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [CONFIG.md](CONFIG.md) - Configuration reference
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Implementation details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Last Updated**: 2024
**Version**: 1.0.0
