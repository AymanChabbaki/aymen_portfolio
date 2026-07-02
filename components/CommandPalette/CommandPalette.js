import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaHome,
  FaCode,
  FaFolderOpen,
  FaBriefcase,
  FaCommentDots,
  FaLanguage,
  FaCopy,
  FaCheck,
  FaFileDownload,
} from "react-icons/fa";
import { MENULINKS, SOCIAL_LINKS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const EMAIL = "aymanchabbaki09@gmail.com";

const NAV_ICONS = {
  home: <FaHome />,
  skills: <FaCode />,
  projects: <FaFolderOpen />,
  work: <FaBriefcase />,
  contact: <FaEnvelope />,
  feedback: <FaCommentDots />,
};

const SOCIAL_ICONS = {
  mail: <FaEnvelope />,
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  instagram: <FaInstagram />,
  twitter: <FaTwitter />,
};

const CommandPalette = () => {
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
    setCopied(false);
  }, []);

  const copyEmail = useCallback(() => {
    const done = () => {
      setCopied(true);
      setTimeout(() => close(), 900);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(done);
    } else {
      done();
    }
  }, [close]);

  const downloadResume = useCallback(() => {
    const link = document.createElement("a");
    link.href = language === "fr" ? "/fr.pdf" : "/us.pdf";
    link.download =
      language === "fr" ? "CV_Ayman_Chabbaki.pdf" : "Resume_Ayman_Chabbaki.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    close();
  }, [language, close]);

  const commands = useMemo(() => {
    const navigation = MENULINKS.map(({ ref }) => ({
      group: getTranslation(language, "paletteNavigation"),
      label: getTranslation(language, ref),
      icon: NAV_ICONS[ref],
      keywords: ref,
      run: () => {
        close();
        document
          .getElementById(ref)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }));

    const actions = [
      {
        group: getTranslation(language, "paletteActions"),
        label: getTranslation(language, "cmdToggleLang"),
        icon: <FaLanguage />,
        keywords: "language langue english français fr en",
        keepOpen: true,
        run: () => toggleLanguage(),
      },
      {
        group: getTranslation(language, "paletteActions"),
        label: copied
          ? getTranslation(language, "cmdCopied")
          : getTranslation(language, "cmdCopyEmail"),
        icon: copied ? <FaCheck className="text-green" /> : <FaCopy />,
        keywords: "email mail copy copier",
        keepOpen: true,
        run: copyEmail,
      },
      {
        group: getTranslation(language, "paletteActions"),
        label: getTranslation(language, "cmdDownloadCV"),
        icon: <FaFileDownload />,
        keywords: "cv resume download télécharger pdf",
        run: downloadResume,
      },
    ];

    const socials = SOCIAL_LINKS.filter(({ name }) => name !== "mail").map(
      ({ name, url }) => ({
        group: getTranslation(language, "paletteSocials"),
        label: name.charAt(0).toUpperCase() + name.slice(1),
        icon: SOCIAL_ICONS[name],
        keywords: `social ${name}`,
        run: () => {
          close();
          window.open(url, "_blank", "noopener,noreferrer");
        },
      })
    );

    return [...navigation, ...actions, ...socials];
  }, [language, copied, close, copyEmail, downloadResume, toggleLanguage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.keywords.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Global shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((open) => {
          if (open) {
            setQuery("");
            setActiveIndex(0);
            setCopied(false);
          }
          return !open;
        });
      }
    };
    const onOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  // Focus input + lock scroll while open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the active row visible
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.run();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[15vh] bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-xl rounded-2xl border border-gray-dark-1 bg-gray-dark-4/95 backdrop-blur-xl shadow-2xl shadow-indigo-dark/20 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 border-b border-gray-dark-1">
              <span className="text-gray-light-4 font-mono">›</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={getTranslation(language, "palettePlaceholder")}
                className="w-full py-4 bg-transparent text-white placeholder-gray-light-4 outline-none font-mono text-sm"
              />
              <kbd className="flex-none px-2 py-1 text-xs font-mono rounded bg-gray-dark-2 text-gray-light-3 border border-gray-dark-1">
                esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-gray-light-4 font-mono text-sm">
                  {getTranslation(language, "paletteNoResults")}
                </p>
              ) : (
                filtered.map((cmd, index) => {
                  const showGroup = cmd.group !== lastGroup;
                  lastGroup = cmd.group;
                  return (
                    <div key={`${cmd.group}-${cmd.label}`}>
                      {showGroup && (
                        <p className="px-4 pt-3 pb-1 text-xs font-mono uppercase tracking-widest text-gray-light-4">
                          {cmd.group}
                        </p>
                      )}
                      <button
                        type="button"
                        data-index={index}
                        onClick={() => cmd.run()}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          index === activeIndex
                            ? "bg-indigo-dark/25 text-white"
                            : "text-gray-light-2"
                        }`}
                      >
                        <span
                          className={`flex-none ${
                            index === activeIndex
                              ? "text-indigo-light"
                              : "text-gray-light-4"
                          }`}
                        >
                          {cmd.icon}
                        </span>
                        {cmd.label}
                        {index === activeIndex && (
                          <span className="ml-auto font-mono text-xs text-gray-light-4">
                            ↵
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-dark-1 text-xs font-mono text-gray-light-4">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-dark-2 border border-gray-dark-1">↑↓</kbd>{" "}
                {getTranslation(language, "paletteHintNavigate")}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-dark-2 border border-gray-dark-1">↵</kbd>{" "}
                {getTranslation(language, "paletteHintSelect")}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-dark-2 border border-gray-dark-1">esc</kbd>{" "}
                {getTranslation(language, "paletteHintClose")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
