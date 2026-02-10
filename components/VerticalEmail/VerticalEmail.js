import { motion } from "framer-motion";
import styles from "./VerticalEmail.module.scss";

const VerticalEmail = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      className={styles.verticalEmail}
    >
      <a
        href="mailto:aymanchabbaki09@gmail.com"
        className={styles.emailLink}
        aria-label="Email Ayman Chabbaki"
      >
        aymanchabbaki09@gmail.com
      </a>
      <div className={styles.line} />
    </motion.div>
  );
};

export default VerticalEmail;
