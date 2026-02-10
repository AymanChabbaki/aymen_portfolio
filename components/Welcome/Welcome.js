import { useEffect, useState } from "react";
import styles from "./Welcome.module.scss";

const Welcome = ({ onComplete }) => {
  const [currentWelcome, setCurrentWelcome] = useState(0);
  
  const welcomeMessages = [
    "Welcome", // English
    "Bienvenido", // Spanish
    "Bienvenue", // French
    "مرحبا", // Arabic
    "ようこそ", // Japanese
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWelcome((prev) => {
        if (prev < welcomeMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => onComplete(), 800);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.loader}>
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>
          <div className={styles.base}>
            <span />
            <div className={styles.face} />
          </div>
        </div>
        <div className={styles.welcomeText}>
          {welcomeMessages[currentWelcome]}
        </div>
      </div>
      <div>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Welcome;
