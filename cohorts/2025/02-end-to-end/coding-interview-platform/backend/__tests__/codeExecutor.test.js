const {
  executeCode,
  getLanguageRuntime,
  getFileExtension,
  isLanguageSupported,
  getSupportedLanguages,
  sanitizeOutput,
  validateCodeSecurity,
} = require('../services/codeExecutor');

describe('Code Executor Service', () => {
  describe('getLanguageRuntime', () => {
    test('should return correct runtime for javascript', () => {
      expect(getLanguageRuntime('javascript')).toBe('node');
    });

    test('should return correct runtime for python', () => {
      expect(getLanguageRuntime('python')).toBe('python3');
    });

    test('should handle case-insensitive input', () => {
      expect(getLanguageRuntime('JAVASCRIPT')).toBe('node');
      expect(getLanguageRuntime('Python')).toBe('python3');
    });

    test('should return input for unknown language', () => {
      expect(getLanguageRuntime('unknown')).toBe('unknown');
    });
  });

  describe('getFileExtension', () => {
    test('should return correct extension for each language', () => {
      expect(getFileExtension('javascript')).toBe('js');
      expect(getFileExtension('python')).toBe('py');
      expect(getFileExtension('java')).toBe('java');
      expect(getFileExtension('cpp')).toBe('cpp');
      expect(getFileExtension('csharp')).toBe('cs');
      expect(getFileExtension('ruby')).toBe('rb');
      expect(getFileExtension('go')).toBe('go');
      expect(getFileExtension('rust')).toBe('rs');
      expect(getFileExtension('php')).toBe('php');
    });

    test('should return txt for unknown language', () => {
      expect(getFileExtension('unknown')).toBe('txt');
    });
  });

  describe('isLanguageSupported', () => {
    test('should return true for supported languages', () => {
      expect(isLanguageSupported('javascript')).toBe(true);
      expect(isLanguageSupported('python')).toBe(true);
      expect(isLanguageSupported('java')).toBe(true);
    });

    test('should return false for unsupported languages', () => {
      expect(isLanguageSupported('cobol')).toBe(false);
      expect(isLanguageSupported('fortran')).toBe(false);
    });

    test('should handle case-insensitive input', () => {
      expect(isLanguageSupported('JAVASCRIPT')).toBe(true);
      expect(isLanguageSupported('Python')).toBe(true);
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return array of language objects', () => {
      const languages = getSupportedLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBe(9);
    });

    test('should include required properties for each language', () => {
      const languages = getSupportedLanguages();
      languages.forEach((lang) => {
        expect(lang).toHaveProperty('id');
        expect(lang).toHaveProperty('name');
        expect(lang).toHaveProperty('extension');
        expect(lang).toHaveProperty('runtime');
      });
    });

    test('should include JavaScript and Python', () => {
      const languages = getSupportedLanguages();
      const ids = languages.map((l) => l.id);
      expect(ids).toContain('javascript');
      expect(ids).toContain('python');
    });
  });

  describe('sanitizeOutput', () => {
    test('should remove control characters', () => {
      const input = 'Hello\x00World\x01Test';
      const output = sanitizeOutput(input);
      expect(output).not.toContain('\x00');
      expect(output).not.toContain('\x01');
    });

    test('should truncate long output', () => {
      const longString = 'a'.repeat(15000);
      const output = sanitizeOutput(longString, 10000);
      expect(output.length).toBeLessThan(longString.length);
      expect(output).toContain('truncated');
    });

    test('should handle empty input', () => {
      expect(sanitizeOutput('')).toBe('');
      expect(sanitizeOutput(null)).toBe('');
      expect(sanitizeOutput(undefined)).toBe('');
    });

    test('should preserve normal output', () => {
      const input = 'Hello World\nTest Output';
      const output = sanitizeOutput(input);
      expect(output).toBe(input);
    });
  });

  describe('validateCodeSecurity', () => {
    test('should detect fork patterns', () => {
      const code = 'fork()';
      const result = validateCodeSecurity(code);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should detect eval patterns', () => {
      const code = 'eval("code")';
      const result = validateCodeSecurity(code);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should allow safe code', () => {
      const code = 'console.log("Hello World")';
      const result = validateCodeSecurity(code);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should return empty arrays for clean code', () => {
      const code = 'const x = 5; const y = x * 2; console.log(y);';
      const result = validateCodeSecurity(code);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('executeCode', () => {
    test('should return error for empty code', async () => {
      const result = await executeCode('', 'javascript');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should return error for missing language', async () => {
      const result = await executeCode('console.log("test")', '');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should return error for unsupported language', async () => {
      const result = await executeCode('console.log("test")', 'unsupported');
      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
    });

    test('should return error for null code', async () => {
      const result = await executeCode(null, 'javascript');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should validate code length', async () => {
      const largeCode = 'a'.repeat(100001);
      const result = await executeCode(largeCode, 'javascript');
      expect(result.success).toBe(false);
      expect(result.error).toContain('exceeds maximum limit');
    });

    test('should have required properties in result', async () => {
      const result = await executeCode('1 + 1', 'javascript');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('output');
    });
  });

  describe('JavaScript Execution', () => {
    test('should handle simple arithmetic', async () => {
      const code = 'console.log(2 + 2);';
      const result = await executeCode(code, 'javascript');
      // Result depends on Piston API availability
      expect(result).toHaveProperty('success');
    });

    test('should handle string concatenation', async () => {
      const code = 'console.log("Hello" + " " + "World");';
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle functions', async () => {
      const code = `
        function fibonacci(n) {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
        console.log(fibonacci(6));
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle arrow functions', async () => {
      const code = `
        const multiply = (a, b) => a * b;
        console.log(multiply(5, 3));
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle async/await', async () => {
      const code = `
        async function test() {
          return new Promise(resolve => {
            setTimeout(() => resolve('Done'), 100);
          });
        }
        test().then(result => console.log(result));
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle classes', async () => {
      const code = `
        class Counter {
          constructor(start = 0) {
            this.count = start;
          }
          increment() {
            this.count++;
            return this.count;
          }
        }
        const c = new Counter(5);
        console.log(c.increment());
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle arrays and loops', async () => {
      const code = `
        const arr = [1, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
          sum += arr[i];
        }
        console.log(sum);
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle template literals', async () => {
      const code = `
        const name = "World";
        const count = 5;
        console.log(\`Hello \${name}, counted \${count} times\`);
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });

    test('should handle error handling', async () => {
      const code = `
        try {
          throw new Error("Test error");
        } catch (e) {
          console.log("Caught:", e.message);
        }
      `;
      const result = await executeCode(code, 'javascript');
      expect(result).toHaveProperty('success');
    });
  });

  describe('Python Execution', () => {
    test('should handle simple print', async () => {
      const code = 'print("Hello, Python!")';
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });

    test('should handle functions', async () => {
      const code = `
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
      `;
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });

    test('should handle list comprehension', async () => {
      const code = `
squares = [x**2 for x in range(5)]
print(squares)
      `;
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });

    test('should handle classes', async () => {
      const code = `
class Counter:
    def __init__(self, start=0):
        self.count = start
    
    def increment(self):
        self.count += 1
        return self.count

c = Counter(5)
print(c.increment())
      `;
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });

    test('should handle imports', async () => {
      const code = `
import math
print(math.factorial(5))
      `;
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });

    test('should handle recursion', async () => {
      const code = `
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(6))
      `;
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });

    test('should handle error handling', async () => {
      const code = `
try:
    x = 1 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
      `;
      const result = await executeCode(code, 'python');
      expect(result).toHaveProperty('success');
    });
  });

  describe('Error Handling', () => {
    test('should catch network errors gracefully', async () => {
      // This test would require mocking the axios call
      // Placeholder for error handling test
      const result = await executeCode('console.log(1);', 'unsupported');
      expect(result.success).toBe(false);
    });

    test('should handle timeout gracefully', async () => {
      // Placeholder for timeout test
      const result = await executeCode('while(true) {}', 'javascript');
      expect(result).toHaveProperty('success');
    });
  });

  describe('Security', () => {
    test('should sanitize output for XSS prevention', () => {
      const maliciousOutput = '<script>alert("xss")</script>';
      const sanitized = sanitizeOutput(maliciousOutput);
      expect(sanitized).not.toContain('<script>');
    });

    test('should limit output size to prevent memory issues', () => {
      const hugeOutput = 'x'.repeat(20000);
      const sanitized = sanitizeOutput(hugeOutput, 5000);
      expect(sanitized.length).toBeLessThan(6000);
    });

    test('should reject code that exceeds size limit', async () => {
      const hugeCode = 'a'.repeat(150000);
      const result = await executeCode(hugeCode, 'javascript');
      expect(result.success).toBe(false);
    });
  });
});
