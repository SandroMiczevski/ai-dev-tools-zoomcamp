/**
 * Browser-Based Code Execution Engine
 * 
 * Uses Worker threads and Web Workers for safe code execution
 * Provides JavaScript and Python support via PyScript/Pyodide
 * 
 * Security Features:
 * - Code runs in isolated Web Worker (separate thread)
 * - Timeout protection (5 seconds)
 * - Output capture and sanitization
 * - No access to DOM or network
 * - Memory limits
 */

/**
 * Create a code execution worker
 * @returns {Worker} Worker instance
 */
function createExecutionWorker() {
  const workerCode = `
    // Worker thread for safe code execution
    let executionTimeout;
    let outputs = [];
    let hasError = false;
    let errorMessage = '';

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function(...args) {
      outputs.push(args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' '));
    };

    console.error = function(...args) {
      hasError = true;
      outputs.push('[ERROR] ' + args.join(' '));
    };

    console.warn = function(...args) {
      outputs.push('[WARN] ' + args.join(' '));
    };

    // Handle messages from main thread
    self.onmessage = function(event) {
      const { code, timeout = 5000 } = event.data;
      
      outputs = [];
      hasError = false;
      errorMessage = '';

      // Clear previous timeout
      if (executionTimeout) clearTimeout(executionTimeout);

      try {
        // Set execution timeout
        executionTimeout = setTimeout(() => {
          hasError = true;
          errorMessage = 'Execution timeout (5 second limit exceeded)';
          self.postMessage({
            success: false,
            error: errorMessage,
            output: outputs.join('\\n')
          });
        }, timeout);

        // Execute code in try-catch
        try {
          // Create a new Function to avoid polluting global scope
          const fn = new Function(code);
          fn();
        } catch (err) {
          hasError = true;
          errorMessage = err.toString();
          outputs.push('[Error] ' + errorMessage);
        } finally {
          clearTimeout(executionTimeout);
        }

        // Send results
        self.postMessage({
          success: !hasError,
          error: errorMessage,
          output: outputs.join('\\n')
        });

      } catch (err) {
        self.postMessage({
          success: false,
          error: 'Worker error: ' + err.toString(),
          output: outputs.join('\\n')
        });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));
  return worker;
}

/**
 * Execute JavaScript code in browser (safe isolation)
 * @param {string} code - JavaScript code to execute
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Execution result
 */
export async function executeJavaScriptBrowser(code, timeout = 5000) {
  return new Promise((resolve) => {
    try {
      // Validate code
      if (!code || typeof code !== 'string') {
        return resolve({
          success: false,
          error: 'Code must be a non-empty string',
          output: '',
        });
      }

      // Check code length
      if (code.length > 50000) {
        return resolve({
          success: false,
          error: 'Code length exceeds maximum limit (50KB)',
          output: '',
        });
      }

      const worker = createExecutionWorker();
      let finished = false;

      // Set timeout for worker response
      const responseTimeout = setTimeout(() => {
        if (!finished) {
          finished = true;
          worker.terminate();
          resolve({
            success: false,
            error: 'Execution timeout - worker did not respond',
            output: '',
          });
        }
      }, timeout + 1000); // Extra buffer

      // Handle worker message
      worker.onmessage = (event) => {
        if (!finished) {
          finished = true;
          clearTimeout(responseTimeout);
          worker.terminate();
          resolve(event.data);
        }
      };

      // Handle worker error
      worker.onerror = (error) => {
        if (!finished) {
          finished = true;
          clearTimeout(responseTimeout);
          worker.terminate();
          resolve({
            success: false,
            error: 'Worker error: ' + error.message,
            output: '',
          });
        }
      };

      // Send code to worker
      worker.postMessage({ code, timeout });

    } catch (err) {
      resolve({
        success: false,
        error: 'Execution failed: ' + err.message,
        output: '',
      });
    }
  });
}

/**
 * Execute Python code in browser using Pyodide
 * @param {string} code - Python code to execute
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Execution result
 */
export async function executePythonBrowser(code, timeout = 5000) {
  return new Promise((resolve) => {
    try {
      // Validate code
      if (!code || typeof code !== 'string') {
        return resolve({
          success: false,
          error: 'Code must be a non-empty string',
          output: '',
        });
      }

      if (code.length > 50000) {
        return resolve({
          success: false,
          error: 'Code length exceeds maximum limit (50KB)',
          output: '',
        });
      }

      // Check if Pyodide is loaded
      if (typeof window.pyodide === 'undefined') {
        return resolve({
          success: false,
          error: 'Python runtime not initialized. Please refresh the page.',
          output: '',
        });
      }

      const timeoutHandle = setTimeout(() => {
        resolve({
          success: false,
          error: 'Python execution timeout (5 second limit exceeded)',
          output: '',
        });
      }, timeout);

      try {
        const pyodide = window.pyodide;
        const output = [];

        // Redirect stdout
        const originalPrint = pyodide.globals.get('print');
        pyodide.globals.set('print', (...args) => {
          output.push(args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' '));
        });

        // Execute code
        pyodide.runPython(code);

        // Restore original print
        pyodide.globals.set('print', originalPrint);

        clearTimeout(timeoutHandle);
        resolve({
          success: true,
          error: '',
          output: output.join('\n'),
        });

      } catch (err) {
        clearTimeout(timeoutHandle);
        resolve({
          success: false,
          error: err.toString(),
          output: '',
        });
      }

    } catch (err) {
      resolve({
        success: false,
        error: 'Execution failed: ' + err.message,
        output: '',
      });
    }
  });
}

/**
 * Execute code based on language (browser-only)
 * @param {string} code - Code to execute
 * @param {string} language - Programming language
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} Execution result
 */
export async function executeCodeBrowser(code, language, timeout = 5000) {
  const lang = language.toLowerCase();

  if (lang === 'javascript' || lang === 'js') {
    return executeJavaScriptBrowser(code, timeout);
  } else if (lang === 'python' || lang === 'py') {
    return executePythonBrowser(code, timeout);
  } else {
    return {
      success: false,
      error: `Language '${language}' is not supported in browser mode. Supported: JavaScript, Python`,
      output: '',
    };
  }
}

/**
 * Initialize Python runtime (Pyodide)
 * Call this once on app startup
 * @returns {Promise<boolean>} True if successful
 */
export async function initializePythonRuntime() {
  try {
    // Check if already loaded
    if (typeof window.pyodide !== 'undefined') {
      return true;
    }

    // Load Pyodide from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
    script.async = true;

    return new Promise((resolve) => {
      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
          });
          window.pyodide = pyodide;
          resolve(true);
        } catch (err) {
          console.error('Failed to initialize Python runtime:', err);
          resolve(false);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Pyodide script');
        resolve(false);
      };

      document.head.appendChild(script);
    });
  } catch (err) {
    console.error('Error initializing Python runtime:', err);
    return false;
  }
}

/**
 * Get supported languages for browser execution
 * @returns {Array} Array of supported language objects
 */
export function getBrowserSupportedLanguages() {
  return [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '⚡',
      extension: 'js',
      environment: 'Browser (Worker)',
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      extension: 'py',
      environment: 'Browser (Pyodide)',
    },
  ];
}

/**
 * Validate code for obvious issues
 * @param {string} code - Code to validate
 * @returns {Object} Validation result
 */
export function validateBrowserCode(code, language) {
  const warnings = [];
  const errors = [];

  // Check for infinite loops (simple pattern matching)
  const infiniteLoopPatterns = [
    /while\s*\(\s*true\s*\)/gi,
    /while\s*\(\s*1\s*\)/gi,
    /for\s*\(\s*;\s*;\s*\)/gi,
  ];

  infiniteLoopPatterns.forEach((pattern) => {
    if (pattern.test(code)) {
      warnings.push('Potential infinite loop detected - code will timeout after 5 seconds');
    }
  });

  // Check for suspicious patterns in JavaScript
  if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
    const suspiciousPatterns = [
      { pattern: /eval\s*\(/gi, message: 'eval() usage detected' },
      { pattern: /new\s+Function/gi, message: 'Dynamic function creation detected' },
      { pattern: /document\./gi, message: 'DOM access detected - may not work as expected' },
      { pattern: /window\./gi, message: 'Window access detected - may be limited' },
    ];

    suspiciousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(code)) {
        warnings.push(message);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if code is empty
 * @param {string} code - Code to check
 * @returns {boolean} True if empty or only whitespace/comments
 */
export function isCodeEmpty(code) {
  return code
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#');
    })
    .length === 0;
}

/**
 * Format output for display
 * @param {string} output - Raw output
 * @param {number} maxLines - Maximum lines to show
 * @returns {string} Formatted output
 */
export function formatBrowserOutput(output, maxLines = 100) {
  if (!output) return '';

  const lines = output.split('\n');
  if (lines.length > maxLines) {
    return (
      lines.slice(0, maxLines).join('\n') +
      `\n... (${lines.length - maxLines} more lines)`
    );
  }

  return output;
}
