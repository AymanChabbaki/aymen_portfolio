import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProjectTile.module.scss";
import { PROJECT_IMAGES } from "../images";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getTranslation } from "../../../locales/translations";

const ProjectTile = ({ project, classes, isDesktop, index = 0, total = 0 }) => {
  const projectCard = useRef(null);
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const { name, imageKey, descriptionKey, modalKey, url, tech, modal: isModal, gradient } = project;
  const [accentFrom, accentTo] = gradient || ["#8b31ff", "#7000ff"];
  const indexLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  const image = PROJECT_IMAGES[imageKey];
  const description = getTranslation(language, descriptionKey);
  const modalDescription = modalKey ? getTranslation(language, modalKey) : null;

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

  const Wrapper = isModal ? motion.div : motion.a;
  const interactionProps = isModal
    ? {
        role: "button",
        tabIndex: 0,
        onClick: () => setShowModal(true),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") setShowModal(true);
        },
      }
    : { href: url, target: "_blank", rel: "noreferrer" };

  return (
    <>
    <Wrapper
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3 },
      }}
      onMouseMove={handleMouseMove}
      className={`overflow-hidden rounded-3xl snap-start link group ${
        isModal ? "cursor-pointer" : ""
      } ${additionalClasses}`}
      style={{
        maxWidth: isDesktop ? "calc(100vw - 2rem)" : "calc(100vw - 4rem)",
        flex: "1 0 auto",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)"
      }}
      {...interactionProps}
    >
      <div
        ref={projectCard}
        className={`${styles.projectTile} rounded-3xl relative flex flex-col justify-end max-w-full p-0`}
        style={{
          background: "none",
          height: "100%",
          width: "100%",
          "--accent-from": accentFrom,
          "--accent-to": accentTo,
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

        {/* Permanent bottom scrim so the title is always legible */}
        <div className={`${styles.scrim} absolute inset-0 z-10 rounded-3xl pointer-events-none`} />
        {/* Darker veil on hover */}
        <div className="absolute inset-0 z-10 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
        {/* Spotlight glow tinted with the project's own accent */}
        <div className={`${styles.spotlight} absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none`} />
        {/* Accent gradient border */}
        <div className={`${styles.accentBorder} absolute inset-0 z-30 rounded-3xl pointer-events-none`} />

        {/* Top row: index + action chip */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-5 pointer-events-none">
          <span className={`${styles.glassChip} font-mono text-xs tracking-widest text-white/90`}>
            {indexLabel}
            <span className="text-white/40">&nbsp;/ {totalLabel}</span>
          </span>
          <span
            className={`${styles.glassChip} ${styles.actionChip} flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white`}
          >
            {isModal ? "Details" : "Visit"}
            <span className={styles.arrow} aria-hidden="true">
              {isModal ? "+" : "↗"}
            </span>
          </span>
        </div>

        {/* Bottom content: title always visible, details slide up on hover */}
        <div className="relative z-20 flex flex-col justify-end h-full w-full p-6 pointer-events-none">
          <div className={styles.titleRow}>
            <span className={styles.accentBar} aria-hidden="true" />
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight drop-shadow-lg">
              {name}
            </h3>
          </div>
          <div className={styles.reveal}>
            <div>
              <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-2xl mt-3">
                {description}
              </p>
              <div className="flex flex-row gap-2 flex-wrap mt-4">
                {tech.map((el) => (
                  <span key={el} className={`${styles.glassChip} items-center gap-2 !py-1 !pl-1 !pr-3`}>
                    <Image
                      className="bg-white/90 rounded-md p-0.5"
                      src={`/projects/tech/${el}.svg`}
                      alt=""
                      height={22}
                      width={22}
                    />
                    <span className="text-xs text-white/90 capitalize">{el}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
    {isModal && (
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
              />
              <button
                type="button"
                aria-label="Close"
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold text-white mb-3 pr-8">
                {name}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {modalDescription}
              </p>
              <div className="flex flex-row gap-3 flex-wrap mt-5">
                {tech.map((el) => (
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )}
    </>
  );
};

export default ProjectTile;
