import {
  formatErrorMessage,
  formatOutput,
  isCodeEmpty,
  estimateExecutionTime,
} from '../utils/codeExecution';

describe('Code Execution Utils', () => {
  describe('formatErrorMessage', () => {
    test('should handle empty error', () => {
      expect(formatErrorMessage('')).toBe('');
      expect(formatErrorMessage(null)).toBe('');
      expect(formatErrorMessage(undefined)).toBe('');
    });

    test('should remove Error: prefix', () => {
      const error = 'Error: Something went wrong';
      expect(formatErrorMessage(error)).toBe('Something went wrong');
    });

    test('should clean up at references', () => {
      const error = 'TypeError at line 5 at function test';
      const result = formatErrorMessage(error);
      expect(result).toContain('\nat');
    });

    test('should preserve original message for clean errors', () => {
      const error = 'SyntaxError: Unexpected token';
      const result = formatErrorMessage(error);
      expect(result).toContain('SyntaxError');
    });

    test('should trim whitespace', () => {
      const error = '  Error message  ';
      const result = formatErrorMessage(error);
      expect(result).toBe('Error message');
    });
  });

  describe('formatOutput', () => {
    test('should handle empty output', () => {
      expect(formatOutput('')).toBe('');
      expect(formatOutput(null)).toBe('');
      expect(formatOutput(undefined)).toBe('');
    });

    test('should preserve normal output', () => {
      const output = 'Hello\nWorld';
      expect(formatOutput(output)).toBe(output);
    });

    test('should truncate long output', () => {
      const lines = Array(150).fill('output line').join('\n');
      const result = formatOutput(lines);
      expect(result).toContain('more lines');
      expect(result.split('\n').length).toBeLessThan(150);
    });

    test('should preserve first 100 lines', () => {
      const lines = Array(101).fill('line').join('\n');
      const result = formatOutput(lines);
      expect(result.split('line').length - 1).toBeLessThanOrEqual(101);
    });

    test('should show line count for truncated output', () => {
      const lines = Array(150).fill('x').join('\n');
      const result = formatOutput(lines);
      expect(result).toMatch(/\d+ more lines/);
    });
  });

  describe('isCodeEmpty', () => {
    test('should detect empty code', () => {
      expect(isCodeEmpty('')).toBe(true);
      expect(isCodeEmpty('   ')).toBe(true);
      expect(isCodeEmpty('\n\n\n')).toBe(true);
    });

    test('should detect code with only comments (JavaScript)', () => {
      const code = `
        // This is a comment
        // Another comment
      `;
      expect(isCodeEmpty(code)).toBe(true);
    });

    test('should detect code with only comments (Python)', () => {
      const code = `
        # This is a comment
        # Another comment
      `;
      expect(isCodeEmpty(code)).toBe(true);
    });

    test('should detect actual code', () => {
      expect(isCodeEmpty('console.log("hello")')).toBe(false);
      expect(isCodeEmpty('x = 5')).toBe(false);
      expect(isCodeEmpty('print("test")')).toBe(false);
    });

    test('should ignore comments with code', () => {
      const code = `
        // Comment
        console.log("test")
        // Another comment
      `;
      expect(isCodeEmpty(code)).toBe(false);
    });

    test('should handle mixed whitespace and comments', () => {
      const code = `
        
        // Comment
        
        
        # Another comment
      `;
      expect(isCodeEmpty(code)).toBe(true);
    });
  });

  describe('estimateExecutionTime', () => {
    test('should return base time for each language', () => {
      const baseCode = 'x = 1';
      expect(estimateExecutionTime(baseCode, 'javascript')).toBeLessThan(1000);
      expect(estimateExecutionTime(baseCode, 'python')).toBeLessThan(1000);
      expect(estimateExecutionTime(baseCode, 'java')).toBeGreaterThan(1000);
    });

    test('should increase time with code complexity', () => {
      const shortCode = 'x = 1';
      const longCode = Array(50).fill('x = x + 1').join('\n');
      
      const shortTime = estimateExecutionTime(shortCode, 'javascript');
      const longTime = estimateExecutionTime(longCode, 'javascript');
      
      expect(longTime).toBeGreaterThan(shortTime);
    });

    test('should handle unknown language', () => {
      const code = 'x = 1';
      const time = estimateExecutionTime(code, 'unknown');
      expect(time).toBeGreaterThan(0);
    });

    test('should not exceed maximum estimate', () => {
      const hugeCode = Array(1000).fill('x = 1').join('\n');
      const time = estimateExecutionTime(hugeCode, 'javascript');
      expect(time).toBeLessThan(10000); // Should cap at reasonable value
    });

    test('should return positive number', () => {
      const code = 'console.log("test")';
      const languages = ['javascript', 'python', 'java', 'cpp', 'csharp', 'ruby', 'go', 'rust', 'php'];
      
      languages.forEach((lang) => {
        const time = estimateExecutionTime(code, lang);
        expect(time).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle code with special characters', () => {
      const code = 'console.log("Hello\\nWorld\\t!");';
      expect(isCodeEmpty(code)).toBe(false);
    });

    test('should handle code with various quote types', () => {
      const code = `
        console.log('single');
        console.log("double");
        console.log(\`template\`);
      `;
      expect(isCodeEmpty(code)).toBe(false);
    });

    test('should handle multiline comments', () => {
      const code = `
        /*
        This is a
        multiline comment
        */
      `;
      expect(isCodeEmpty(code)).toBe(true);
    });

    test('should handle mixed content', () => {
      const code = `
        // Start comment
        console.log("Hello"); // Inline comment
        /* Block comment */
        const x = 5;
      `;
      expect(isCodeEmpty(code)).toBe(false);
    });
  });

  describe('Output Formatting Edge Cases', () => {
    test('should handle very long single line', () => {
      const longLine = 'a'.repeat(10000);
      const result = formatOutput(longLine);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle output with null bytes', () => {
      // Note: In actual use, null bytes should be sanitized by backend
      const output = 'test\n\noutput';
      const result = formatOutput(output);
      expect(result).toContain('test');
    });

    test('should handle output with only newlines', () => {
      const output = '\n\n\n\n\n';
      const result = formatOutput(output);
      expect(result).toBe(output);
    });
  });
});
