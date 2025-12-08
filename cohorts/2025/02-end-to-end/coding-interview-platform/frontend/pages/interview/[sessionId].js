import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import axios from 'axios';
import CodeEditor from '../../components/CodeEditor';
import OutputPanel from '../../components/OutputPanel';
import Participants from '../../components/Participants';
import styles from '../../styles/Interview.module.css';

const Interview = () => {
  const router = useRouter();
  const { sessionId } = router.query;
  const [code, setCode] = useState('// Start coding here\n');
  const [language, setLanguage] = useState('javascript');
  const [participants, setParticipants] = useState([]);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const socketRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!sessionId) return;

    socketRef.current = io(API_URL);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId, API_URL]);

  const handleJoinSession = (name) => {
    if (!name.trim()) return;
    
    setUserName(name);
    setShowNameInput(false);

    if (socketRef.current) {
      socketRef.current.emit('join_session', {
        sessionId,
        userName: name,
      });

      socketRef.current.on('sync_code', (data) => {
        setCode(data.code);
        setLanguage(data.language);
      });

      socketRef.current.on('code_changed', (data) => {
        setCode(data.code);
      });

      socketRef.current.on('language_changed', (data) => {
        setLanguage(data.language);
      });

      socketRef.current.on('participants_list', (list) => {
        setParticipants(list);
      });

      socketRef.current.on('user_joined', (data) => {
        console.log(`${data.userName} joined`);
      });

      socketRef.current.on('user_left', (data) => {
        console.log('User left');
      });

      socketRef.current.on('error', (err) => {
        setError(err);
      });
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socketRef.current) {
      socketRef.current.emit('code_update', {
        sessionId,
        code: newCode,
      });
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (socketRef.current) {
      socketRef.current.emit('language_change', {
        sessionId,
        language: newLanguage,
      });
    }
  };

  const executeCode = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language === 'csharp' ? 'csharp' : language === 'cpp' ? 'cpp' : language,
          version: '*',
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: code,
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.run && result.run.output) {
        setOutput(result.run.output);
      } else if (result.run && result.run.stderr) {
        setError(result.run.stderr);
      } else {
        setOutput('Code executed successfully with no output');
      }
    } catch (err) {
      setError(`Execution error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      php: 'php',
    };
    return extensions[lang] || 'txt';
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/interview/${sessionId}`;
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  if (showNameInput) {
    return (
      <div className={styles.nameInputContainer}>
        <div className={styles.nameInputBox}>
          <h1>Join Interview Session</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className={styles.nameInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleJoinSession(e.target.value);
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = document.querySelector(`.${styles.nameInput}`);
              handleJoinSession(input.value);
            }}
            className={styles.joinBtn}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Coding Interview Platform</h1>
          <button onClick={copyShareLink} className={styles.shareBtn}>
            📋 Copy Share Link
          </button>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>Welcome, {userName}</span>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.editorSection}>
          <CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            onExecute={executeCode}
          />
        </div>

        <div className={styles.sidePanel}>
          <OutputPanel
            output={output}
            isLoading={isLoading}
            error={error}
          />
          <Participants participants={participants} />
        </div>
      </div>
    </div>
  );
};

export default Interview;
