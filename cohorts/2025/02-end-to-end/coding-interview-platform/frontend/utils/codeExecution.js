/**
 * Code Execution Utility
 * 
 * Handles communication with backend code execution API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Execute code using backend API
 * @param {string} code - Code to execute
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Execution result
 */
export async function executeCode(code, language) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code.trim(),
        language: language.toLowerCase(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Code execution failed',
        output: '',
      };
    }

    const result = await response.json();
    return result;
  } catch (err) {
    return {
      success: false,
      error: `Connection error: ${err.message || 'Unable to execute code'}`,
      output: '',
    };
  }
}

/**
 * Get list of supported languages
 * @returns {Promise<Array>} Array of supported languages
 */
export async function getSupportedLanguages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/languages`);
    
    if (!response.ok) {
      console.error('Failed to fetch languages');
      return [];
    }

    const data = await response.json();
    return data.languages || [];
  } catch (err) {
    console.error('Error fetching languages:', err);
    return [];
  }
}

/**
 * Format error message for display
 * @param {string} error - Error message
 * @returns {string} Formatted error
 */
export function formatErrorMessage(error) {
  if (!error) return '';
  
  // Clean up error messages for better display
  return error
    .replace(/Error:\s*/g, '')
    .replace(/at /g, '\nat ')
    .trim();
}

/**
 * Format output for display
 * @param {string} output - Raw output
 * @returns {string} Formatted output
 */
export function formatOutput(output) {
  if (!output) return '';
  
  // Limit output lines to avoid UI overflow
  const lines = output.split('\n');
  const maxLines = 100;
  
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join('\n') + 
           `\n... (${lines.length - maxLines} more lines)`;
  }
  
  return output;
}

/**
 * Check if code is empty or only comments/whitespace
 * @param {string} code - Code to check
 * @returns {boolean} True if code is effectively empty
 */
export function isCodeEmpty(code) {
  return code
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Filter out empty lines and comments
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#');
    })
    .length === 0;
}

/**
 * Estimate execution time in UI (for UX feedback)
 * @param {string} code - Code being executed
 * @param {string} language - Programming language
 * @returns {number} Estimated time in ms
 */
export function estimateExecutionTime(code, language) {
  // Base time varies by language
  const baseTimes = {
    javascript: 300,
    python: 500,
    java: 2000,
    cpp: 1500,
    csharp: 1000,
    ruby: 800,
    go: 1000,
    rust: 1500,
    php: 600,
  };

  const baseTime = baseTimes[language] || 500;
  const codeLines = code.split('\n').length;
  
  // Add time based on code complexity (rough estimate)
  return baseTime + Math.min(codeLines * 10, 2000);
}
