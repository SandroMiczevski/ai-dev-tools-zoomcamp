# 🎨 Syntax Highlighting Guide

## Overview

Your coding interview platform now features enhanced syntax highlighting for **JavaScript** and **Python** with support for 8 additional languages.

## Supported Languages

| Language | Icon | File Extension | Aliases |
|----------|------|-----------------|---------|
| JavaScript | ⚡ | .js, .jsx, .mjs | js, jsx, mjs |
| Python | 🐍 | .py, .pyw | py, pyw |
| Java | ☕ | .java | java |
| C++ | ⚙️ | .cpp, .cc, .cxx, .h | cpp, cc, cxx |
| C# | #️⃣ | .cs | cs, csharp |
| Ruby | 💎 | .rb | rb, ruby |
| Go | 🐹 | .go | go, golang |
| Rust | 🦀 | .rs | rs, rust |
| PHP | 🐘 | .php | php, php3, php4, php5 |

## Features

### 🔍 Syntax Highlighting
- **Real-time highlighting** as you type
- **Color-coded tokens** (keywords, strings, functions, variables)
- **Dark theme** (atom-one-dark) for comfortable coding
- **Line-by-line synchronization** with transparent textarea overlay

### 🚀 Language Support
- **10 languages** with auto-completion patterns
- **Language detection** from code content
- **Language switching** via dropdown selector with icons

### ✨ Enhanced Features
- **Language icons** for quick visual identification
- **Line numbering** for easy reference
- **Code formatting** utilities
- **Error handling** with fallback to plaintext

## How It Works

### Architecture

```
CodeEditor Component
    ↓
    Uses: syntaxHighlighting utility module
    ↓
    ├─ highlightCode()        - Main highlighting function
    ├─ isValidLanguage()      - Language validation
    ├─ detectLanguage()       - Auto-detection
    ├─ getLanguageConfig()    - Language metadata
    ├─ formatCode()           - Code formatting
    └─ getSupportedLanguages() - Language list
```

### Rendering Process

1. **User types code** in transparent textarea
2. **onChange event** triggers `onCodeChange()`
3. **Highlight component** updates with new highlighted code
4. **Both layers scroll together** (textarea scroll triggers highlight scroll)
5. **User sees highlighted code** through transparent textarea

### Textarea Overlay Technique

```
┌─────────────────────────────────┐
│  Textarea (transparent, z=1)    │
│  - User types here              │
│  - Shows cursor                 │
│  - Input events trigger updates │
└─────────────────────────────────┘
          ↕ (synchronized scroll)
┌─────────────────────────────────┐
│  Pre/Code (z=0, behind)         │
│  - Shows highlighted code       │
│  - Styles applied by hljs       │
│  - Can't be edited              │
└─────────────────────────────────┘
```

## JavaScript Highlighting

### Examples

#### Basic Code
```javascript
// Variables
const name = 'John';
let age = 25;
var city = 'New York';

// Functions
function greet(person) {
  return `Hello, ${person}!`;
}

// Arrow Functions
const add = (a, b) => a + b;

// Classes
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

// Async/Await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

### Auto-Detection Patterns for JavaScript

The system automatically detects JavaScript when code contains:
- `const`, `let`, or `var` declarations
- `function` keyword
- `class` keyword
- Arrow function syntax `=>`
- `async`/`await` keywords

## Python Highlighting

### Examples

#### Basic Code
```python
# Comments
"""
Multi-line docstring
Used for documentation
"""

# Variables
name = 'Alice'
age = 30
items = [1, 2, 3, 4, 5]

# Functions
def greet(person):
    return f'Hello, {person}!'

# Classes
class Person:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        print(f'Hi, I\'m {self.name}')

# List comprehension
squares = [x**2 for x in range(10)]

# If/Else
if age > 18:
    print('Adult')
else:
    print('Minor')

# For loop
for i in range(5):
    print(i)

# Exception handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print('Cannot divide by zero')
finally:
    print('Done')
```

### Auto-Detection Patterns for Python

The system automatically detects Python when code contains:
- `import` or `from...import` statements
- `def` function definitions
- `class` definitions
- `if __name__ == '__main__':`

## Using the Syntax Highlighting Utilities

### In Components

```javascript
import { highlightCode, getSupportedLanguages, detectLanguage } from '../utils/syntaxHighlighting';

// Highlight code
const highlightedHTML = highlightCode('const x = 5;', 'javascript');

// Get all languages
const languages = getSupportedLanguages();
// Returns: [{ id: 'javascript', name: 'JavaScript', icon: '⚡', ... }, ...]

// Detect language
const detectedLang = detectLanguage('def hello(): pass');
// Returns: 'python'
```

### API Functions

#### highlightCode(code, language)
Highlights code with the specified language.

```javascript
const html = highlightCode('print("Hello")', 'python');
```

#### getSupportedLanguages()
Returns array of supported language objects.

```javascript
const langs = getSupportedLanguages();
// [
//   { id: 'javascript', name: 'JavaScript', icon: '⚡', ... },
//   { id: 'python', name: 'Python', icon: '🐍', ... },
//   ...
// ]
```

#### getLanguageConfig(language)
Returns metadata for a specific language.

```javascript
const config = getLanguageConfig('python');
// { name: 'Python', icon: '🐍', aliases: ['py'], extensions: ['.py'] }
```

#### detectLanguage(code)
Auto-detects language from code content.

```javascript
const lang = detectLanguage('import os\nprint("hello")');
// Returns: 'python'
```

#### isValidLanguage(language)
Checks if a language is supported by highlight.js.

```javascript
const valid = isValidLanguage('javascript');
// Returns: true
```

#### formatCode(code, indentSize)
Formats code with consistent indentation.

```javascript
const formatted = formatCode('x=1\n y=2', 2);
// Normalizes indentation
```

## Theme

The editor uses the **atom-one-dark** theme from highlight.js:
- Dark background (#282c34)
- Light text (#abb2bf)
- Color-coded tokens
- Comfortable for extended coding sessions

### Theme Colors

- **Keywords**: #c678dd (purple)
- **Strings**: #98c379 (green)
- **Numbers**: #d19a66 (orange)
- **Comments**: #5c6370 (gray)
- **Functions**: #61afef (blue)
- **Background**: #282c34 (dark gray)

## CSS Classes Applied by highlight.js

The highlighted code receives CSS classes for styling:

```html
<!-- Example highlighted output -->
<code>
  <span class="hljs-keyword">const</span> 
  <span class="hljs-variable">x</span> 
  <span class="hljs-operator">=</span> 
  <span class="hljs-number">5</span>;
</code>
```

## File Structure

```
frontend/
├── components/
│   └── CodeEditor.js              (Updated with new highlighting)
├── utils/
│   └── syntaxHighlighting.js      (NEW - Core highlighting logic)
└── styles/
    └── CodeEditor.module.css      (Enhanced for highlighting)
```

## Performance Considerations

### Optimization Strategies

1. **Efficient Updates**: Only updates when code or language changes
2. **Error Handling**: Gracefully falls back to plaintext on errors
3. **Language Validation**: Prevents invalid language specifications
4. **Memoization Ready**: Can be wrapped with React.memo if needed

### Large Code Files

For very large code files (>10,000 lines):
- Consider code splitting
- Implement lazy highlighting
- Use virtual scrolling

## Common Issues

### Issue: Highlighting not showing
**Solution**: Ensure language is valid
```javascript
import { isValidLanguage } from '../utils/syntaxHighlighting';
if (!isValidLanguage(lang)) lang = 'javascript';
```

### Issue: Language not detected
**Solution**: Explicitly specify language in dropdown
- Auto-detection works for common patterns
- Specific language selection is more reliable

### Issue: Performance lag with large code
**Solution**: Consider implementing virtual scrolling or code limiting

## Examples

### JavaScript with Arrow Functions
```javascript
const double = (n) => n * 2;
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(double);
console.log(doubled);  // [2, 4, 6, 8, 10]
```

### Python with List Comprehension
```python
numbers = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in numbers]
print(doubled)  # [2, 4, 6, 8, 10]
```

### JavaScript Promise
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Done!');
  }, 1000);
});

promise.then(result => console.log(result));
```

### Python Async/Await
```python
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return 'Done!'

result = asyncio.run(fetch_data())
print(result)
```

## Testing Highlighting

To test the highlighting:

1. **Open the application**: http://localhost:3000
2. **Paste JavaScript code** into the editor
3. **Verify colors** appear correctly
4. **Switch to Python** from dropdown
5. **Paste Python code** and verify highlighting
6. **Scroll** to ensure scroll synchronization
7. **Type** to verify real-time highlighting

## Future Enhancements

Potential improvements:
- [ ] Additional theme options (light, dracula, nord, solarized)
- [ ] Line highlighting for search results
- [ ] Bracket matching/highlighting
- [ ] Code folding
- [ ] Minimap view
- [ ] More language support (TypeScript, Kotlin, Swift)
- [ ] Custom theme editor
- [ ] Code snippets library

## Resources

- [Highlight.js Documentation](https://highlightjs.org/)
- [Supported Languages](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md)
- [CSS Classes Reference](https://highlightjs.org/api/highlightjs#css)

---

**Status**: ✅ Implemented and Ready
**Languages**: JavaScript, Python (+ 8 more)
**Last Updated**: December 8, 2025
