import {
  highlightCode,
  isValidLanguage,
  detectLanguage,
  getLanguageConfig,
  getSupportedLanguages,
  escapeHtml,
  formatCode,
} from '../utils/syntaxHighlighting';

describe('Syntax Highlighting Utilities', () => {
  describe('highlightCode', () => {
    test('should highlight JavaScript code', () => {
      const code = 'const x = 5;';
      const highlighted = highlightCode(code, 'javascript');
      expect(highlighted).toContain('hljs');
      expect(highlighted.length).toBeGreaterThan(code.length);
    });

    test('should highlight Python code', () => {
      const code = 'x = 5';
      const highlighted = highlightCode(code, 'python');
      expect(highlighted).toContain('hljs');
    });

    test('should return empty string for empty code', () => {
      const highlighted = highlightCode('', 'javascript');
      expect(highlighted).toBe('');
    });

    test('should handle invalid language gracefully', () => {
      const code = 'const x = 5;';
      const highlighted = highlightCode(code, 'invalid-lang');
      expect(highlighted).toBeTruthy();
    });

    test('should handle null code', () => {
      const highlighted = highlightCode(null, 'javascript');
      expect(highlighted).toBe('');
    });

    test('should highlight JavaScript with comments', () => {
      const code = '// This is a comment\nconst x = 5;';
      const highlighted = highlightCode(code, 'javascript');
      expect(highlighted).toContain('hljs-comment');
    });

    test('should highlight JavaScript strings', () => {
      const code = 'const name = "John";';
      const highlighted = highlightCode(code, 'javascript');
      expect(highlighted).toContain('hljs-string');
    });

    test('should highlight Python functions', () => {
      const code = 'def hello():\n  print("world")';
      const highlighted = highlightCode(code, 'python');
      expect(highlighted).toContain('hljs-function');
    });
  });

  describe('isValidLanguage', () => {
    test('should return true for valid languages', () => {
      expect(isValidLanguage('javascript')).toBe(true);
      expect(isValidLanguage('python')).toBe(true);
      expect(isValidLanguage('java')).toBe(true);
      expect(isValidLanguage('cpp')).toBe(true);
    });

    test('should return false for invalid languages', () => {
      expect(isValidLanguage('invalid')).toBe(false);
      expect(isValidLanguage('xyz')).toBe(false);
      expect(isValidLanguage('')).toBe(false);
    });

    test('should handle null language', () => {
      expect(isValidLanguage(null)).toBe(false);
    });
  });

  describe('detectLanguage', () => {
    test('should detect JavaScript', () => {
      expect(detectLanguage('const x = 5;')).toBe('javascript');
      expect(detectLanguage('let y = 10;')).toBe('javascript');
      expect(detectLanguage('var z = 15;')).toBe('javascript');
      expect(detectLanguage('function foo() {}')).toBe('javascript');
      expect(detectLanguage('class MyClass {}')).toBe('javascript');
      expect(detectLanguage('const add = (a, b) => a + b;')).toBe('javascript');
      expect(detectLanguage('async function fetch() {}')).toBe('javascript');
    });

    test('should detect Python', () => {
      expect(detectLanguage('import os')).toBe('python');
      expect(detectLanguage('from math import sqrt')).toBe('python');
      expect(detectLanguage('def hello():')).toBe('python');
      expect(detectLanguage('class Person:')).toBe('python');
      expect(detectLanguage('if __name__ == "__main__":')).toBe('python');
    });

    test('should detect Java', () => {
      expect(detectLanguage('public class Main {}')).toBe('java');
      expect(detectLanguage('import java.util.List;')).toBe('java');
      expect(detectLanguage('public static void main(String[] args) {}')).toBe('java');
    });

    test('should detect C++', () => {
      expect(detectLanguage('#include <iostream>')).toBe('cpp');
      expect(detectLanguage('int main() { return 0; }')).toBe('cpp');
      expect(detectLanguage('std::cout << "hello";')).toBe('cpp');
      expect(detectLanguage('using namespace std;')).toBe('cpp');
    });

    test('should default to JavaScript for ambiguous code', () => {
      expect(detectLanguage('x = 5')).toBe('javascript');
      expect(detectLanguage('print("hello")')).toBe('javascript');
      expect(detectLanguage('echo "hello";')).toBe('javascript');
    });

    test('should handle empty code', () => {
      expect(detectLanguage('')).toBe('javascript');
    });

    test('should handle null code', () => {
      expect(detectLanguage(null)).toBe('javascript');
    });
  });

  describe('getLanguageConfig', () => {
    test('should return config for JavaScript', () => {
      const config = getLanguageConfig('javascript');
      expect(config.name).toBe('JavaScript');
      expect(config.icon).toBe('⚡');
      expect(config.aliases).toContain('js');
    });

    test('should return config for Python', () => {
      const config = getLanguageConfig('python');
      expect(config.name).toBe('Python');
      expect(config.icon).toBe('🐍');
      expect(config.aliases).toContain('py');
    });

    test('should return default config for unknown language', () => {
      const config = getLanguageConfig('unknown');
      expect(config.name).toBe('unknown');
      expect(config.icon).toBe('📄');
    });

    test('should include file extensions', () => {
      const jsConfig = getLanguageConfig('javascript');
      expect(jsConfig.extensions).toContain('.js');
      
      const pyConfig = getLanguageConfig('python');
      expect(pyConfig.extensions).toContain('.py');
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return array of languages', () => {
      const languages = getSupportedLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
    });

    test('should include JavaScript and Python', () => {
      const languages = getSupportedLanguages();
      const ids = languages.map(l => l.id);
      expect(ids).toContain('javascript');
      expect(ids).toContain('python');
    });

    test('should include all expected languages', () => {
      const languages = getSupportedLanguages();
      const expectedLanguages = [
        'javascript', 'python', 'java', 'cpp', 'csharp',
        'ruby', 'go', 'rust', 'php'
      ];
      const ids = languages.map(l => l.id);
      expectedLanguages.forEach(lang => {
        expect(ids).toContain(lang);
      });
    });

    test('each language should have required properties', () => {
      const languages = getSupportedLanguages();
      languages.forEach(lang => {
        expect(lang.id).toBeDefined();
        expect(lang.name).toBeDefined();
        expect(lang.icon).toBeDefined();
        expect(lang.aliases).toBeDefined();
        expect(lang.extensions).toBeDefined();
      });
    });
  });

  describe('escapeHtml', () => {
    test('should escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    test('should escape ampersand', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    test('should escape quotes', () => {
      expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;');
      expect(escapeHtml("It's done")).toBe('It&#039;s done');
    });

    test('should escape angle brackets', () => {
      expect(escapeHtml('<div>content</div>')).toBe(
        '&lt;div&gt;content&lt;/div&gt;'
      );
    });

    test('should handle multiple special characters', () => {
      expect(escapeHtml('<p>A & B</p>')).toBe('&lt;p&gt;A &amp; B&lt;/p&gt;');
    });

    test('should return unchanged string with no special chars', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('formatCode', () => {
    test('should format code with default indentation', () => {
      const code = 'if (true) {\n  x = 5\n}';
      const formatted = formatCode(code);
      expect(formatted).toBeTruthy();
    });

    test('should respect custom indent size', () => {
      const code = 'if (true) {\n  x = 5\n}';
      const formatted = formatCode(code, 4);
      expect(formatted).toBeTruthy();
    });

    test('should handle already formatted code', () => {
      const code = 'const x = 5;\nconst y = 10;';
      const formatted = formatCode(code);
      expect(formatted).toContain('const x');
    });

    test('should trim trailing whitespace', () => {
      const code = 'x = 5   \ny = 10   ';
      const formatted = formatCode(code);
      expect(formatted).not.toContain('   \n');
    });
  });

  describe('Integration Tests', () => {
    test('should work end-to-end for JavaScript', () => {
      const code = 'const greet = (name) => `Hello, ${name}!`;';
      const lang = detectLanguage(code);
      expect(lang).toBe('javascript');
      
      const config = getLanguageConfig(lang);
      expect(config.name).toBe('JavaScript');
      
      const highlighted = highlightCode(code, lang);
      expect(highlighted.length).toBeGreaterThan(code.length);
    });

    test('should work end-to-end for Python', () => {
      const code = 'def greet(name):\n    return f"Hello, {name}!"';
      const lang = detectLanguage(code);
      expect(lang).toBe('python');
      
      const config = getLanguageConfig(lang);
      expect(config.name).toBe('Python');
      
      const highlighted = highlightCode(code, lang);
      expect(highlighted.length).toBeGreaterThan(code.length);
    });

    test('should support multi-language workflow', () => {
      const languages = getSupportedLanguages();
      
      languages.forEach(lang => {
        expect(isValidLanguage(lang.id)).toBe(true);
        const config = getLanguageConfig(lang.id);
        expect(config.name).toBeDefined();
      });
    });
  });
});
