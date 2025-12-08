# 🚀 Quick Reference

## Essential Commands

### Setup
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Development
```bash
# Terminal 1: Backend (port 5000)
cd backend && npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend && npm run dev
```

### Testing - Backend
```bash
# All tests
cd backend && npm test

# Integration tests only (WebSocket, REST API)
cd backend && npm run test:integration

# Unit tests only (Business logic)
cd backend && npm run test:unit

# With coverage report
cd backend && npm run test:coverage

# Watch mode (auto-rerun on changes)
cd backend && npm run test:watch
```

### Testing - Frontend
```bash
# All component tests
cd frontend && npm test

# Watch mode
cd frontend && npm run test:watch

# Coverage report
cd frontend && npm run test:coverage
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build && npm start
```

### Docker
```bash
# All services
docker-compose up

# Specific service
docker-compose up backend
docker-compose up frontend

# Stop all
docker-compose down

# View logs
docker-compose logs -f
```

## Test Count Quick Reference

| Suite | Tests | Coverage |
|-------|-------|----------|
| Integration | 17 | WebSocket, REST API |
| Unit | 37 | Business Logic |
| Components | 40 | React UI |
| **Total** | **94+** | **Backend + Frontend** |

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## File Locations

### Key Test Files
- Backend Integration: `backend/__tests__/integration.test.js`
- Backend Unit: `backend/__tests__/unit.test.js`
- Frontend Components: `frontend/__tests__/components.test.js`

### Configuration
- Backend Jest: `backend/jest.config.js`
- Frontend Jest: `frontend/jest.config.js`
- Docker: `docker-compose.yml`

### Documentation
- Complete Guide: `README_COMPREHENSIVE.md`
- Testing Guide: `TESTING.md`
- API Reference: `API.md`
- This Reference: `QUICK_REFERENCE.md`

## Test What

### Integration Tests Cover
- ✅ REST API endpoints
- ✅ WebSocket real-time sync
- ✅ Multi-user scenarios
- ✅ Connection management
- ✅ Error handling

### Unit Tests Cover
- ✅ Session management
- ✅ Participant management
- ✅ Code management
- ✅ Data validation
- ✅ Edge cases

### Component Tests Cover
- ✅ CodeEditor rendering
- ✅ OutputPanel display
- ✅ Participants list
- ✅ Interview page
- ✅ User interactions

## Common Issues

### Port in use?
```bash
# Find and kill process
lsof -i :5000  # or :3000
kill -9 <PID>
```

### WebSocket not connecting?
- Check backend is running
- Check CORS settings
- Check firewall
- Clear browser cache

### Tests failing?
```bash
# Clear Jest cache
npm test -- --clearCache

# Run single test file
npm test -- __tests__/integration.test.js

# Verbose output
npm test -- --verbose
```

### Dependencies missing?
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Debugging

### Backend Debug
```bash
DEBUG=interview:* npm run dev
```

### Test Debug
```bash
npm test -- --verbose
npm test -- --testNamePattern="specific test"
```

### Browser DevTools
- Open http://localhost:3000
- Press F12
- Check Console and Network tabs

## Documentation Map

```
START HERE
    ↓
README_COMPREHENSIVE.md (setup & running)
    ↓
├─→ TESTING.md (how to test)
├─→ API.md (endpoints & events)
├─→ DEPLOYMENT.md (production)
├─→ CONFIG.md (configuration)
└─→ IMPLEMENTATION.md (architecture)
```

## Performance Targets

- **Backend startup**: < 1 second
- **Frontend build**: < 10 seconds
- **Unit test**: < 100ms each
- **Integration test**: < 500ms each
- **WebSocket latency**: < 50ms

## Technology Versions

- Node.js: v16+
- npm: v7+
- Next.js: 14.0.0
- React: 18.2.0
- Express: 4.18.2
- Socket.io: 4.5.4
- Jest: 29.7.0

---

**For detailed information, see the full documentation files listed above.**
