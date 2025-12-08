# API Documentation

## REST API Endpoints

### Create Session
**POST** `/api/sessions`

Creates a new interview session.

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "shareLink": "http://localhost:3000/interview/550e8400-e29b-41d4-a716-446655440000"
}
```

**Usage:**
```javascript
const response = await fetch('http://localhost:5000/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
const { sessionId, shareLink } = await response.json();
```

---

### Get Session Details
**GET** `/api/sessions/:sessionId`

Retrieves session information including code, language, and participants.

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "// Start coding here\n",
  "language": "javascript",
  "title": "Coding Interview",
  "createdAt": "2024-12-04T10:30:00.000Z",
  "participants": ["Alice", "Bob"]
}
```

**Response (404):**
```json
{
  "error": "Session not found"
}
```

**Usage:**
```javascript
const response = await fetch('http://localhost:5000/api/sessions/SESSION_ID');
const session = await response.json();
```

---

### Health Check
**GET** `/health`

Check if the backend server is running.

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## WebSocket Events

### Client → Server Events

#### join_session
Join an interview session.

**Emit:**
```javascript
socket.emit('join_session', {
  sessionId: "550e8400-e29b-41d4-a716-446655440000",
  userName: "Alice"
});
```

**Parameters:**
- `sessionId` (string): The ID of the session to join
- `userName` (string): The name of the user joining

---

#### code_update
Send code changes to all connected users.

**Emit:**
```javascript
socket.emit('code_update', {
  sessionId: "550e8400-e29b-41d4-a716-446655440000",
  code: "console.log('Hello, World!');"
});
```

**Parameters:**
- `sessionId` (string): The session ID
- `code` (string): The new code content

---

#### language_change
Change the programming language for the session.

**Emit:**
```javascript
socket.emit('language_change', {
  sessionId: "550e8400-e29b-41d4-a716-446655440000",
  language: "python"
});
```

**Parameters:**
- `sessionId` (string): The session ID
- `language` (string): The new language (javascript, python, java, etc.)

---

#### cursor_update
Send cursor position for collaborative awareness.

**Emit:**
```javascript
socket.emit('cursor_update', {
  sessionId: "550e8400-e29b-41d4-a716-446655440000",
  userName: "Alice",
  line: 5,
  column: 10
});
```

**Parameters:**
- `sessionId` (string): The session ID
- `userName` (string): The user's name
- `line` (number): Line number (0-indexed)
- `column` (number): Column number (0-indexed)

---

### Server → Client Events

#### sync_code
Receive current code state when joining a session.

**Listen:**
```javascript
socket.on('sync_code', (data) => {
  console.log(data.code);
  console.log(data.language);
});
```

**Response:**
```json
{
  "code": "// Start coding here\nconst x = 5;",
  "language": "javascript"
}
```

---

#### code_changed
Receive code updates from other users.

**Listen:**
```javascript
socket.on('code_changed', (data) => {
  console.log(data.code);
});
```

**Response:**
```json
{
  "code": "// Start coding here\nconst x = 5;\nconsole.log(x);"
}
```

---

#### language_changed
Receive language change notifications.

**Listen:**
```javascript
socket.on('language_changed', (data) => {
  console.log(data.language);
});
```

**Response:**
```json
{
  "language": "python"
}
```

---

#### user_joined
Notification when a user joins the session.

**Listen:**
```javascript
socket.on('user_joined', (data) => {
  console.log(`${data.userName} joined`);
  console.log(`Total participants: ${data.participantCount}`);
});
```

**Response:**
```json
{
  "userName": "Bob",
  "participantCount": 2
}
```

---

#### user_left
Notification when a user leaves the session.

**Listen:**
```javascript
socket.on('user_left', (data) => {
  console.log(`Participants: ${data.participantCount}`);
});
```

**Response:**
```json
{
  "participantCount": 1
}
```

---

#### cursor_position
Receive cursor position updates from other users.

**Listen:**
```javascript
socket.on('cursor_position', (data) => {
  console.log(`${data.userName} is at line ${data.line}, column ${data.column}`);
});
```

**Response:**
```json
{
  "userName": "Bob",
  "line": 3,
  "column": 15
}
```

---

#### participants_list
Receive the list of all participants in the session.

**Listen:**
```javascript
socket.on('participants_list', (participants) => {
  console.log(participants); // ["Alice", "Bob"]
});
```

**Response:**
```json
["Alice", "Bob"]
```

---

#### error
Receive error messages from the server.

**Listen:**
```javascript
socket.on('error', (message) => {
  console.error(message);
});
```

**Response:**
```json
"Session not found"
```

---

## Complete Example

### Backend (Node.js with Socket.io)

```javascript
const io = require('socket.io')();

io.on('connection', (socket) => {
  // User joins session
  socket.on('join_session', ({ sessionId, userName }) => {
    socket.join(sessionId);
    socket.emit('sync_code', {
      code: '// Existing code',
      language: 'javascript'
    });
    socket.to(sessionId).emit('user_joined', {
      userName,
      participantCount: 2
    });
  });

  // Code update
  socket.on('code_update', ({ sessionId, code }) => {
    io.to(sessionId).emit('code_changed', { code });
  });
});
```

### Frontend (JavaScript with Socket.io Client)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join session
socket.emit('join_session', {
  sessionId: 'my-session-id',
  userName: 'Alice'
});

// Listen for code sync
socket.on('sync_code', ({ code, language }) => {
  console.log('Code synced:', code);
});

// Listen for code changes
socket.on('code_changed', ({ code }) => {
  console.log('Code updated:', code);
});

// Send code update
socket.emit('code_update', {
  sessionId: 'my-session-id',
  code: 'console.log("Hello");'
});
```

---

## Error Handling

### Common Errors

**Session Not Found**
```json
{
  "error": "Session not found"
}
```

Occurs when:
- Session ID is invalid
- Session has expired (after 24 hours)

**Connection Error**
```
CORS policy error
```

Solution:
- Check `CLIENT_URL` environment variable matches frontend URL
- Ensure both frontend and backend are running

**Socket Connection Failed**
```
WebSocket connection error
```

Solution:
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_API_URL` in frontend
- Look for firewall issues

---

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Consider adding rate limiting middleware
- Implement per-user message throttling
- Add session timeout checks

---

## Security Considerations

1. **Session IDs**: UUIDs generated for uniqueness
2. **Code Execution**: Uses external Piston API (sandboxed)
3. **CORS**: Configured to allow frontend domain
4. **Session TTL**: 24-hour expiration for memory efficiency

---

## Performance

- **Session Storage**: In-memory with 24-hour TTL
- **Maximum Participants**: Depends on server resources
- **Message Broadcasting**: O(n) where n = active connections
- **Memory Per Session**: ~1-2 KB baseline + code size

---

## Testing

### Using cURL

```bash
# Create session
curl -X POST http://localhost:5000/api/sessions

# Get session
curl http://localhost:5000/api/sessions/SESSION_ID

# Health check
curl http://localhost:5000/health
```

### Using Postman

1. Create new POST request to `http://localhost:5000/api/sessions`
2. Send request to get session ID
3. Use session ID in GET request to `/api/sessions/:sessionId`

---

## Versioning

Current API Version: **v1**

Future versions planned for:
- Authentication endpoints
- Session analytics
- User management
- Recording functionality
