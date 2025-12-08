import React, { useState, useEffect } from 'react';
import styles from '../styles/OutputPanel.module.css';

const OutputPanel = ({ output, isLoading, error }) => {
  return (
    <div className={styles.container}>
      <h2>Output</h2>
      <div className={styles.output}>
        {isLoading && <div className={styles.loading}>Executing...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!isLoading && output && !error && (
          <pre className={styles.text}>{output}</pre>
        )}
        {!isLoading && !output && !error && (
          <div className={styles.placeholder}>Output will appear here</div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
