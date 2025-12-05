const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Cache for storing session data (TTL: 24 hours)
const cache = new NodeCache({ stdTTL: 86400 });

// In-memory storage for active rooms
const rooms = new Map();

// Create a new coding session
app.post('/api/sessions', (req, res) => {
  const sessionId = uuidv4();
  const sessionData = {
    id: sessionId,
    code: '// Start coding here\n',
    language: 'javascript',
    title: 'Coding Interview',
    createdAt: new Date(),
    participants: [],
  };
  
  cache.set(sessionId, sessionData);
  rooms.set(sessionId, {
    users: new Set(),
    code: sessionData.code,
    language: sessionData.language,
  });

  res.json({
    sessionId,
    shareLink: `${process.env.CLIENT_URL || 'http://localhost:3000'}/interview/${sessionId}`,
  });
});

// Get session details
app.get('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const sessionData = cache.get(sessionId);

  if (!sessionData) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(sessionData);
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a coding session
  socket.on('join_session', (data) => {
    const { sessionId, userName } = data;
    const sessionData = cache.get(sessionId);

    if (!sessionData) {
      socket.emit('error', 'Session not found');
      return;
    }

    socket.join(sessionId);
    
    if (!rooms.has(sessionId)) {
      rooms.set(sessionId, {
        users: new Set(),
        code: sessionData.code,
        language: sessionData.language,
      });
    }

    const room = rooms.get(sessionId);
    room.users.add(socket.id);
    
    if (!sessionData.participants.includes(userName)) {
      sessionData.participants.push(userName);
      cache.set(sessionId, sessionData);
    }

    // Send current code state to new user
    socket.emit('sync_code', {
      code: room.code,
      language: room.language,
    });

    // Notify other users
    socket.to(sessionId).emit('user_joined', {
      userName,
      participantCount: room.users.size,
    });

    socket.emit('participants_list', sessionData.participants);
  });

  // Handle code updates
  socket.on('code_update', (data) => {
    const { sessionId, code } = data;
    const room = rooms.get(sessionId);

    if (room) {
      room.code = code;
      // Broadcast to all users in the session
      io.to(sessionId).emit('code_changed', { code });
    }
  });

  // Handle language change
  socket.on('language_change', (data) => {
    const { sessionId, language } = data;
    const room = rooms.get(sessionId);

    if (room) {
      room.language = language;
      io.to(sessionId).emit('language_changed', { language });
    }
  });

  // Handle cursor position updates for collaborative awareness
  socket.on('cursor_update', (data) => {
    const { sessionId, userName, line, column } = data;
    socket.to(sessionId).emit('cursor_position', {
      userName,
      line,
      column,
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove user from all rooms
    rooms.forEach((room, sessionId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        io.to(sessionId).emit('user_left', {
          participantCount: room.users.size,
        });
      }
    });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
