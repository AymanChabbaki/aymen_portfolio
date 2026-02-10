import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "../../constants";
import { Icon } from "@/components/Icons";
import styles from "./Profiles.module.scss";

const Profiles = () => {
  return (
    <div className={styles.profile}>
      {SOCIAL_LINKS &&
        SOCIAL_LINKS.map(({ name, url }, index) => (
          <motion.a
            href={url}
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.2, 
              y: -5,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            className="link"
            rel="noreferrer"
            target="_blank"
            aria-label={name}
          >
            <Icon name={name} />
          </motion.a>
        ))}
    </div>
  );
};

export default Profiles;
