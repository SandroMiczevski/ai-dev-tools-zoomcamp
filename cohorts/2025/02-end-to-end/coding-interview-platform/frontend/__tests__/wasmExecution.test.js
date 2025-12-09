import {
  executeJavaScriptBrowser,
  executeCodeBrowser,
  getBrowserSupportedLanguages,
  validateBrowserCode,
  isCodeEmpty,
  formatBrowserOutput,
} from '../utils/wasmExecution';

describe('Browser-Based WASM Code Execution', () => {
  describe('getBrowserSupportedLanguages', () => {
    test('should return supported languages', () => {
      const languages = getBrowserSupportedLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBe(2);
    });

    test('should include JavaScript and Python', () => {
      const languages = getBrowserSupportedLanguages();
      const ids = languages.map((l) => l.id);
      expect(ids).toContain('javascript');
      expect(ids).toContain('python');
    });

    test('should have required properties', () => {
      const languages = getBrowserSupportedLanguages();
      languages.forEach((lang) => {
        expect(lang).toHaveProperty('id');
        expect(lang).toHaveProperty('name');
        expect(lang).toHaveProperty('icon');
        expect(lang).toHaveProperty('extension');
        expect(lang).toHaveProperty('environment');
      });
    });

    test('should have correct environments', () => {
      const languages = getBrowserSupportedLanguages();
      const js = languages.find((l) => l.id === 'javascript');
      const py = languages.find((l) => l.id === 'python');

      expect(js.environment).toContain('Worker');
      expect(py.environment).toContain('Pyodide');
    });
  });

  describe('isCodeEmpty', () => {
    test('should detect empty code', () => {
      expect(isCodeEmpty('')).toBe(true);
      expect(isCodeEmpty('   ')).toBe(true);
      expect(isCodeEmpty('\n\n\n')).toBe(true);
    });

    test('should detect code with only comments', () => {
      expect(isCodeEmpty('// comment')).toBe(true);
      expect(isCodeEmpty('# comment')).toBe(true);
      expect(isCodeEmpty('// line1\n// line2')).toBe(true);
    });

    test('should detect actual code', () => {
      expect(isCodeEmpty('console.log("test")')).toBe(false);
      expect(isCodeEmpty('x = 5')).toBe(false);
      expect(isCodeEmpty('print("hello")')).toBe(false);
    });

    test('should ignore comments with code', () => {
      const code = `
        // Comment
        console.log("test")
      `;
      expect(isCodeEmpty(code)).toBe(false);
    });
  });

  describe('formatBrowserOutput', () => {
    test('should handle empty output', () => {
      expect(formatBrowserOutput('')).toBe('');
      expect(formatBrowserOutput(null)).toBe('');
      expect(formatBrowserOutput(undefined)).toBe('');
    });

    test('should preserve normal output', () => {
      const output = 'Hello\nWorld';
      expect(formatBrowserOutput(output)).toBe(output);
    });

    test('should truncate long output', () => {
      const lines = Array(150).fill('line').join('\n');
      const result = formatBrowserOutput(lines, 100);
      expect(result).toContain('more lines');
    });

    test('should show correct line count', () => {
      const lines = Array(150).fill('x').join('\n');
      const result = formatBrowserOutput(lines, 100);
      expect(result).toMatch(/50 more lines/);
    });
  });

  describe('validateBrowserCode', () => {
    test('should detect infinite loops', () => {
      const patterns = [
        'while(true) {}',
        'while (true) {}',
        'while(1) {}',
        'for(;;) {}',
      ];

      patterns.forEach((code) => {
        const result = validateBrowserCode(code, 'javascript');
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings[0]).toContain('infinite loop');
      });
    });

    test('should detect eval usage', () => {
      const code = 'eval("x = 5")';
      const result = validateBrowserCode(code, 'javascript');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should detect new Function usage', () => {
      const code = 'new Function("return 42")()';
      const result = validateBrowserCode(code, 'javascript');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should detect DOM access', () => {
      const code = 'document.getElementById("id")';
      const result = validateBrowserCode(code, 'javascript');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should allow safe code', () => {
      const code = 'const x = 5; console.log(x);';
      const result = validateBrowserCode(code, 'javascript');
      expect(result.errors.length).toBe(0);
    });

    test('should ignore warnings for Python', () => {
      const code = 'while True:\n    pass';
      const result = validateBrowserCode(code, 'python');
      // Python code should not trigger JavaScript warnings
      expect(result.warnings.filter((w) => w.includes('eval')).length).toBe(0);
    });
  });

  describe('executeCodeBrowser', () => {
    test('should reject empty code', async () => {
      const result = await executeCodeBrowser('', 'javascript');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject code longer than 50KB', async () => {
      const largeCode = 'x'.repeat(60000);
      const result = await executeCodeBrowser(largeCode, 'javascript');
      expect(result.success).toBe(false);
      expect(result.error).toContain('exceeds maximum limit');
    });

    test('should reject unsupported language', async () => {
      const result = await executeCodeBrowser('code', 'java');
      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
    });

    test('should have required properties in result', async () => {
      const result = await executeCodeBrowser('console.log(1)', 'javascript', 1000);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('output');
    });

    test('should timeout on infinite loop', async () => {
      // Note: This test may take time to complete
      const result = await executeCodeBrowser('while(true) {}', 'javascript', 1000);
      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
    }, 10000); // 10 second timeout for test
  });

  describe('JavaScript Execution', () => {
    test('should execute simple console.log', async () => {
      const result = await executeCodeBrowser('console.log("test");', 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('test');
    });

    test('should execute arithmetic', async () => {
      const code = 'console.log(2 + 2);';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('4');
    });

    test('should execute variable declarations', async () => {
      const code = `
        const x = 10;
        const y = 20;
        console.log(x + y);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('30');
    });

    test('should execute functions', async () => {
      const code = `
        function add(a, b) {
          return a + b;
        }
        console.log(add(5, 3));
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('8');
    });

    test('should execute arrow functions', async () => {
      const code = `
        const multiply = (a, b) => a * b;
        console.log(multiply(4, 5));
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('20');
    });

    test('should execute array operations', async () => {
      const code = `
        const arr = [1, 2, 3, 4, 5];
        const sum = arr.reduce((a, b) => a + b, 0);
        console.log(sum);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('15');
    });

    test('should execute loops', async () => {
      const code = `
        for (let i = 0; i < 3; i++) {
          console.log(i);
        }
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('0');
      expect(result.output).toContain('1');
      expect(result.output).toContain('2');
    });

    test('should execute classes', async () => {
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
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('6');
    });

    test('should catch syntax errors', async () => {
      const code = 'const x = ;'; // Syntax error
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should catch runtime errors', async () => {
      const code = 'console.log(undefinedVariable);';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle multiple console.logs', async () => {
      const code = `
        console.log("line1");
        console.log("line2");
        console.log("line3");
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('line1');
      expect(result.output).toContain('line2');
      expect(result.output).toContain('line3');
    });

    test('should handle object logging', async () => {
      const code = `
        const obj = { a: 1, b: 2 };
        console.log(obj);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('a');
      expect(result.output).toContain('b');
    });

    test('should handle console.warn', async () => {
      const code = 'console.warn("warning");';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('[WARN]');
    });

    test('should handle console.error', async () => {
      const code = 'console.error("error");';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle async code', async () => {
      const code = `
        async function test() {
          return new Promise(resolve => {
            setTimeout(() => resolve('done'), 100);
          });
        }
        test().then(result => console.log(result));
      `;
      const result = await executeCodeBrowser(code, 'javascript', 3000);
      expect(result).toHaveProperty('success');
    });

    test('should handle template literals', async () => {
      const code = `
        const name = "World";
        console.log(\`Hello, \${name}!\`);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello');
    });

    test('should handle destructuring', async () => {
      const code = `
        const [a, b, c] = [1, 2, 3];
        console.log(a + b + c);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('6');
    });

    test('should handle spread operator', async () => {
      const code = `
        const arr1 = [1, 2];
        const arr2 = [3, 4];
        const combined = [...arr1, ...arr2];
        console.log(combined.length);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('4');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty object', async () => {
      const code = 'console.log({});';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
    });

    test('should handle empty array', async () => {
      const code = 'console.log([]);';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
    });

    test('should handle null and undefined', async () => {
      const code = `
        console.log(null);
        console.log(undefined);
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
    });

    test('should handle very long output', async () => {
      const code = `
        for (let i = 0; i < 200; i++) {
          console.log("Line " + i);
        }
      `;
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
    });

    test('should handle special characters', async () => {
      const code = 'console.log("!@#$%^&*()");';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
    });

    test('should handle unicode', async () => {
      const code = 'console.log("Hello 🌍");';
      const result = await executeCodeBrowser(code, 'javascript', 2000);
      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello');
    });

    test('should handle case-insensitive language selection', async () => {
      const result = await executeCodeBrowser('console.log("test");', 'JAVASCRIPT', 2000);
      expect(result.success).toBe(true);
    });

    test('should handle JS alias', async () => {
      const result = await executeCodeBrowser('console.log("test");', 'js', 2000);
      expect(result.success).toBe(true);
    });
  });
});
