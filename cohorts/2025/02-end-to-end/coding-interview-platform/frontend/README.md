# Coding Interview Frontend

Next.js frontend for the collaborative coding interview platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update the API URL if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

- **Home Page**: Create a new interview session
- **Interview Room**: Real-time collaborative code editor
- **Code Execution**: Execute code in 9+ programming languages
- **Syntax Highlighting**: Beautiful syntax highlighting with Highlight.js
- **Participant List**: See who's currently in the session
- **Output Panel**: View code execution results
- **Share Link**: Copy and share the session link with candidates

## Pages

- `/` - Home page with session creation
- `/interview/[sessionId]` - Interview room with collaborative editor

## Components

- `CodeEditor` - Main code editor with syntax highlighting
- `OutputPanel` - Display code execution output
- `Participants` - Show active participants

## Technology Stack

- Next.js 14
- Socket.io client for real-time updates
- Highlight.js for syntax highlighting
- Piston API for code execution
- Axios for HTTP requests
