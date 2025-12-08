# Configuration Reference

## Environment Variables

### Backend Configuration (backend/.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port for Express.js |
| `CLIENT_URL` | `http://localhost:3000` | Frontend URL for CORS configuration |
| `NODE_ENV` | `development` | Environment (development/production) |

### Frontend Configuration (frontend/.env.local)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API URL |

---

## Development vs Production

### Development Setup
```bash
# Backend
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production Setup
```bash
# Backend
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - CLIENT_URL=http://localhost:3000

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend
```

### Dockerfile Configuration

**Backend (backend/Dockerfile):**
- Base: Node 18 Alpine
- Exposed Port: 5000
- Command: `npm start`

**Frontend (frontend/Dockerfile):**
- Base: Node 18 Alpine
- Exposed Port: 3000
- Build: `npm run build`
- Command: `npm start`

---

## NPM Scripts

### Backend Scripts
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Frontend Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Dependencies Configuration

### Backend Dependencies
```json
{
  "express": "^4.18.2",        // Web framework
  "socket.io": "^4.5.4",       // Real-time WebSocket
  "cors": "^2.8.5",            // Cross-origin requests
  "uuid": "^9.0.0",            // Session ID generation
  "node-cache": "^5.1.2"       // In-memory caching
}
```

### Backend Dev Dependencies
```json
{
  "nodemon": "^3.0.1"          // Auto-reload server
}
```

### Frontend Dependencies
```json
{
  "next": "^14.0.0",           // React framework
  "react": "^18.2.0",          // UI library
  "react-dom": "^18.2.0",      // DOM rendering
  "socket.io-client": "^4.5.4",// WebSocket client
  "highlight.js": "^11.8.0",   // Syntax highlighting
  "axios": "^1.4.0"            // HTTP client
}
```

---

## Next.js Configuration (frontend/next.config.js)

```javascript
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig
```

---

## WebSocket Configuration

### Socket.io Server Settings
```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
```

### Socket.io Client Connection
```javascript
const socket = io(process.env.NEXT_PUBLIC_API_URL);
```

---

## Cache Configuration

### Node-Cache Settings
```javascript
const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours
```

**TTL (Time To Live):**
- Session data expires after 24 hours
- Automatic cleanup of expired entries
- Memory efficient for long-running servers

---

## CORS Configuration

### Allowed Origins
- Development: `http://localhost:3000`
- Production: Your frontend domain

### Allowed Methods
- GET
- POST

### Allowed Headers
- Content-Type

---

## Port Configuration

| Service | Port | Environment |
|---------|------|-------------|
| Backend | 5000 | `PORT` |
| Frontend | 3000 | Default Next.js |
| Piston API | External | (Code execution) |

---

## File Structure Configuration

### Frontend Pages
```
pages/
├── _app.js          # App wrapper (no route)
├── _document.js     # HTML document (no route)
├── index.js         # / route
└── interview/
    └── [sessionId].js   # /interview/:sessionId route
```

### Frontend Components
```
components/
├── CodeEditor.js     # Code editor with syntax highlight
├── OutputPanel.js    # Code execution output
└── Participants.js   # Active participants list
```

### Frontend Styles
```
styles/
├── globals.css       # Global styles
├── Index.module.css  # Home page styles
├── Interview.module.css  # Interview room styles
├── CodeEditor.module.css # Editor styles
├── OutputPanel.module.css # Output styles
└── Participants.module.css # Participants styles
```

---

## Code Execution Configuration

### Piston API
- External API: https://emkc.org/api/v2/piston/execute
- Sandbox execution (safe)
- Supports 9+ languages
- Response format: JSON with output/error

### Language Support
```javascript
const languages = [
  'javascript',
  'python',
  'java',
  'cpp',
  'csharp',
  'ruby',
  'go',
  'rust',
  'php',
];
```

---

## Session Configuration

### Session TTL
- Duration: 24 hours
- Auto-cleanup: Enabled
- Storage: In-memory

### Session Data
```javascript
{
  id: "UUID",
  code: "// code content",
  language: "javascript",
  title: "Coding Interview",
  createdAt: "ISO-8601 timestamp",
  participants: ["Alice", "Bob"]
}
```

---

## CSS Module Configuration

### Dark Theme Colors
```css
--bg-dark: #1e1e1e;
--bg-secondary: #252526;
--text-primary: #d4d4d4;
--text-secondary: #858585;
--accent: #61dafb;
--accent-dark: #0e639c;
--border: #3e3e42;
```

---

## Security Configuration

### Helmet Headers (Optional)
Add to backend for production:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting (Optional)
Add for production:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

---

## Monitoring Configuration

### Logging
Add Winston to backend:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## Build Configuration

### Backend Build
```bash
npm install
npm start
```

### Frontend Build
```bash
npm install
npm run build
npm start
```

---

## Deployment Configuration

### Environment Variables by Platform

**Vercel (Frontend):**
```
NEXT_PUBLIC_API_URL = https://api.yourdomain.com
```

**Heroku (Backend):**
```
CLIENT_URL = https://app.yourdomain.com
NODE_ENV = production
```

**Railway:**
```
Backend:
  PORT = 5000
  CLIENT_URL = https://frontend-domain.railway.app

Frontend:
  NEXT_PUBLIC_API_URL = https://backend-domain.railway.app
```

---

## Troubleshooting Configuration

### Port Already in Use
```bash
# Windows: Find and kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Issues
- Check `CLIENT_URL` matches frontend URL
- Restart backend after env changes

### WebSocket Connection Fails
- Verify backend running on correct port
- Check `NEXT_PUBLIC_API_URL` is correct
- Look for firewall blocking port

---

## Performance Tuning

### Backend Optimization
```javascript
// Connection pooling (if using Redis)
const redis = require('redis');
const client = redis.createClient({ maxRetriesPerRequest: null });

// Increase file descriptor limit
ulimit -n 65536
```

### Frontend Optimization
```javascript
// Code splitting in next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
}
```

---

## Backup Configuration

### Session Backup (Optional)
```bash
# Backup cache periodically
cp /var/cache/session.json /backup/session-$(date +%s).json
```

---

## Version Information

- Node.js: 18+
- npm: 8+
- Next.js: 14.0.0+
- Express: 4.18.2+
- React: 18.2.0+

---

## Additional Resources

- Express.js: https://expressjs.com/
- Next.js: https://nextjs.org/
- Socket.io: https://socket.io/
- Highlight.js: https://highlightjs.org/
- Piston API: https://piston.readthedocs.io/
