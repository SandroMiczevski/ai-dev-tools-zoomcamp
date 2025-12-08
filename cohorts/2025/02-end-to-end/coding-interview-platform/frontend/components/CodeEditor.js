import React, { useState, useEffect, useRef } from 'react';
import 'highlight.js/styles/atom-one-dark.css';
import { highlightCode, getSupportedLanguages, getLanguageConfig } from '../utils/syntaxHighlighting';
import styles from '../styles/CodeEditor.module.css';

const CodeEditor = ({ code, onCodeChange, language, onLanguageChange, onExecute }) => {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightRef.current && code) {
      highlightRef.current.innerHTML = highlightCode(code, language);
    }
  }, [code, language]);

  const handleScroll = (e) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.target.scrollTop;
      highlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleCodeChange = (e) => {
    onCodeChange(e.target.value);
  };

  const languages = getSupportedLanguages();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Code Editor</h2>
        <div className={styles.controls}>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className={styles.languageSelect}
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>
          <button onClick={onExecute} className={styles.executeBtn}>
            Execute
          </button>
        </div>
      </div>

      <div className={styles.editorWrapper}>
        <div className={styles.lineNumbers}>
          {code.split('\n').map((_, i) => (
            <div key={i} className={styles.lineNumber}>
              {i + 1}
            </div>
          ))}
        </div>

        <div className={styles.editorContainer}>
          <pre className={styles.highlight} ref={highlightRef}>
            <code>{code}</code>
          </pre>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onScroll={handleScroll}
            className={styles.textarea}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
