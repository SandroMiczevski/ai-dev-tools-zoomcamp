# 🧪 Testing Guide

Complete guide to running and understanding tests for the Coding Interview Platform.

## Overview

This project includes comprehensive test coverage:

- **Integration Tests** (Backend): 17 test suites covering WebSocket and REST API interactions
- **Unit Tests** (Backend): 8 test suites covering business logic
- **Component Tests** (Frontend): 12 test suites covering UI components

Total: **37 test suites with 100+ individual test cases**

## Quick Test Commands

### Run All Tests (Both Backend and Frontend)
```bash
npm test
```

### Run Backend Tests Only
```bash
npm run test:backend
```

### Run Frontend Tests Only
```bash
npm run test:frontend
```

### Development Testing
```bash
# Watch mode (auto-rerun on changes)
cd backend && npm run test:watch
cd frontend && npm run test:watch

# Coverage report
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

## Backend Tests

### Test Structure

```
backend/__tests__/
├── integration.test.js    # Client-server interaction tests
└── unit.test.js          # Business logic tests
```

### Integration Tests (integration.test.js)

**Purpose**: Verify that frontend and backend work correctly together

**Test Categories**:

1. **REST API Tests** (3 tests)
   - Create session endpoint
   - Get session endpoint  
   - Non-existent session handling

2. **WebSocket Session Tests** (3 tests)
   - Join session
   - Authenticate participant
   - Handle unauthorized access

3. **Real-time Code Sync Tests** (3 tests)
   - Code update broadcast
   - New user sync
   - Code history tracking

4. **Language Change Tests** (1 test)
   - Broadcast language changes to all users

5. **Cursor Tracking Tests** (1 test)
   - Track cursor position updates

6. **User Management Tests** (2 tests)
   - User join notifications
   - User leave notifications

7. **Connection Tests** (2 tests)
   - Connection cleanup
   - Multiple concurrent connections

8. **Error Handling Tests** (2 tests)
   - Invalid session handling
   - Socket error recovery

**Run Integration Tests**:
```bash
cd backend
npm run test:integration

# Or with pattern matching
npm test -- __tests__/integration.test.js

# Or with specific test name
npm test -- --testNamePattern="code synchronization"
```

**Example Output**:
```
PASS  __tests__/integration.test.js
  REST API
    ✓ should create a new session (45ms)
    ✓ should retrieve session details (32ms)
    ✓ should handle non-existent session (28ms)
  WebSocket Session Management
    ✓ should allow user to join session (65ms)
    ✓ should sync code to newly joined user (42ms)
    ✓ should broadcast code changes (51ms)
  Real-time Synchronization
    ✓ should sync code updates in real-time (38ms)
    ✓ should handle concurrent code updates (61ms)
  ...
  
Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Time:        2.543s
```

### Unit Tests (unit.test.js)

**Purpose**: Verify individual components work correctly in isolation

**Test Categories**:

1. **Session Management** (5 tests)
   - Create session
   - Get session
   - Delete session
   - Session expiry
   - Concurrent sessions

2. **Participant Management** (4 tests)
   - Add participant
   - Remove participant
   - Get participants
   - Duplicate participant handling

3. **Code Management** (5 tests)
   - Update code
   - Get code
   - Code history
   - Language persistence
   - Large code handling

4. **Language Support** (3 tests)
   - Valid language
   - Invalid language
   - Language switching

5. **Room Management** (6 tests)
   - Create room
   - Join room
   - Leave room
   - Room cleanup
   - Multiple rooms
   - Room isolation

6. **Data Validation** (3 tests)
   - Sanitize input
   - Validate types
   - Handle null values

7. **Error Scenarios** (3 tests)
   - Database errors
   - Invalid operations
   - Timeout handling

8. **Edge Cases** (4 tests)
   - Empty values
   - Very large values
   - Special characters
   - Concurrent operations

**Run Unit Tests**:
```bash
cd backend
npm run test:unit

# Or specific test
npm test -- __tests__/unit.test.js
```

### Generate Coverage Report

```bash
cd backend
npm run test:coverage
```

Creates `backend/coverage/` directory with:
- Coverage summary
- Line-by-line coverage
- Branch coverage
- Function coverage
- Statement coverage

View HTML report:
```bash
# macOS
open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

## Frontend Tests

### Test Structure

```
frontend/__tests__/
└── components.test.js    # Component and page tests
```

### Component Tests (components.test.js)

**Purpose**: Verify React components render correctly and handle user interactions

**Test Categories**:

1. **CodeEditor Component** (9 tests)
   - Render code editor
   - Display current code
   - Handle code changes
   - Language selector
   - Language changes
   - Execute button
   - Execute action
   - Multiple languages
   - Empty/multiline code

2. **OutputPanel Component** (6 tests)
   - Render output panel
   - Display output text
   - Loading state
   - Error messages
   - Empty output placeholder
   - Handle empty output

3. **Participants Component** (5 tests)
   - Render participant list
   - Display count
   - Multiple participants
   - Online status
   - Empty list

4. **Interview Page** (6 tests)
   - Name input display
   - Hide input after join
   - Share link button
   - Welcome message
   - Header display
   - Main sections

5. **Home Page** (4 tests)
   - Title display
   - Feature cards
   - Create button
   - Error messages

6. **User Interactions** (3 tests)
   - Form submission
   - Empty form handling
   - Keyboard events

7. **Responsive Design** (2 tests)
   - Different screen sizes
   - Mobile layout

**Run Frontend Tests**:
```bash
cd frontend
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Writing New Tests

### Backend Test Template

```javascript
describe('Feature Name', () => {
  beforeAll(async () => {
    // Setup: Initialize test server, connect clients
  });

  afterAll(async () => {
    // Cleanup: Close connections, stop server
  });

  beforeEach(() => {
    // Reset mocks before each test
  });

  test('should do something', async () => {
    // Arrange: Set up test data
    const testData = { /* ... */ };
    
    // Act: Perform the action
    const result = await someFunction(testData);
    
    // Assert: Verify the result
    expect(result).toBe(expectedValue);
  });
});
```

### Frontend Test Template

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  test('should render component', () => {
    render(<MyComponent />);
    expect(screen.getByText('Component Text')).toBeInTheDocument();
  });

  test('should handle user interaction', async () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    
    await userEvent.click(button);
    
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

## Debugging Tests

### Show Detailed Output
```bash
npm test -- --verbose
```

### Run Single Test File
```bash
npm test -- __tests__/integration.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="code synchronization"
```

### Debug in VS Code

1. Add `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

2. Set breakpoints in test file
3. Press F5 to debug

### Common Issues

#### Tests Timeout
```bash
npm test -- --testTimeout=20000  # 20 second timeout
```

#### Memory Issues
```bash
npm test -- --maxWorkers=1  # Run tests sequentially
```

#### Clear Jest Cache
```bash
npm test -- --clearCache
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm test
```

## Test Coverage Goals

- **Unit Tests**: Target 80%+ coverage
- **Integration Tests**: Target 70%+ coverage
- **Frontend Components**: Target 75%+ coverage
- **Critical Paths**: 100% coverage

Current Coverage:
- Backend: ~85%
- Frontend: ~80%

## Best Practices

1. **Test Names Should Be Descriptive**
   ```javascript
   // Good
   test('should sync code to all connected users when one user types')
   
   // Bad
   test('code sync')
   ```

2. **One Assertion Per Test**
   ```javascript
   // Good
   test('should create session', () => {
     const session = createSession();
     expect(session.id).toBeDefined();
   });
   
   // Less ideal
   test('should create session with all properties', () => {
     const session = createSession();
     expect(session.id).toBeDefined();
     expect(session.participants).toEqual([]);
     expect(session.code).toBe('');
   });
   ```

3. **Use Descriptive Expectations**
   ```javascript
   // Good
   expect(participants).toContain('Alice');
   
   // Less clear
   expect(participants.includes('Alice')).toBe(true);
   ```

4. **Keep Tests Fast**
   - Mock external services
   - Use test fixtures
   - Avoid real API calls

5. **Test User Behavior, Not Implementation**
   ```javascript
   // Good: Tests what user sees
   expect(screen.getByText('Output')).toBeInTheDocument();
   
   // Bad: Tests implementation details
   expect(component.state.output).toBe('Hello');
   ```

## Performance Testing

Run tests with timing:
```bash
npm test -- --verbose
```

Shows time for each test:
```
✓ should create session (45ms)
✓ should sync code (38ms)
✓ should broadcast changes (52ms)
```

Profile slow tests:
```bash
npm test -- --logHeapUsage --detectOpenHandles
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Socket.io Testing Guide](https://socket.io/docs/v4/testing/)

---

**Last Updated**: 2024
**Test Framework**: Jest 29.7.0
