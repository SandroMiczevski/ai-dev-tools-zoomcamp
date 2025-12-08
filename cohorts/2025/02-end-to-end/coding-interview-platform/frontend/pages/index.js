import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/Index.module.css';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createSession = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions`
      );
      const { sessionId } = response.data;
      router.push(`/interview/${sessionId}`);
    } catch (err) {
      setError('Failed to create session. Make sure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            💻 Coding Interview Platform
          </h1>
          
          <p className={styles.description}>
            Real-time collaborative coding interviews with live syntax highlighting
            and code execution.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔗</span>
              <h3>Share a Link</h3>
              <p>Create a session and share the link with candidates</p>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>✏️</span>
              <h3>Real-time Collaboration</h3>
              <p>Edit code together with instant updates</p>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎨</span>
              <h3>Syntax Highlighting</h3>
              <p>Support for 9+ programming languages</p>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>▶️</span>
              <h3>Execute Code</h3>
              <p>Run and test code directly in the browser</p>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            onClick={createSession}
            disabled={loading}
            className={styles.createBtn}
          >
            {loading ? 'Creating...' : '🚀 Start Interview Session'}
          </button>
        </div>
      </main>
    </div>
  );
}
