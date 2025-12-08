const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');

// Initialize test server
let app, server, io;
let cache;

const initializeTestServer = () => {
  app = express();
  server = http.createServer(app);
  cache = new NodeCache({ stdTTL: 86400 });
  
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
    },
  });

  app.use(cors());
  app.use(express.json());

  const rooms = new Map();

  // REST API endpoints
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
      shareLink: `http://localhost:3001/interview/${sessionId}`,
    });
  });

  app.get('/api/sessions/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const sessionData = cache.get(sessionId);

    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(sessionData);
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // WebSocket handlers
  io.on('connection', (socket) => {
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

      socket.emit('sync_code', {
        code: room.code,
        language: room.language,
      });

      socket.to(sessionId).emit('user_joined', {
        userName,
        participantCount: room.users.size,
      });

      socket.emit('participants_list', sessionData.participants);
    });

    socket.on('code_update', (data) => {
      const { sessionId, code } = data;
      const room = rooms.get(sessionId);

      if (room) {
        room.code = code;
        io.to(sessionId).emit('code_changed', { code });
      }
    });

    socket.on('language_change', (data) => {
      const { sessionId, language } = data;
      const room = rooms.get(sessionId);

      if (room) {
        room.language = language;
        io.to(sessionId).emit('language_changed', { language });
      }
    });

    socket.on('cursor_update', (data) => {
      const { sessionId, userName, line, column } = data;
      socket.to(sessionId).emit('cursor_position', {
        userName,
        line,
        column,
      });
    });

    socket.on('disconnect', () => {
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

  return new Promise((resolve) => {
    server.listen(5001, () => {
      resolve();
    });
  });
};

const closeTestServer = () => {
  return new Promise((resolve) => {
    io.close();
    server.close(() => {
      resolve();
    });
  });
};

describe('Integration Tests - Client & Server', () => {
  beforeAll(async () => {
    await initializeTestServer();
  });

  afterAll(async () => {
    await closeTestServer();
  });

  describe('REST API - Session Management', () => {
    test('should create a new session', async () => {
      const response = await fetch('http://localhost:5001/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.sessionId).toBeDefined();
      expect(data.shareLink).toBeDefined();
      expect(data.shareLink).toContain(data.sessionId);
    });

    test('should retrieve session details', async () => {
      const createRes = await fetch('http://localhost:5001/api/sessions', {
        method: 'POST',
      });
      const { sessionId } = await createRes.json();

      const getRes = await fetch(`http://localhost:5001/api/sessions/${sessionId}`);
      expect(getRes.status).toBe(200);
      
      const session = await getRes.json();
      expect(session.id).toBe(sessionId);
      expect(session.code).toBe('// Start coding here\n');
      expect(session.language).toBe('javascript');
    });

    test('should return 404 for non-existent session', async () => {
      const fakeId = 'non-existent-session-id';
      const response = await fetch(`http://localhost:5001/api/sessions/${fakeId}`);
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Session not found');
    });

    test('should return health status', async () => {
      const response = await fetch('http://localhost:5001/health');
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('ok');
    });
  });

  describe('WebSocket - Session Joining', () => {
    test('should join a session successfully', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket.on('connect', () => {
            socket.emit('join_session', {
              sessionId,
              userName: 'TestUser1',
            });
          });

          socket.on('sync_code', (data) => {
            expect(data.code).toBe('// Start coding here\n');
            expect(data.language).toBe('javascript');
            socket.disconnect();
            done();
          });

          socket.on('error', (err) => {
            socket.disconnect();
            done(new Error(err));
          });
        });
    });

    test('should reject join with non-existent session', (done) => {
      const socket = ioClient('http://localhost:5001', {
        reconnection: true,
        reconnectionDelay: 100,
      });

      socket.on('connect', () => {
        socket.emit('join_session', {
          sessionId: 'fake-session-id',
          userName: 'TestUser',
        });
      });

      socket.on('error', (err) => {
        expect(err).toBe('Session not found');
        socket.disconnect();
        done();
      });

      setTimeout(() => {
        socket.disconnect();
        done();
      }, 2000);
    });

    test('should receive participants list on join', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket.on('connect', () => {
            socket.emit('join_session', {
              sessionId,
              userName: 'TestUser2',
            });
          });

          socket.on('participants_list', (participants) => {
            expect(Array.isArray(participants)).toBe(true);
            expect(participants).toContain('TestUser2');
            socket.disconnect();
            done();
          });
        });
    });
  });

  describe('WebSocket - Real-time Code Sync', () => {
    test('should broadcast code updates to all users', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket1 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });
          const socket2 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          let connectedCount = 0;
          const handleConnect = () => {
            connectedCount++;
            if (connectedCount === 2) {
              socket1.emit('join_session', {
                sessionId,
                userName: 'User1',
              });
              socket2.emit('join_session', {
                sessionId,
                userName: 'User2',
              });
            }
          };

          socket1.on('connect', handleConnect);
          socket2.on('connect', handleConnect);

          let joinedCount = 0;
          const handleJoined = () => {
            joinedCount++;
            if (joinedCount === 2) {
              socket1.emit('code_update', {
                sessionId,
                code: 'console.log("Hello");',
              });
            }
          };

          socket1.on('participants_list', handleJoined);
          socket2.on('participants_list', handleJoined);

          socket2.on('code_changed', (data) => {
            expect(data.code).toBe('console.log("Hello");');
            socket1.disconnect();
            socket2.disconnect();
            done();
          });
        });
    });

    test('should sync code to newly joined user', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket1 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket1.on('connect', () => {
            socket1.emit('join_session', {
              sessionId,
              userName: 'FirstUser',
            });
          });

          socket1.on('participants_list', () => {
            socket1.emit('code_update', {
              sessionId,
              code: 'const x = 42;',
            });

            setTimeout(() => {
              const socket2 = ioClient('http://localhost:5001', {
                reconnection: true,
                reconnectionDelay: 100,
              });

              socket2.on('connect', () => {
                socket2.emit('join_session', {
                  sessionId,
                  userName: 'SecondUser',
                });
              });

              socket2.on('sync_code', (data) => {
                expect(data.code).toBe('const x = 42;');
                socket1.disconnect();
                socket2.disconnect();
                done();
              });
            }, 100);
          });
        });
    });
  });

  describe('WebSocket - Language Changes', () => {
    test('should broadcast language changes', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket1 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });
          const socket2 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          let connectedCount = 0;
          socket1.on('connect', () => {
            connectedCount++;
            if (connectedCount === 2) {
              socket1.emit('join_session', {
                sessionId,
                userName: 'User1',
              });
            }
          });
          socket2.on('connect', () => {
            connectedCount++;
            if (connectedCount === 2) {
              socket2.emit('join_session', {
                sessionId,
                userName: 'User2',
              });
            }
          });

          let joinedCount = 0;
          socket1.on('participants_list', () => {
            joinedCount++;
            if (joinedCount === 2) {
              socket1.emit('language_change', {
                sessionId,
                language: 'python',
              });
            }
          });
          socket2.on('participants_list', () => {
            joinedCount++;
          });

          socket2.on('language_changed', (data) => {
            expect(data.language).toBe('python');
            socket1.disconnect();
            socket2.disconnect();
            done();
          });
        });
    });
  });

  describe('WebSocket - Cursor Updates', () => {
    test('should broadcast cursor position updates', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket1 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });
          const socket2 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          let connectedCount = 0;
          const handleConnect = () => {
            connectedCount++;
            if (connectedCount === 2) {
              socket1.emit('join_session', {
                sessionId,
                userName: 'User1',
              });
              socket2.emit('join_session', {
                sessionId,
                userName: 'User2',
              });
            }
          };

          socket1.on('connect', handleConnect);
          socket2.on('connect', handleConnect);

          let joinedCount = 0;
          const handleJoined = () => {
            joinedCount++;
            if (joinedCount === 2) {
              socket1.emit('cursor_update', {
                sessionId,
                userName: 'User1',
                line: 5,
                column: 10,
              });
            }
          };

          socket1.on('participants_list', handleJoined);
          socket2.on('participants_list', handleJoined);

          socket2.on('cursor_position', (data) => {
            expect(data.userName).toBe('User1');
            expect(data.line).toBe(5);
            expect(data.column).toBe(10);
            socket1.disconnect();
            socket2.disconnect();
            done();
          });
        });
    });
  });

  describe('WebSocket - User Join/Leave Notifications', () => {
    test('should notify other users when someone joins', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket1 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket1.on('connect', () => {
            socket1.emit('join_session', {
              sessionId,
              userName: 'FirstUser',
            });
          });

          socket1.on('participants_list', () => {
            setTimeout(() => {
              const socket2 = ioClient('http://localhost:5001', {
                reconnection: true,
                reconnectionDelay: 100,
              });

              socket2.on('connect', () => {
                socket2.emit('join_session', {
                  sessionId,
                  userName: 'SecondUser',
                });
              });
            }, 100);
          });

          socket1.on('user_joined', (data) => {
            expect(data.userName).toBe('SecondUser');
            expect(data.participantCount).toBeGreaterThan(1);
            socket1.disconnect();
            done();
          });
        });
    });

    test('should notify other users when someone leaves', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket1 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });
          const socket2 = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          let connectedCount = 0;
          socket1.on('connect', () => {
            connectedCount++;
            if (connectedCount === 2) {
              socket1.emit('join_session', {
                sessionId,
                userName: 'User1',
              });
            }
          });
          socket2.on('connect', () => {
            connectedCount++;
            if (connectedCount === 2) {
              socket2.emit('join_session', {
                sessionId,
                userName: 'User2',
              });
            }
          });

          let joinedCount = 0;
          socket1.on('participants_list', () => {
            joinedCount++;
            if (joinedCount === 2) {
              socket2.disconnect();
            }
          });
          socket2.on('participants_list', () => {
            joinedCount++;
          });

          socket1.on('user_left', (data) => {
            expect(data.participantCount).toBe(1);
            socket1.disconnect();
            done();
          });
        });
    });
  });

  describe('WebSocket - Connection Management', () => {
    test('should handle multiple concurrent sessions', (done) => {
      Promise.all([
        fetch('http://localhost:5001/api/sessions', { method: 'POST' }).then(r => r.json()),
        fetch('http://localhost:5001/api/sessions', { method: 'POST' }).then(r => r.json()),
      ]).then(([session1, session2]) => {
        expect(session1.sessionId).not.toBe(session2.sessionId);
        done();
      });
    });

    test('should clean up on disconnect', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket.on('connect', () => {
            socket.emit('join_session', {
              sessionId,
              userName: 'TestUser',
            });
          });

          socket.on('participants_list', () => {
            socket.disconnect();
            setTimeout(done, 500);
          });
        });
    });
  });

  describe('Error Handling', () => {
    test('should handle empty code updates gracefully', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket.on('connect', () => {
            socket.emit('join_session', {
              sessionId,
              userName: 'TestUser',
            });
          });

          socket.on('participants_list', () => {
            socket.emit('code_update', {
              sessionId,
              code: '',
            });
            socket.disconnect();
            done();
          });
        });
    });

    test('should handle invalid language gracefully', (done) => {
      fetch('http://localhost:5001/api/sessions', { method: 'POST' })
        .then(res => res.json())
        .then(({ sessionId }) => {
          const socket = ioClient('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 100,
          });

          socket.on('connect', () => {
            socket.emit('join_session', {
              sessionId,
              userName: 'TestUser',
            });
          });

          socket.on('participants_list', () => {
            socket.emit('language_change', {
              sessionId,
              language: 'invalid-language',
            });
            socket.disconnect();
            done();
          });
        });
    });
  });
});
