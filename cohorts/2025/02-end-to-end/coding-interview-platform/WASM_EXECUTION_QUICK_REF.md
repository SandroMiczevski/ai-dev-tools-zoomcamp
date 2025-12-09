# 🚀 WASM Execution Quick Reference

## Quick Start

### 1. Initialize on App Startup
```javascript
useEffect(() => {
  initializePythonRuntime().then(success => {
    console.log('Python ready:', success);
  });
}, []);
```

### 2. Execute JavaScript
```javascript
import { executeCodeBrowser } from '../utils/wasmExecution';

const result = await executeCodeBrowser(
  'console.log("Hello");',
  'javascript'
);
console.log(result.output);
```

### 3. Execute Python
```javascript
const result = await executeCodeBrowser(
  'print("Hello")',
  'python'
);
console.log(result.output);
```

---

## Supported Languages

| Language | Type | Example |
|----------|------|---------|
| JavaScript | Browser Worker | `console.log('hi')` |
| Python | Pyodide (WASM) | `print('hi')` |
| JS alias | Browser Worker | `const x = 5;` |
| Py alias | Pyodide (WASM) | `x = 5` |

---

## JavaScript Examples

### Variables
```javascript
const x = 10;
let y = 20;
var z = 30;
console.log(x + y + z);  // 60
```

### Functions
```javascript
function add(a, b) {
  return a + b;
}
console.log(add(5, 3));  // 8
```

### Arrow Functions
```javascript
const multiply = (a, b) => a * b;
console.log(multiply(4, 5));  // 20
```

### Arrays
```javascript
const arr = [1, 2, 3, 4, 5];
console.log(arr.map(x => x * 2));
console.log(arr.filter(x => x > 2));
console.log(arr.reduce((a, b) => a + b, 0));
```

### Loops
```javascript
for (let i = 0; i < 3; i++) {
  console.log(i);
}

const arr = [1, 2, 3];
arr.forEach(x => console.log(x));
```

### Objects
```javascript
const person = {
  name: 'John',
  age: 30,
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};
person.greet();
```

### Classes
```javascript
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
console.log(c.increment());  // 6
```

### Template Literals
```javascript
const name = 'World';
const greeting = `Hello, ${name}!`;
console.log(greeting);
```

### Destructuring
```javascript
const [a, b, c] = [1, 2, 3];
console.log(a + b + c);  // 6

const { x, y } = { x: 10, y: 20 };
console.log(x + y);  // 30
```

### Spread Operator
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];
console.log(combined);  // [1, 2, 3, 4]
```

### Try-Catch
```javascript
try {
  throw new Error('Test error');
} catch (e) {
  console.log('Caught:', e.message);
}
```

### Async/Await
```javascript
async function delay() {
  return new Promise(r => 
    setTimeout(() => r('done'), 100)
  );
}
delay().then(result => console.log(result));
```

---

## Python Examples

### Variables
```python
x = 10
y = 20
z = 30
print(x + y + z)  # 60
```

### Functions
```python
def add(a, b):
    return a + b

print(add(5, 3))  # 8
```

### Lists
```python
arr = [1, 2, 3, 4, 5]
print([x * 2 for x in arr])
print([x for x in arr if x > 2])
print(sum(arr))
```

### Loops
```python
for i in range(3):
    print(i)

for x in [1, 2, 3]:
    print(x)
```

### Dictionaries
```python
person = {
    'name': 'John',
    'age': 30
}
print(person['name'])
print(person['age'])
```

### Classes
```python
class Counter:
    def __init__(self, start=0):
        self.count = start
    
    def increment(self):
        self.count += 1
        return self.count

c = Counter(5)
print(c.increment())  # 6
```

### String Formatting
```python
name = 'World'
greeting = f'Hello, {name}!'
print(greeting)
```

### Unpacking
```python
a, b, c = [1, 2, 3]
print(a + b + c)  # 6
```

### Map/Filter
```python
numbers = [1, 2, 3, 4, 5]
print(list(map(lambda x: x * 2, numbers)))
print(list(filter(lambda x: x > 2, numbers)))
```

### Try-Except
```python
try:
    raise Exception('Test error')
except Exception as e:
    print(f'Caught: {e}')
```

### Imports
```python
import math
print(math.factorial(5))  # 120
```

---

## API Reference

### executeCodeBrowser(code, language, timeout=5000)
Execute code in browser sandbox.

```javascript
const result = await executeCodeBrowser(
  'console.log("test")',
  'javascript'
);
```

### executeJavaScriptBrowser(code, timeout=5000)
Execute JavaScript code in Web Worker.

```javascript
const result = await executeJavaScriptBrowser('x = 5; console.log(x);');
```

### executePythonBrowser(code, timeout=5000)
Execute Python code via Pyodide.

```javascript
const result = await executePythonBrowser('x = 5; print(x)');
```

### initializePythonRuntime()
Initialize Pyodide (call once on startup).

```javascript
useEffect(() => {
  initializePythonRuntime();
}, []);
```

### getBrowserSupportedLanguages()
Get list of supported languages.

```javascript
const languages = getBrowserSupportedLanguages();
// [
//   { id: 'javascript', name: 'JavaScript', ... },
//   { id: 'python', name: 'Python', ... }
// ]
```

### validateBrowserCode(code, language)
Validate code for issues.

```javascript
const validation = validateBrowserCode('while(true) {}', 'javascript');
// { isValid: true, errors: [], warnings: [...] }
```

### isCodeEmpty(code)
Check if code is empty.

```javascript
isCodeEmpty('// comment');       // true
isCodeEmpty('console.log("x")'); // false
```

### formatBrowserOutput(output, maxLines=100)
Format output for display.

```javascript
const formatted = formatBrowserOutput(veryLongOutput);
```

---

## Response Format

All execution functions return:

```javascript
{
  success: boolean,    // true if code ran without errors
  error: string,       // Error message (empty if success)
  output: string       // Console output
}
```

**Example:**
```javascript
// Success
{
  success: true,
  error: '',
  output: 'Hello, World!\n'
}

// Error
{
  success: false,
  error: 'ReferenceError: x is not defined',
  output: ''
}
```

---

## Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Code must be non-empty" | Empty code | Add code |
| "exceeds maximum limit" | Code >50KB | Reduce size |
| "not supported" | Wrong language | Use JS/Python |
| "timeout" | Code too slow | Optimize code |
| "Python runtime not initialized" | Pyodide failed | Refresh page |
| "ReferenceError" | Undefined variable | Declare variable |
| "SyntaxError" | Invalid syntax | Fix syntax |
| "Potential infinite loop" | Warning detected | Fix loop |

---

## Testing

### Run Tests
```bash
npm test -- frontend/__tests__/wasmExecution.test.js
```

### Run Specific Test
```bash
npm test -- wasmExecution.test.js -t "should execute"
```

### Watch Mode
```bash
npm test -- wasmExecution.test.js --watch
```

---

## Performance Tips

### For Users
- Keep code under 50KB
- Avoid infinite loops
- Optimize recursive functions
- Use built-in methods

### For Developers
- Initialize Python on startup (not per-execution)
- Cache validation results
- Show progress indicators
- Handle timeouts gracefully

---

## Common Patterns

### Execute and Display Result
```javascript
const { executeCodeBrowser, formatBrowserOutput } = require('../utils/wasmExecution');

const result = await executeCodeBrowser(code, language);
if (result.success) {
  setOutput(formatBrowserOutput(result.output));
} else {
  setError(result.error);
}
```

### Validate Before Executing
```javascript
const { validateBrowserCode, executeCodeBrowser } = require('../utils/wasmExecution');

const validation = validateBrowserCode(code, language);
if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
const result = await executeCodeBrowser(code, language);
```

### Initialize Python
```javascript
import { initializePythonRuntime } from '../utils/wasmExecution';

useEffect(() => {
  initializePythonRuntime().then(success => {
    if (!success) {
      console.error('Python initialization failed');
    }
  });
}, []);
```

### With Timeout Handling
```javascript
const result = await executeCodeBrowser(code, language, 3000);
if (result.error && result.error.includes('timeout')) {
  setError('Code execution timed out - please optimize your code');
}
```

---

## Limitations

### What Works ✅
- Console output (console.log, console.error, console.warn)
- All JavaScript features (ES6+, async/await, classes)
- All Python 3 features
- Math operations
- String manipulation
- Data structures (arrays, objects, etc.)
- Functions and classes
- Error handling (try/catch)
- Recursion (within timeout)

### What Doesn't Work ❌
- DOM manipulation (no document, window)
- Network requests (no fetch, XMLHttpRequest)
- File I/O (no file system access)
- Module imports (from other files)
- setTimeout/setInterval (with callback)
- External package imports (initially)

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | New line (in editor) |
| Ctrl+Enter | Execute code (if configured) |
| Tab | Indent |
| Shift+Tab | Outdent |

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |

---

## Resources

- **Full Documentation:** WASM_EXECUTION.md
- **Pyodide:** https://pyodide.org/
- **Web Workers:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
- **Tests:** frontend/__tests__/wasmExecution.test.js

---

**Status:** ✅ Ready to Use
**Version:** 1.0.0
**Languages:** JavaScript, Python
**Security:** 100% Browser-Based
**Last Updated:** December 8, 2025
