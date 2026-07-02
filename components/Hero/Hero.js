import { useEffect, useRef, useLayoutEffect, useState, useCallback } from "react";
import Image from "next/image";
import Typed from "typed.js";
import gsap from "gsap";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiSun, FiSunset, FiMoon, FiMapPin, FiClock } from "react-icons/fi";
import Button from "../Button/Button";
import Profiles from "../Profiles/Profiles";
import styles from "./Hero.module.scss";
import { MENULINKS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const ORBIT_BADGES = ["react", "python", "tensorflow"];
const STAR_COUNT = 18;

const GREETING_ICONS = {
  greetingMorning: FiSun,
  greetingAfternoon: FiSunset,
  greetingEvening: FiMoon,
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "greetingMorning";
  if (hour >= 12 && hour < 18) return "greetingAfternoon";
  return "greetingEvening";
};

const Hero = () => {
  const sectionRef = useRef(null);
  const typedElementRef = useRef(null);
  const typedInstanceRef = useRef(null);
  const { language } = useLanguage();
  const [localTime, setLocalTime] = useState("");
  const [greeting] = useState(getGreeting);
  const GreetingIcon = GREETING_ICONS[greeting];

  // Mouse parallax: layers drift at different depths as the cursor moves
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const orb1X = useTransform(smoothX, (v) => v * 60);
  const orb1Y = useTransform(smoothY, (v) => v * 60);
  const orb2X = useTransform(smoothX, (v) => v * -45);
  const orb2Y = useTransform(smoothY, (v) => v * -45);
  const portraitX = useTransform(smoothX, (v) => v * -18);
  const portraitY = useTransform(smoothY, (v) => v * -12);

  const handleMouseMove = useCallback(
    (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    },
    [mouseX, mouseY]
  );

  const getTypedStrings = () => [
    getTranslation(language, "typedString1"),
    getTranslation(language, "typedString2"),
    getTranslation(language, "typedString3"),
    getTranslation(language, "typedString4"),
    getTranslation(language, "typedString5"),
    getTranslation(language, "typedString6"),
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(sectionRef.current, { opacity: 1, duration: 0.6 })
        .from(
          sectionRef.current.querySelectorAll(".staggered-reveal"),
          { opacity: 0, y: 16, duration: 0.6, stagger: 0.12 },
          "<"
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typedInstanceRef.current) {
      typedInstanceRef.current.destroy();
    }

    typedInstanceRef.current = new Typed(typedElementRef.current, {
      strings: getTypedStrings(),
      typeSpeed: 50,
      startDelay: 1500,
      backSpeed: 50,
      backDelay: 8000,
      loop: true,
    });

    return () => {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, [typedElementRef, language]);

  // Live local clock (Casablanca)
  useEffect(() => {
    const update = () =>
      setLocalTime(
        new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())
      );

    update();
    const intervalId = setInterval(update, 30000);
    return () => clearInterval(intervalId);
  }, [language]);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[0].ref}
      onMouseMove={handleMouseMove}
      className="w-full flex md:items-center py-8 2xl:container mx-auto xl:px-20 md:px-12 px-4 lg:min-h-screen relative mb-24"
      style={{ opacity: 0 }}
    >
      <style global jsx>
        {`
          .typed-cursor {
            font-size: 2rem;
          }
        `}
      </style>

      {/* Twinkling particles */}
      <div className={styles.stars} aria-hidden="true">
        {[...Array(STAR_COUNT)].map((_, i) => (
          <span key={i} />
        ))}
      </div>

      {/* Parallax gradient orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-indigo-light/5 rounded-full blur-3xl"
        style={{ x: orb1X, y: orb1Y }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-purple/5 rounded-full blur-3xl"
        style={{ x: orb2X, y: orb2Y }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="flex flex-col pt-40 md:pt-0 select-none relative z-10">
        <p className="staggered-reveal flex items-center gap-2 font-mono text-sm text-gray-light-3">
          <GreetingIcon className="text-indigo-light w-4 h-4" />
          {getTranslation(language, greeting)}
        </p>
        <h5
          className={`${styles.intro} staggered-reveal font-mono font-medium text-indigo-light mt-2`}
        >
          {getTranslation(language, "hiMyNameIs")}
        </h5>
        <h1
          className={`${styles.heroName} staggered-reveal text-white text-6xl font-semibold`}
        >
          <span className={`relative ${styles.emphasize} inline-block`}>
            Ayman
          </span>
          <span className="inline-block"> Chabbaki</span>
        </h1>
        <p className="staggered-reveal">
          <span
            ref={typedElementRef}
            className="text-3xl text-gray-light-3 font-mono leading-relaxed"
          />
        </p>

        {/* Live status: availability, location, local time */}
        <div className="staggered-reveal flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 font-mono text-sm text-gray-light-3">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green/40 bg-green/10 text-white">
            <span className="w-2 h-2 rounded-full bg-green pulse-dot" />
            {getTranslation(language, "availableForWork")}
          </span>
          <span className="flex items-center gap-1.5">
            <FiMapPin className="text-indigo-light w-4 h-4" />
            {getTranslation(language, "basedIn")}
          </span>
          {localTime && (
            <span className="flex items-center gap-1.5" suppressHydrationWarning>
              <FiClock className="text-indigo-light w-4 h-4" />
              {localTime} · {getTranslation(language, "localTime")}
            </span>
          )}
        </div>

        <div className="staggered-reveal">
          <Profiles />
        </div>
        <div className="staggered-reveal pt-4 flex flex-wrap items-center gap-4">
          <Button href={`#${MENULINKS[4].ref}`} classes="link" type="primary">
            {getTranslation(language, "letsTalk")}
          </Button>
          <Button href={`#${MENULINKS[2].ref}`} classes="link" type="secondary">
            {getTranslation(language, "viewProjects")}
          </Button>
        </div>
      </div>

      {/* Living portrait: morphing blob, breathing glow, orbiting tech badges */}
      <motion.div
        style={{ x: portraitX, y: portraitY }}
        className="absolute hidden lg:block lg:right-12 2xl:right-24 bottom-16 mobile-hide"
      >
        <div className={styles.portraitWrapper}>
          <div className={styles.portraitGlow} aria-hidden="true" />
          <div className={`${styles.portraitBlob} relative w-80 h-80 overflow-hidden`}>
            <Image
              src="/me.jpeg"
              alt="Ayman Chabbaki"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div aria-hidden="true">
            {ORBIT_BADGES.map((badge, i) => (
              <span
                key={badge}
                className={styles.orbitBadge}
                style={{ animationDelay: `${(-22 / ORBIT_BADGES.length) * i}s` }}
              >
                <Image
                  src={`/skills/${badge}.svg`}
                  alt={badge}
                  width={26}
                  height={26}
                />
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <a
        href={`#${MENULINKS[1].ref}`}
        aria-label="Scroll down"
        className={`${styles.scrollIndicator} link staggered-reveal hidden md:flex`}
      >
        <span className={styles.mouse}>
          <span />
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-gray-light-3">
          {getTranslation(language, "scrollDown")}
        </span>
      </a>
    </section>
  );
};

export default Hero;
