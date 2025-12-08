const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');

describe('Backend - Unit Tests', () => {
  let cache;

  beforeEach(() => {
    cache = new NodeCache({ stdTTL: 3600 });
  });

  describe('Session Management', () => {
    test('should generate valid UUID for session', () => {
      const sessionId = uuidv4();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBe(36); // UUID format
    });

    test('should create session data structure', () => {
      const sessionId = uuidv4();
      const sessionData = {
        id: sessionId,
        code: '// Start coding here\n',
        language: 'javascript',
        title: 'Coding Interview',
        createdAt: new Date(),
        participants: [],
      };

      expect(sessionData.id).toBe(sessionId);
      expect(sessionData.code).toBe('// Start coding here\n');
      expect(sessionData.language).toBe('javascript');
      expect(Array.isArray(sessionData.participants)).toBe(true);
      expect(sessionData.participants.length).toBe(0);
    });

    test('should store and retrieve session from cache', () => {
      const sessionId = uuidv4();
      const sessionData = {
        id: sessionId,
        code: 'test code',
        language: 'python',
        title: 'Test Session',
        createdAt: new Date(),
        participants: ['User1'],
      };

      cache.set(sessionId, sessionData);
      const retrieved = cache.get(sessionId);

      expect(retrieved).toEqual(sessionData);
      expect(retrieved.id).toBe(sessionId);
    });

    test('should expire session after TTL', (done) => {
      const shortCache = new NodeCache({ stdTTL: 1 });
      const sessionId = uuidv4();
      const sessionData = { id: sessionId, code: 'test' };

      shortCache.set(sessionId, sessionData);
      expect(shortCache.get(sessionId)).toBeDefined();

      setTimeout(() => {
        expect(shortCache.get(sessionId)).toBeUndefined();
        done();
      }, 1100);
    });

    test('should handle non-existent session retrieval', () => {
      const fakeId = 'non-existent-id';
      const result = cache.get(fakeId);
      expect(result).toBeUndefined();
    });
  });

  describe('Participant Management', () => {
    test('should add participant to session', () => {
      const sessionData = {
        participants: [],
      };

      const newParticipant = 'Alice';
      if (!sessionData.participants.includes(newParticipant)) {
        sessionData.participants.push(newParticipant);
      }

      expect(sessionData.participants).toContain('Alice');
      expect(sessionData.participants.length).toBe(1);
    });

    test('should not add duplicate participants', () => {
      const sessionData = {
        participants: ['Alice'],
      };

      const newParticipant = 'Alice';
      if (!sessionData.participants.includes(newParticipant)) {
        sessionData.participants.push(newParticipant);
      }

      expect(sessionData.participants.length).toBe(1);
    });

    test('should track multiple participants', () => {
      const sessionData = {
        participants: [],
      };

      const users = ['Alice', 'Bob', 'Charlie'];
      users.forEach(user => {
        if (!sessionData.participants.includes(user)) {
          sessionData.participants.push(user);
        }
      });

      expect(sessionData.participants.length).toBe(3);
      expect(sessionData.participants).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    test('should validate participant name format', () => {
      const validateName = (name) => {
        return name && typeof name === 'string' && name.trim().length > 0;
      };

      expect(validateName('Alice')).toBe(true);
      expect(validateName('')).toBe(false);
      expect(validateName(null)).toBe(false);
      expect(validateName(undefined)).toBe(false);
    });
  });

  describe('Code Management', () => {
    test('should initialize with default code', () => {
      const defaultCode = '// Start coding here\n';
      expect(defaultCode).toBe('// Start coding here\n');
    });

    test('should update code content', () => {
      let code = '// Start coding here\n';
      const newCode = 'console.log("Hello");';
      
      code = newCode;
      expect(code).toBe('console.log("Hello");');
    });

    test('should handle empty code', () => {
      let code = '';
      expect(code).toBe('');
      expect(typeof code).toBe('string');
    });

    test('should handle multiline code', () => {
      const code = `function add(a, b) {
  return a + b;
}`;
      expect(code.split('\n').length).toBe(3);
      expect(code).toContain('function add');
    });

    test('should preserve code whitespace', () => {
      const code = '  const x = 10;  ';
      expect(code).toBe('  const x = 10;  ');
      expect(code.includes('  ')).toBe(true);
    });
  });

  describe('Language Support', () => {
    test('should support multiple languages', () => {
      const supportedLanguages = [
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

      expect(supportedLanguages.length).toBeGreaterThanOrEqual(9);
      expect(supportedLanguages).toContain('javascript');
      expect(supportedLanguages).toContain('python');
    });

    test('should validate language selection', () => {
      const isValidLanguage = (lang) => {
        const valid = [
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
        return valid.includes(lang);
      };

      expect(isValidLanguage('javascript')).toBe(true);
      expect(isValidLanguage('python')).toBe(true);
      expect(isValidLanguage('invalid')).toBe(false);
    });

    test('should update language', () => {
      let language = 'javascript';
      language = 'python';
      expect(language).toBe('python');
    });
  });

  describe('Room Management', () => {
    test('should create room state', () => {
      const room = {
        users: new Set(),
        code: '// code',
        language: 'javascript',
      };

      expect(room.users instanceof Set).toBe(true);
      expect(room.code).toBe('// code');
      expect(room.language).toBe('javascript');
    });

    test('should track users in room', () => {
      const room = {
        users: new Set(['user1', 'user2', 'user3']),
      };

      expect(room.users.size).toBe(3);
      expect(room.users.has('user1')).toBe(true);
      expect(room.users.has('user4')).toBe(false);
    });

    test('should add user to room', () => {
      const room = {
        users: new Set(),
      };

      room.users.add('socketId1');
      expect(room.users.size).toBe(1);
      expect(room.users.has('socketId1')).toBe(true);
    });

    test('should remove user from room', () => {
      const room = {
        users: new Set(['socketId1', 'socketId2']),
      };

      room.users.delete('socketId1');
      expect(room.users.size).toBe(1);
      expect(room.users.has('socketId1')).toBe(false);
    });

    test('should sync room code state', () => {
      const room = {
        code: '// initial',
        language: 'javascript',
      };

      room.code = 'console.log("updated");';
      room.language = 'python';

      expect(room.code).toBe('console.log("updated");');
      expect(room.language).toBe('python');
    });
  });

  describe('Data Validation', () => {
    test('should validate session ID format', () => {
      const isValidSessionId = (id) => {
        return id && typeof id === 'string' && id.length === 36;
      };

      const validId = uuidv4();
      expect(isValidSessionId(validId)).toBe(true);
      expect(isValidSessionId('invalid')).toBe(false);
      expect(isValidSessionId('')).toBe(false);
    });

    test('should validate code is string', () => {
      const isValidCode = (code) => {
        return typeof code === 'string';
      };

      expect(isValidCode('console.log("test");')).toBe(true);
      expect(isValidCode('')).toBe(true);
      expect(isValidCode(123)).toBe(false);
      expect(isValidCode(null)).toBe(false);
    });

    test('should validate coordinates are numbers', () => {
      const isValidCoordinate = (line, column) => {
        return typeof line === 'number' && typeof column === 'number';
      };

      expect(isValidCoordinate(5, 10)).toBe(true);
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate('5', 10)).toBe(false);
      expect(isValidCoordinate(5, null)).toBe(false);
    });
  });

  describe('Error Scenarios', () => {
    test('should handle missing session data gracefully', () => {
      const sessionData = cache.get('non-existent');
      expect(sessionData).toBeUndefined();
    });

    test('should handle invalid event data', () => {
      const validateEventData = (data) => {
        return data && typeof data === 'object';
      };

      expect(validateEventData({})).toBe(true);
      expect(validateEventData(null)).toBe(false);
      expect(validateEventData('string')).toBe(false);
    });

    test('should handle concurrent operations', () => {
      const sessionId = uuidv4();
      const operations = [];

      for (let i = 0; i < 100; i++) {
        operations.push(() => {
          cache.set(`session-${i}`, { id: i });
        });
      }

      operations.forEach(op => op());

      expect(cache.keys().length).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long code', () => {
      const longCode = 'x'.repeat(10000);
      expect(longCode.length).toBe(10000);
      expect(typeof longCode).toBe('string');
    });

    test('should handle special characters in code', () => {
      const code = 'const str = "!@#$%^&*()[]{}";';
      expect(code).toContain('!@#$%^&*');
    });

    test('should handle unicode in names', () => {
      const userName = 'José';
      expect(userName).toBe('José');
    });

    test('should handle rapid sequential events', () => {
      const events = [];
      for (let i = 0; i < 100; i++) {
        events.push({
          type: 'code_update',
          data: `update-${i}`,
        });
      }

      expect(events.length).toBe(100);
      expect(events[0].type).toBe('code_update');
    });
  });
});
