# Coding Interview Platform - Backend

Express.js backend for real-time collaborative coding interviews.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/sessions` - Create a new coding session
- `GET /api/sessions/:sessionId` - Get session details
- `GET /health` - Health check

## WebSocket Events

### Client → Server
- `join_session` - Join a coding session
- `code_update` - Update code content
- `language_change` - Change programming language
- `cursor_update` - Update user cursor position

### Server → Client
- `sync_code` - Sync current code state
- `code_changed` - Code update from other users
- `language_changed` - Language change notification
- `user_joined` - User joined the session
- `user_left` - User left the session
- `cursor_position` - Cursor position update
- `participants_list` - List of session participants

## Features

- Real-time collaborative code editing
- Multi-language support
- Session management with 24-hour TTL
- User presence tracking
- Cursor position sharing
