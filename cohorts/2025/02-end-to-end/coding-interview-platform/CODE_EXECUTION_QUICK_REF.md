# Code Execution Quick Reference

## Quick Start

### Run the Application
```bash
npm run dev          # Both frontend and backend
# OR separately:
npm run dev:frontend # Frontend only
npm run dev:backend  # Backend only
```

### Test Code Execution

1. Navigate to http://localhost:3000
2. Create/join an interview session
3. Select a language from dropdown (JavaScript, Python, Java, etc.)
4. Write code in the editor
5. Click "Execute" button
6. See output in OutputPanel

---

## Supported Languages

| Language | Syntax | Extension |
|----------|--------|-----------|
| JavaScript | `const x = 5;` | .js |
| Python | `x = 5` | .py |
| Java | `public class Main { }` | .java |
| C++ | `#include <iostream>` | .cpp |
| C# | `using System;` | .cs |
| Ruby | `def method; end` | .rb |
| Go | `func main() { }` | .go |
| Rust | `fn main() { }` | .rs |
| PHP | `<?php echo;` | .php |

---

## API Usage

### Execute Code
```javascript
import { executeCode } from '../utils/codeExecution';

const result = await executeCode(
  'console.log("Hello")',
  'javascript'
);

if (result.success) {
  console.log(result.output);  // "Hello\n"
} else {
  console.error(result.error);
}
```

### Get Supported Languages
```javascript
import { getSupportedLanguages } from '../utils/codeExecution';

const languages = await getSupportedLanguages();
// [{ id: 'javascript', name: 'JavaScript', ... }, ...]
```

### Check Empty Code
```javascript
import { isCodeEmpty } from '../utils/codeExecution';

isCodeEmpty('// Just comments');    // true
isCodeEmpty('console.log("hi")');   // false
```

---

## JavaScript Examples

### Hello World
```javascript
console.log('Hello, World!');
```

### Variables and Math
```javascript
const x = 10;
const y = 20;
console.log(x + y);  // 30
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
const sum = arr.reduce((a, b) => a + b, 0);
console.log(sum);  // 15
```

### Objects
```javascript
const person = {
  name: 'John',
  age: 30,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
person.greet();
```

### Classes
```javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  increment() {
    this.count++;
    console.log(this.count);
  }
}
const c = new Counter();
c.increment();  // 1
```

### Async/Await
```javascript
async function delay() {
  return new Promise(r => setTimeout(r, 100));
}
async function test() {
  await delay();
  console.log('Done!');
}
test();
```

---

## Python Examples

### Hello World
```python
print('Hello, World!')
```

### Variables and Math
```python
x = 10
y = 20
print(x + y)  # 30
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
total = sum(arr)
print(total)  # 15
```

### List Comprehension
```python
squares = [x**2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]
```

### Dictionaries
```python
person = {
    'name': 'John',
    'age': 30
}
print(f"Hello, I'm {person['name']}")
```

### Classes
```python
class Counter:
    def __init__(self):
        self.count = 0
    
    def increment(self):
        self.count += 1
        print(self.count)

c = Counter()
c.increment()  # 1
```

### File Operations
```python
# Read
with open('file.txt') as f:
    content = f.read()

# Write
with open('file.txt', 'w') as f:
    f.write('Hello')
```

### String Methods
```python
text = "Hello, World!"
print(text.upper())        # HELLO, WORLD!
print(text.lower())        # hello, world!
print(text.split(','))     # ['Hello', ' World!']
```

---

## Common Errors

### JavaScript Errors

**ReferenceError: x is not defined**
```javascript
// ❌ Wrong
console.log(y);

// ✅ Correct
const y = 5;
console.log(y);
```

**SyntaxError: Unexpected token**
```javascript
// ❌ Wrong
const x = 5

// ✅ Correct
const x = 5;
```

**TypeError: x is not a function**
```javascript
// ❌ Wrong
const x = 5;
x();

// ✅ Correct
const x = () => 5;
x();
```

### Python Errors

**IndentationError: expected an indented block**
```python
# ❌ Wrong
def hello():
print("hi")

# ✅ Correct
def hello():
    print("hi")
```

**NameError: name 'x' is not defined**
```python
# ❌ Wrong
print(y)

# ✅ Correct
y = 5
print(y)
```

**TypeError: unsupported operand type**
```python
# ❌ Wrong
x = "5" + 10

# ✅ Correct
x = int("5") + 10
```

---

## Performance Tips

### JavaScript
- Use `const` instead of `var` for block scope
- Use arrow functions for cleaner syntax
- Avoid deep nesting
- Use built-in methods (map, filter, reduce)

### Python
- Use list comprehensions for efficiency
- Avoid global variables
- Use f-strings for formatting
- Use built-in functions when possible

### General
- Avoid infinite loops (10s timeout)
- Keep algorithms efficient
- Use proper data structures
- Comment complex logic

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Backend Tests Only
```bash
npm test -- backend
```

### Run Frontend Tests Only
```bash
npm test -- frontend
```

### Run Specific Test File
```bash
npm test -- backend/__tests__/codeExecutor.test.js
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

---

## Configuration

### Change Execution Timeout
File: `backend/services/codeExecutor.js`
```javascript
const EXECUTION_TIMEOUT = 10000; // Change this value
```

### Change Output Limit
```javascript
const MAX_OUTPUT_LENGTH = 10000; // 10KB
```

### Add New Language
1. Update `LANGUAGE_CONFIG` in `codeExecutor.js`
2. Add language metadata
3. Update tests
4. Test execution

---

## Debugging

### Check Backend Logs
```bash
npm run dev:backend
# Look for console output
```

### Check Frontend Logs
```
F12 → Console tab → Look for errors
```

### Check Network Requests
```
F12 → Network tab → Look for /api/execute requests
```

### Common Issues

**"Cannot connect to backend"**
- Check backend is running
- Check API_URL in .env.local
- Check network connectivity

**"Code execution timed out"**
- Optimize the code
- Avoid infinite loops
- Break into smaller functions

**"Language not supported"**
- Check /api/languages endpoint
- Use one of the 9 supported languages

---

## Environment Variables

### Backend
```bash
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## File Structure
```
backend/
├── services/codeExecutor.js        (Code execution logic)
└── __tests__/codeExecutor.test.js  (Tests)

frontend/
├── utils/codeExecution.js          (Utilities)
├── pages/interview/[sessionId].js  (Integration)
└── __tests__/codeExecution.test.js (Tests)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Enter / Cmd+Enter | Execute code (if button is focused) |
| Tab | Indent code |
| Shift+Tab | Outdent code |

---

## Share Session

1. Click "📋 Copy Share Link" button
2. Share the link with others
3. Everyone joins the same session
4. Code execution is synchronized

---

## Resources

- **Documentation:** CODE_EXECUTION.md
- **API Reference:** CODE_EXECUTION.md → Backend API section
- **Examples:** See examples above
- **Tests:** `backend/__tests__/codeExecutor.test.js`
- **Frontend Utils:** `frontend/utils/codeExecution.js`

---

**Status:** ✅ Ready to Use
**Version:** 1.0.0
**Last Updated:** December 8, 2025
