import { useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./ProjectTile.module.scss";
import { PROJECT_IMAGES } from "../images";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getTranslation } from "../../../locales/translations";

const ProjectTile = ({ project, classes, isDesktop }) => {
  const projectCard = useRef(null);
  const { language } = useLanguage();

  const { name, imageKey, descriptionKey, url, tech } = project;

  const image = PROJECT_IMAGES[imageKey];
  const description = getTranslation(language, descriptionKey);

  let additionalClasses = "";
  if (classes) {
    additionalClasses = classes;
  }

  // Cursor-following spotlight glow
  const handleMouseMove = useCallback((e) => {
    const card = projectCard.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <motion.a
      href={url}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3 },
      }}
      onMouseMove={handleMouseMove}
      className={`overflow-hidden rounded-3xl snap-start link group ${additionalClasses}`}
      target="_blank"
      rel="noreferrer"
      style={{
        maxWidth: isDesktop ? "calc(100vw - 2rem)" : "calc(100vw - 4rem)",
        flex: "1 0 auto",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)"
      }}
    >
      <div
        ref={projectCard}
        className={`${styles.projectTile} rounded-3xl relative flex flex-col justify-end max-w-full p-0 border border-transparent group-hover:border-indigo-light/40 transition-colors duration-300`}
        style={{
          background: "none",
          height: "100%",
          width: "100%"
        }}
      >
        {image && (
          <Image
            src={image}
            alt={name}
            placeholder="blur"
            fill
            className={styles.projectImage}
            style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: "1.5rem", objectFit: "cover" }}
          />
        )}
        {/* Overlay for dark smoke, appears only on hover */}
        <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
        {/* Spotlight glow that follows the cursor */}
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(139, 49, 255, 0.25), transparent 65%)",
          }}
        />
        <div className="relative z-20 flex flex-col justify-end h-full w-full p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <h2 className="text-lg tracking-wide font-semibold text-white drop-shadow-md bg-black/70 rounded-xl px-4 py-2 mb-4 w-fit self-start shadow-lg">
            {description}
          </h2>
          <div className="flex flex-row gap-3 flex-wrap">
            {tech.map((el, i) => (
              <Image
                className="bg-white/80 rounded-lg p-1 shadow-md"
                src={`/projects/tech/${el}.svg`}
                alt={el}
                height={32}
                width={32}
                key={el}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default ProjectTile;
