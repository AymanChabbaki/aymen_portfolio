import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProjectTile.module.scss";
import { PROJECT_IMAGES } from "../images";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getTranslation } from "../../../locales/translations";

const ProjectTile = ({ project, classes, isDesktop }) => {
  const projectCard = useRef(null);
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const { name, imageKey, descriptionKey, modalKey, url, tech, modal: isModal } = project;

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
              className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
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
