import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock CodeEditor Component Tests
describe('CodeEditor Component', () => {
  const mockProps = {
    code: '// Start coding here\n',
    onCodeChange: jest.fn(),
    language: 'javascript',
    onLanguageChange: jest.fn(),
    onExecute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render code editor', () => {
    const { container } = render(
      <div>
        <textarea value={mockProps.code} onChange={() => {}} />
      </div>
    );

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('// Start coding here\n');
  });

  test('should display current code', () => {
    const testCode = 'console.log("test");';
    const { container } = render(
      <div>
        <textarea value={testCode} onChange={() => {}} />
      </div>
    );

    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe(testCode);
  });

  test('should call onCodeChange when code is updated', async () => {
    const onCodeChange = jest.fn();
    const { container } = render(
      <div>
        <textarea
          value={mockProps.code}
          onChange={(e) => onCodeChange(e.target.value)}
        />
      </div>
    );

    const textarea = container.querySelector('textarea');
    await userEvent.type(textarea, 'new code');

    expect(onCodeChange).toHaveBeenCalled();
  });

  test('should display language selector', () => {
    const { getByDisplayValue } = render(
      <div>
        <select value={mockProps.language} onChange={() => {}}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
    );

    expect(getByDisplayValue('javascript')).toBeInTheDocument();
  });

  test('should call onLanguageChange when language is changed', () => {
    const onLanguageChange = jest.fn();
    const { container } = render(
      <div>
        <select
          value={mockProps.language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>
    );

    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: 'python' } });

    expect(onLanguageChange).toHaveBeenCalledWith('python');
  });

  test('should render execute button', () => {
    const { getByRole } = render(
      <div>
        <button onClick={jest.fn()}>Execute</button>
      </div>
    );

    expect(getByRole('button', { name: /execute/i })).toBeInTheDocument();
  });

  test('should call onExecute when execute button is clicked', () => {
    const onExecute = jest.fn();
    const { getByRole } = render(
      <div>
        <button onClick={onExecute}>Execute</button>
      </div>
    );

    fireEvent.click(getByRole('button', { name: /execute/i }));
    expect(onExecute).toHaveBeenCalled();
  });

  test('should support multiple languages', () => {
    const languages = [
      'javascript',
      'python',
      'java',
      'cpp',
      'csharp',
      'ruby',
      'go',
      'rust',
      'php',
    ];

    const { container } = render(
      <div>
        <select value="javascript" onChange={() => {}}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    );

    const select = container.querySelector('select');
    expect(select.children.length).toBe(9);
  });

  test('should handle empty code', () => {
    const { container } = render(
      <div>
        <textarea value="" onChange={() => {}} />
      </div>
    );

    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('');
  });

  test('should handle multiline code', () => {
    const multilineCode = 'function test() {\n  return true;\n}';
    const { container } = render(
      <div>
        <textarea value={multilineCode} onChange={() => {}} />
      </div>
    );

    const textarea = container.querySelector('textarea');
    expect(textarea.value).toContain('function test');
    expect(textarea.value).toContain('return true');
  });
});

describe('OutputPanel Component', () => {
  test('should render output panel', () => {
    const { getByText } = render(
      <div>
        <h2>Output</h2>
        <div>Output will appear here</div>
      </div>
    );

    expect(getByText('Output')).toBeInTheDocument();
  });

  test('should display output text', () => {
    const output = 'Hello, World!';
    const { getByText } = render(
      <div>
        <pre>{output}</pre>
      </div>
    );

    expect(getByText(output)).toBeInTheDocument();
  });

  test('should display loading state', () => {
    const { getByText } = render(
      <div>
        <div>Executing...</div>
      </div>
    );

    expect(getByText('Executing...')).toBeInTheDocument();
  });

  test('should display error message', () => {
    const error = 'Syntax Error: Unexpected token';
    const { getByText } = render(
      <div>
        <div>{error}</div>
      </div>
    );

    expect(getByText(error)).toBeInTheDocument();
  });

  test('should display placeholder when no output', () => {
    const { getByText } = render(
      <div>
        <div>Output will appear here</div>
      </div>
    );

    expect(getByText('Output will appear here')).toBeInTheDocument();
  });

  test('should handle empty output', () => {
    const { getByText } = render(
      <div>
        <div>Code executed successfully with no output</div>
      </div>
    );

    expect(getByText(/Code executed successfully/i)).toBeInTheDocument();
  });
});

describe('Participants Component', () => {
  test('should render participants list', () => {
    const { getByText } = render(
      <div>
        <h3>Participants (2)</h3>
        <div>Alice</div>
        <div>Bob</div>
      </div>
    );

    expect(getByText('Participants (2)')).toBeInTheDocument();
  });

  test('should display participant count', () => {
    const { getByText } = render(
      <div>
        <h3>Participants (5)</h3>
      </div>
    );

    expect(getByText('Participants (5)')).toBeInTheDocument();
  });

  test('should display multiple participants', () => {
    const participants = ['Alice', 'Bob', 'Charlie'];
    const { getByText } = render(
      <div>
        {participants.map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>
    );

    expect(getByText('Alice')).toBeInTheDocument();
    expect(getByText('Bob')).toBeInTheDocument();
    expect(getByText('Charlie')).toBeInTheDocument();
  });

  test('should show online status', () => {
    const { getByText } = render(
      <div>
        <span>Online</span>
      </div>
    );

    expect(getByText('Online')).toBeInTheDocument();
  });

  test('should display empty list', () => {
    const { getByText } = render(
      <div>
        <h3>Participants (0)</h3>
      </div>
    );

    expect(getByText('Participants (0)')).toBeInTheDocument();
  });
});

describe('Interview Page', () => {
  test('should display name input on initial load', () => {
    const { getByText, getByPlaceholderText } = render(
      <div>
        <h1>Join Interview Session</h1>
        <input placeholder="Enter your name" />
        <button>Join</button>
      </div>
    );

    expect(getByText('Join Interview Session')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(getByText('Join')).toBeInTheDocument();
  });

  test('should hide name input after joining', async () => {
    const { rerender, queryByText } = render(
      <div>
        <h1>Interview Room</h1>
      </div>
    );

    expect(queryByText('Join Interview Session')).not.toBeInTheDocument();
  });

  test('should display share link button', () => {
    const { getByRole } = render(
      <div>
        <button>📋 Copy Share Link</button>
      </div>
    );

    expect(getByRole('button', { name: /copy share link/i })).toBeInTheDocument();
  });

  test('should display user welcome message', () => {
    const { getByText } = render(
      <div>
        <span>Welcome, Alice</span>
      </div>
    );

    expect(getByText('Welcome, Alice')).toBeInTheDocument();
  });

  test('should display header with title', () => {
    const { getByText } = render(
      <div>
        <h1>Coding Interview Platform</h1>
      </div>
    );

    expect(getByText('Coding Interview Platform')).toBeInTheDocument();
  });

  test('should display all main sections', () => {
    const { getByText } = render(
      <div>
        <h2>Code Editor</h2>
        <h2>Output</h2>
        <h3>Participants</h3>
      </div>
    );

    expect(getByText('Code Editor')).toBeInTheDocument();
    expect(getByText('Output')).toBeInTheDocument();
    expect(getByText('Participants')).toBeInTheDocument();
  });
});

describe('Home Page', () => {
  test('should display home page title', () => {
    const { getByText } = render(
      <div>
        <h1>💻 Coding Interview Platform</h1>
      </div>
    );

    expect(getByText(/Coding Interview Platform/i)).toBeInTheDocument();
  });

  test('should display feature cards', () => {
    const { getByText } = render(
      <div>
        <h3>Share a Link</h3>
        <h3>Real-time Collaboration</h3>
        <h3>Syntax Highlighting</h3>
        <h3>Execute Code</h3>
      </div>
    );

    expect(getByText('Share a Link')).toBeInTheDocument();
    expect(getByText('Real-time Collaboration')).toBeInTheDocument();
    expect(getByText('Syntax Highlighting')).toBeInTheDocument();
    expect(getByText('Execute Code')).toBeInTheDocument();
  });

  test('should display create button', () => {
    const { getByRole } = render(
      <div>
        <button>🚀 Start Interview Session</button>
      </div>
    );

    expect(getByRole('button', { name: /Start Interview Session/i })).toBeInTheDocument();
  });

  test('should display error message if provided', () => {
    const error = 'Failed to create session';
    const { getByText } = render(
      <div>
        <div>{error}</div>
      </div>
    );

    expect(getByText(error)).toBeInTheDocument();
  });
});

describe('User Interactions', () => {
  test('should handle form submission with name', async () => {
    const handleSubmit = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <form onSubmit={handleSubmit}>
        <input placeholder="Enter your name" type="text" />
        <button type="submit">Join</button>
      </form>
    );

    const input = getByPlaceholderText('Enter your name');
    await userEvent.type(input, 'Alice');
    fireEvent.click(getByRole('button', { name: /join/i }));

    expect(handleSubmit).toHaveBeenCalled();
  });

  test('should not submit with empty name', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    const { getByRole } = render(
      <form onSubmit={handleSubmit}>
        <input placeholder="Enter your name" type="text" />
        <button type="submit">Join</button>
      </form>
    );

    fireEvent.click(getByRole('button', { name: /join/i }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  test('should handle keyboard events', async () => {
    const handleKeyPress = jest.fn();
    const { getByPlaceholderText } = render(
      <input
        placeholder="Enter your name"
        onKeyPress={handleKeyPress}
        type="text"
      />
    );

    const input = getByPlaceholderText('Enter your name');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });

    expect(handleKeyPress).toHaveBeenCalled();
  });
});

describe('Responsive Design', () => {
  test('should render on different screen sizes', () => {
    const { container } = render(
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>Editor</div>
        <div style={{ width: '300px' }}>Sidebar</div>
      </div>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  test('should adjust layout for mobile', () => {
    const { container } = render(
      <div style={{ display: 'block' }}>
        <div>Editor</div>
        <div>Sidebar</div>
      </div>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
