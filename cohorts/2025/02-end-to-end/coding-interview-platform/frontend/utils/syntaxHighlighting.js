import hljs from 'highlight.js';

// Language configurations for better highlighting
const languageConfigs = {
  javascript: {
    name: 'JavaScript',
    aliases: ['js', 'jsx', 'mjs'],
    extensions: ['.js', '.jsx', '.mjs'],
    icon: '⚡',
  },
  python: {
    name: 'Python',
    aliases: ['py', 'pyw', 'pyc'],
    extensions: ['.py', '.pyw', '.pyc'],
    icon: '🐍',
  },
  java: {
    name: 'Java',
    aliases: ['java'],
    extensions: ['.java'],
    icon: '☕',
  },
  cpp: {
    name: 'C++',
    aliases: ['cpp', 'cc', 'cxx'],
    extensions: ['.cpp', '.cc', '.cxx', '.h'],
    icon: '⚙️',
  },
  csharp: {
    name: 'C#',
    aliases: ['cs', 'csharp'],
    extensions: ['.cs'],
    icon: '#️⃣',
  },
  ruby: {
    name: 'Ruby',
    aliases: ['rb', 'ruby'],
    extensions: ['.rb'],
    icon: '💎',
  },
  go: {
    name: 'Go',
    aliases: ['go', 'golang'],
    extensions: ['.go'],
    icon: '🐹',
  },
  rust: {
    name: 'Rust',
    aliases: ['rs', 'rust'],
    extensions: ['.rs'],
    icon: '🦀',
  },
  php: {
    name: 'PHP',
    aliases: ['php', 'php3', 'php4', 'php5'],
    extensions: ['.php'],
    icon: '🐘',
  },
};

/**
 * Highlight code with proper language detection
 * @param {string} code - Code to highlight
 * @param {string} language - Language identifier
 * @returns {string} - Highlighted HTML
 */
export const highlightCode = (code, language) => {
  if (!code) return '';

  try {
    // Validate language
    const validLanguage = isValidLanguage(language) ? language : 'javascript';

    const highlighted = hljs.highlight(code, {
      language: validLanguage,
      ignoreIllegals: true,
    });

    return highlighted.value;
  } catch (error) {
    console.error('Syntax highlighting error:', error);
    // Fallback to plain text
    return escapeHtml(code);
  }
};

/**
 * Check if language is valid and supported by highlight.js
 * @param {string} language - Language to check
 * @returns {boolean}
 */
export const isValidLanguage = (language) => {
  try {
    const lang = hljs.getLanguage(language);
    return lang !== null;
  } catch {
    return false;
  }
};

/**
 * Get language display name and metadata
 * @param {string} language - Language identifier
 * @returns {object} - Language metadata
 */
export const getLanguageConfig = (language) => {
  return languageConfigs[language] || { name: language, icon: '📄' };
};

/**
 * Get all supported languages
 * @returns {array} - Array of language objects
 */
export const getSupportedLanguages = () => {
  return Object.entries(languageConfigs).map(([key, value]) => ({
    id: key,
    ...value,
  }));
};

/**
 * Detect language from code content (basic detection)
 * @param {string} code - Code to analyze
 * @returns {string} - Detected language
 */
export const detectLanguage = (code) => {
  if (!code) return 'javascript';

  // Check for Python-specific patterns
  if (
    /^import\s+\w+|^from\s+\w+\s+import|^def\s+\w+|^class\s+\w+|^if\s+__name__/.test(
      code
    )
  ) {
    return 'python';
  }

  // Check for JavaScript-specific patterns
  if (
    /^(const|let|var)\s+\w+|^function\s+\w+|^class\s+\w+|=>|async\s+function/.test(
      code
    )
  ) {
    return 'javascript';
  }

  // Check for Java
  if (/^public\s+class|^import\s+java\.|^public\s+static\s+void/.test(code)) {
    return 'java';
  }

  // Check for C++
  if (
    /#include\s+<|^int\s+main|std::|using\s+namespace/.test(code)
  ) {
    return 'cpp';
  }

  // Default to JavaScript
  return 'javascript';
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Get highlight.js theme classes
 * Available themes: atom-one-dark, atom-one-light, dracula, monokai, nord, solarized-dark
 */
export const getTheme = () => {
  return 'atom-one-dark';
};

/**
 * Format code with indentation
 * @param {string} code - Code to format
 * @param {number} indentSize - Indentation size (default 2)
 * @returns {string} - Formatted code
 */
export const formatCode = (code, indentSize = 2) => {
  return code
    .split('\n')
    .map((line) => {
      const trimmed = line.trimStart();
      const indent = line.length - trimmed.length;
      return ' '.repeat(Math.round(indent / indentSize) * indentSize) + trimmed;
    })
    .join('\n');
};

export default {
  highlightCode,
  isValidLanguage,
  getLanguageConfig,
  getSupportedLanguages,
  detectLanguage,
  escapeHtml,
  getTheme,
  formatCode,
};
