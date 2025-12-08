# Architecture & Deployment Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
├─────────────────────────────────────────────────────────────┤
│                   Browser (Multiple)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (Port 3000)                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • CodeEditor Component                              │   │
│  │  • OutputPanel Component                             │   │
│  │  • Participants Component                            │   │
│  │  • Pages: Home, Interview Room                       │   │
│  └──────────────────────────────────────────────────────┘   │
│           ▲                                    ▲              │
│           │ HTTP/S, WebSocket                 │ HTTP/S      │
│           │                                    │              │
└───────────┼────────────────────────────────────┼──────────────┘
            │                                    │
            └────────────────────┬───────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  WebSocket Gateway       │
                    │  (Socket.io)             │
                    └────────────┬─────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                   │
        ▼                                                   ▼
    ┌─────────────────────────────────────────┐       ┌──────────────┐
    │  Express.js Backend (Port 5000)        │       │  Piston API  │
    ├─────────────────────────────────────────┤       │  (Code       │
    │  • REST API Endpoints                   │       │   Execution) │
    │  • WebSocket Event Handlers             │       └──────────────┘
    │  • Session Management                   │
    │  • Real-time Sync                       │
    └─────────────────────────────────────────┘
            │
            ▼
    ┌─────────────────────────────────────────┐
    │  In-Memory Cache (Node-Cache)           │
    │  • Session Data (TTL: 24 hours)         │
    │  • Active Room Info                     │
    │  • Code & Language State                │
    └─────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components
```
App (_app.js)
├── Home (index.js)
│   └── Create Session Flow
├── Interview Room ([sessionId].js)
│   ├── CodeEditor
│   │   ├── Textarea (overlay)
│   │   ├── Highlight.js (syntax)
│   │   ├── Line Numbers
│   │   └── Language Selector
│   ├── OutputPanel
│   │   ├── Execution State
│   │   ├── Output Display
│   │   └── Error Display
│   └── Participants
│       ├── Participant List
│       ├── Avatar
│       ├── Status
│       └── Count
```

### Backend Structure
```
server.js
├── Middleware Setup
│   ├── Express
│   ├── CORS
│   └── JSON Parser
├── REST Endpoints
│   ├── POST /api/sessions
│   ├── GET /api/sessions/:sessionId
│   └── GET /health
├── WebSocket Handlers
│   ├── join_session
│   ├── code_update
│   ├── language_change
│   ├── cursor_update
│   └── disconnect
└── Data Storage
    ├── Cache (sessions)
    └── Rooms Map (real-time state)
```

## Data Flow Diagram

### Session Creation Flow
```
User                Frontend           Backend           Cache
  │                    │                 │                 │
  ├─ Click "Start" ───>│                 │                 │
  │                    ├─ POST /sessions→│                 │
  │                    │                 ├─ Generate UUID ─│
  │                    │                 │<─ Store Session─│
  │                    │<─ sessionId ────│                 │
  │                    │                 │                 │
  │<─ Redirect ────────│                 │                 │
  │   /interview/id    │                 │                 │
```

### Real-time Collaboration Flow
```
User A              WebSocket          Backend         Cache    User B
  │                    │                  │              │        │
  ├─ Type Code ───────>│ code_update      │              │        │
  │                    ├────────────────>│──────────────>│        │
  │                    │                  │ Broadcast    │        │
  │                    │<──────────────────────────────────────────┤
  │                    │      code_changed               │        │
  │                    │                                 │    ┌──>│
  │                    │<────────────────────────────────┤    │   │
  │                    │                                      │   │
```

## Deployment Options

### Option 1: Local Development
**Recommended for testing and development**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Access:** http://localhost:3000

---

### Option 2: Docker Compose
**Recommended for local testing with containers**

```bash
docker-compose up
```

**Services:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

**Dockerfile Locations:**
- `backend/Dockerfile` - Node 18 Alpine, production build
- `frontend/Dockerfile` - Node 18 Alpine, Next.js build

---

### Option 3: Vercel + Heroku

#### Deploy Frontend to Vercel

1. Push code to GitHub
2. Connect repository at https://vercel.com
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
   ```
4. Deploy

#### Deploy Backend to Heroku

1. Create `Procfile`:
   ```
   web: npm start
   ```

2. Deploy:
   ```bash
   heroku login
   git push heroku main
   ```

3. Set environment variables:
   ```bash
   heroku config:set CLIENT_URL=https://your-vercel-app.vercel.app
   ```

---

### Option 4: Railway (Recommended)

Railway supports full-stack deployment with connected services.

1. **Connect Repository**
   - Go to railway.app
   - Connect GitHub repository

2. **Create Services**
   - Backend service (Node.js)
   - Frontend service (Next.js)

3. **Set Environment Variables**
   - Backend: `CLIENT_URL` and `PORT`
   - Frontend: `NEXT_PUBLIC_API_URL`

4. **Deploy**
   - Railway auto-deploys on push

---

### Option 5: AWS Deployment

#### Using EC2 + Elastic Beanstalk

**Backend:**
```bash
cd backend
eb init
eb create production
eb deploy
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy to S3 + CloudFront
```

#### Using ECS (Fargate)

```bash
# Build and push images
docker build -t backend:latest ./backend
docker push YOUR_ECR_URL/backend:latest

docker build -t frontend:latest ./frontend
docker push YOUR_ECR_URL/frontend:latest

# Create ECS tasks and services
# Configure Application Load Balancer
```

---

### Option 6: Azure

#### App Service + Static Web App

**Backend (App Service):**
```bash
az appservice plan create --name coding-interview-plan
az webapp create --resource-group mygroup --plan coding-interview-plan
az webapp deployment source config-zip
```

**Frontend (Static Web App):**
```bash
az staticwebapp create --name coding-interview-frontend
npm run build
az staticwebapp deploy
```

---

## Environment Variables

### Production Settings

**Backend (.env):**
```env
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Frontend (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## Performance Optimization

### Frontend
- Next.js optimized builds
- Code splitting per page
- CSS modules (scoped styles)
- Image optimization (if added)
- API route caching

### Backend
- Session caching (24-hour TTL)
- WebSocket connection pooling
- Efficient event broadcasting
- Memory-efficient room management

### Network
- Minified and compressed assets
- WebSocket for real-time updates
- CDN for static assets (optional)

---

## Scaling Considerations

### Current Limitations
- Single server instance
- In-memory session storage
- No persistence layer

### For Production Scaling

1. **Add Redis**
   ```bash
   npm install redis socket.io-redis
   ```
   - Persistent session storage
   - Cross-server socket communication

2. **Load Balancer**
   - Distribute traffic across multiple backend instances
   - Sticky sessions for WebSocket

3. **Database**
   - PostgreSQL for session history
   - User authentication
   - Analytics

4. **Message Queue**
   - RabbitMQ/Redis for async tasks
   - Background job processing

---

## Monitoring & Logging

### Recommended Tools

1. **Application Monitoring**
   - New Relic
   - Datadog
   - Azure Monitor

2. **Error Tracking**
   - Sentry
   - Rollbar

3. **Logging**
   - Winston (Node.js)
   - Vercel Analytics (Frontend)

### Log Setup Example

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

logger.info('Session created', { sessionId });
```

---

## Security Best Practices

### Current Implementation
- CORS enabled for frontend domain
- UUID session IDs (unpredictable)
- 24-hour session expiration
- Code executed in sandboxed Piston API

### Production Enhancements

1. **Add Authentication**
   ```javascript
   npm install jsonwebtoken bcryptjs
   ```

2. **Rate Limiting**
   ```javascript
   npm install express-rate-limit
   ```

3. **Input Validation**
   ```javascript
   npm install joi
   ```

4. **HTTPS/TLS**
   - Required for production
   - Use Let's Encrypt (free)

5. **Helmet.js**
   ```javascript
   npm install helmet
   app.use(helmet());
   ```

---

## Cost Estimation

### Development (Free Tier)
- Vercel: Free
- Heroku: Free (limited)
- Railway: $5-10/month minimal

### Small Production (< 100 users)
- Vercel: $20/month
- Railway: $50-100/month
- AWS: $50-150/month

### Large Production (> 1000 users)
- Multi-region: $500+/month
- Database: $100-500/month
- CDN: $50-200/month

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] Secrets not in code
- [ ] Build passes without errors
- [ ] Tests passing (if added)
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Monitor alerts set up

---

## Rollback Procedure

### Vercel
```
Click "Deployments" → Find previous deployment → Click "Redeploy"
```

### Heroku
```bash
heroku releases
heroku rollback v10
```

### Docker
```bash
docker-compose down
docker-compose up -d backend:v1 frontend:v1
```

---

## Support & Resources

- Documentation: See README.md and API.md
- Issues: Check GitHub issues
- Deployment: Use railway.app for simplest setup
- Code Execution: Piston API documentation
- WebSocket: Socket.io documentation
