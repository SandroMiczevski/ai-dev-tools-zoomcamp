/**
 * Code Execution Service
 * 
 * Handles execution of code in multiple languages using the Piston API
 * Features:
 * - JavaScript, Python, Java, C++, C#, Ruby, Go, Rust, PHP
 * - Timeout protection (10 seconds max)
 * - Error handling and validation
 * - Output sanitization
 */

const axios = require('axios');

const PISTON_API_URL = 'https://emkc.org/api/v2/piston';
const EXECUTION_TIMEOUT = 10000; // 10 seconds

// Language configuration with file extensions and aliases
const LANGUAGE_CONFIG = {
  javascript: {
    runtime: 'node',
    extension: 'js',
    aliases: ['js', 'jsx'],
  },
  python: {
    runtime: 'python3',
    extension: 'py',
    aliases: ['py', 'python'],
  },
  java: {
    runtime: 'java',
    extension: 'java',
    aliases: ['java'],
  },
  cpp: {
    runtime: 'cpp',
    extension: 'cpp',
    aliases: ['c++', 'cpp'],
  },
  csharp: {
    runtime: 'csharp',
    extension: 'cs',
    aliases: ['c#', 'cs', 'csharp'],
  },
  ruby: {
    runtime: 'ruby',
    extension: 'rb',
    aliases: ['rb', 'ruby'],
  },
  go: {
    runtime: 'go',
    extension: 'go',
    aliases: ['golang', 'go'],
  },
  rust: {
    runtime: 'rust',
    extension: 'rs',
    aliases: ['rust', 'rs'],
  },
  php: {
    runtime: 'php',
    extension: 'php',
    aliases: ['php'],
  },
};

/**
 * Get language runtime from language identifier
 * @param {string} language - Language identifier (e.g., 'javascript', 'python')
 * @returns {string} Runtime name for Piston API
 */
function getLanguageRuntime(language) {
  const config = LANGUAGE_CONFIG[language.toLowerCase()];
  return config ? config.runtime : language;
}

/**
 * Get file extension for language
 * @param {string} language - Language identifier
 * @returns {string} File extension
 */
function getFileExtension(language) {
  const config = LANGUAGE_CONFIG[language.toLowerCase()];
  return config ? config.extension : 'txt';
}

/**
 * Validate if language is supported
 * @param {string} language - Language identifier
 * @returns {boolean} True if supported
 */
function isLanguageSupported(language) {
  return language.toLowerCase() in LANGUAGE_CONFIG;
}

/**
 * Sanitize code output for display
 * @param {string} output - Raw output
 * @param {number} maxLength - Maximum output length
 * @returns {string} Sanitized output
 */
function sanitizeOutput(output, maxLength = 10000) {
  if (!output) return '';
  
  // Remove null bytes and control characters
  let sanitized = output.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limit output length to prevent memory issues
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '\n... (output truncated)';
  }
  
  return sanitized;
}

/**
 * Execute code using Piston API
 * @param {string} code - Code to execute
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Execution result
 */
async function executeCode(code, language) {
  // Validation
  if (!code || typeof code !== 'string') {
    return {
      success: false,
      error: 'Code must be a non-empty string',
      output: '',
    };
  }

  if (!language || typeof language !== 'string') {
    return {
      success: false,
      error: 'Language must be specified',
      output: '',
    };
  }

  if (!isLanguageSupported(language)) {
    return {
      success: false,
      error: `Language '${language}' is not supported. Supported languages: ${Object.keys(LANGUAGE_CONFIG).join(', ')}`,
      output: '',
    };
  }

  // Validate code length (prevent abuse)
  if (code.length > 100000) {
    return {
      success: false,
      error: 'Code length exceeds maximum limit (100KB)',
      output: '',
    };
  }

  try {
    // Get language runtime
    const runtime = getLanguageRuntime(language);
    const extension = getFileExtension(language);

    // Prepare request payload
    const payload = {
      language: runtime,
      version: '*',
      files: [
        {
          name: `main.${extension}`,
          content: code,
        },
      ],
    };

    // Execute code with timeout
    const response = await Promise.race([
      axios.post(`${PISTON_API_URL}/execute`, payload, {
        timeout: EXECUTION_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Execution timeout (10s)')), EXECUTION_TIMEOUT)
      ),
    ]);

    const result = response.data;

    // Handle compilation errors
    if (result.compile && result.compile.stderr) {
      return {
        success: false,
        error: `Compilation Error:\n${sanitizeOutput(result.compile.stderr)}`,
        output: '',
      };
    }

    // Handle runtime errors
    if (result.run && result.run.stderr) {
      const stderr = sanitizeOutput(result.run.stderr);
      return {
        success: false,
        error: `Runtime Error:\n${stderr}`,
        output: sanitizeOutput(result.run.output || ''),
      };
    }

    // Success - return output
    const output = sanitizeOutput(result.run?.output || '');
    return {
      success: true,
      error: '',
      output: output || 'Code executed successfully (no output)',
    };
  } catch (err) {
    // Handle network and timeout errors
    let errorMessage = 'Execution failed: ';

    if (err.message === 'Execution timeout (10s)') {
      errorMessage = 'Code execution timed out (10 second limit exceeded)';
    } else if (err.response?.data?.message) {
      errorMessage += err.response.data.message;
    } else if (err.message) {
      errorMessage += err.message;
    } else {
      errorMessage += 'Unknown error occurred';
    }

    return {
      success: false,
      error: errorMessage,
      output: '',
    };
  }
}

/**
 * Get supported languages
 * @returns {Array} Array of supported language objects
 */
function getSupportedLanguages() {
  return Object.entries(LANGUAGE_CONFIG).map(([key, value]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    extension: value.extension,
    runtime: value.runtime,
  }));
}

/**
 * Validate code for obvious security issues
 * @param {string} code - Code to validate
 * @returns {Object} Validation result
 */
function validateCodeSecurity(code) {
  const warnings = [];
  const errors = [];

  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /fork\s*\(/gi, message: 'Process forking detected - be careful with infinite loops' },
    { pattern: /exec\s*\(/gi, message: 'Code execution in code detected' },
    { pattern: /eval\s*\(/gi, message: 'Eval usage detected' },
  ];

  suspiciousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      warnings.push(message);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = {
  executeCode,
  getLanguageRuntime,
  getFileExtension,
  isLanguageSupported,
  getSupportedLanguages,
  sanitizeOutput,
  validateCodeSecurity,
};
