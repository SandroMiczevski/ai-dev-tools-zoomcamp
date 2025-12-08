import React from 'react';
import styles from '../styles/Participants.module.css';

const Participants = ({ participants }) => {
  return (
    <div className={styles.container}>
      <h3>Participants ({participants.length})</h3>
      <div className={styles.list}>
        {participants.map((participant, index) => (
          <div key={index} className={styles.participant}>
            <span className={styles.avatar}>{participant.charAt(0).toUpperCase()}</span>
            <span className={styles.name}>{participant}</span>
            <span className={styles.status}>Online</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
