/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import { PROJECTS, SKILLS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const GITHUB_USERNAME = "AymanChabbaki";
const CODING_SINCE = 2022;

const cardReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

const Bento = () => {
  const { language } = useLanguage();
  const [localTime, setLocalTime] = useState("");

  const techCount = new Set(Object.values(SKILLS).flat()).size;
  const yearsCoding = Math.max(new Date().getFullYear() - CODING_SINCE, 1);

  useEffect(() => {
    const update = () =>
      setLocalTime(
        new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())
      );

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [language]);

  const stats = [
    { value: `${PROJECTS.length}+`, label: "bentoStatsProjects" },
    { value: `${techCount}+`, label: "bentoStatsTech" },
    { value: yearsCoding, label: "bentoStatsYears" },
  ];

  const spokenLanguages = [
    { flag: "🇲🇦", key: "bentoLangAr" },
    { flag: "🇫🇷", key: "bentoLangFr" },
    { flag: "🇬🇧", key: "bentoLangEn" },
  ];

  return (
    <section className="w-full relative select-none section-container py-16">
      <div className="flex flex-col mb-10">
        <p className="uppercase tracking-widest text-gray-light-1">
          {getTranslation(language, "bentoLabel")}
        </p>
        <h1 className="text-6xl mt-2 font-medium text-gradient w-fit">
          {getTranslation(language, "bentoTitle")}
        </h1>
        <h2 className="text-[1.65rem] font-medium md:max-w-lg w-full mt-2">
          {getTranslation(language, "bentoSubtitle")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
        {/* GitHub contributions */}
        <motion.div {...cardReveal} transition={{ duration: 0.5 }} className="md:col-span-2">
          <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="font-mono text-sm uppercase tracking-widest text-gray-light-3">
                {getTranslation(language, "bentoGithubTitle")}
              </h3>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="link font-mono text-sm text-indigo-light hover:text-white transition-colors"
              >
                @{GITHUB_USERNAME} ↗
              </a>
            </div>
            <img
              src={`https://ghchart.rshah.org/8b31ff/${GITHUB_USERNAME}`}
              alt={`GitHub contributions of ${GITHUB_USERNAME}`}
              loading="lazy"
              className="w-full relative z-10"
            />
          </SpotlightCard>
        </motion.div>

        {/* Local time & location */}
        <motion.div {...cardReveal} transition={{ duration: 0.5, delay: 0.1 }}>
          <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col justify-between gap-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-gray-light-3 relative z-10">
              {getTranslation(language, "localTime")}
            </h3>
            <div className="relative z-10">
              <p
                className="text-4xl font-semibold text-white font-mono"
                suppressHydrationWarning
              >
                {localTime || "—"}
              </p>
              <p className="text-gray-light-3 mt-2">
                📍 {getTranslation(language, "basedIn")} · GMT+1
              </p>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Stats */}
        <motion.div {...cardReveal} transition={{ duration: 0.5, delay: 0.2 }}>
          <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col justify-center gap-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-3 relative z-10">
                <span className="text-3xl font-semibold text-gradient font-mono">
                  {value}
                </span>
                <span className="text-gray-light-3 text-sm">
                  {getTranslation(language, label)}
                </span>
              </div>
            ))}
          </SpotlightCard>
        </motion.div>

        {/* Currently */}
        <motion.div {...cardReveal} transition={{ duration: 0.5, delay: 0.1 }}>
          <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col gap-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-gray-light-3 relative z-10">
              {getTranslation(language, "bentoCurrently")}
            </h3>
            <div className="flex flex-col gap-3 relative z-10">
              <p className="flex items-start gap-2 text-white">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-green pulse-dot flex-none" />
                {getTranslation(language, "currentlyStudying")}
              </p>
              <p className="flex items-start gap-2 text-white">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-light flex-none" />
                {getTranslation(language, "buildingAt")}
              </p>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Languages */}
        <motion.div {...cardReveal} transition={{ duration: 0.5, delay: 0.2 }}>
          <SpotlightCard className="rounded-2xl p-6 h-full flex flex-col gap-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-gray-light-3 relative z-10">
              {getTranslation(language, "bentoLanguagesTitle")}
            </h3>
            <div className="flex flex-col gap-2 relative z-10">
              {spokenLanguages.map(({ flag, key }) => (
                <p key={key} className="text-white">
                  {flag} {getTranslation(language, key)}
                </p>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Availability CTA */}
        <motion.div
          {...cardReveal}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2"
        >
          <SpotlightCard
            as="a"
            href="#contact"
            className="link rounded-2xl p-6 h-full flex flex-col justify-between gap-4 group"
          >
            <div className="flex items-center gap-3 relative z-10">
              <span className="w-3 h-3 rounded-full bg-green pulse-dot flex-none" />
              <h3 className="text-2xl font-semibold text-white">
                {getTranslation(language, "bentoAvailability")}
              </h3>
            </div>
            <div className="flex items-end justify-between gap-4 relative z-10">
              <p className="text-gray-light-3">
                {getTranslation(language, "bentoAvailabilityDesc")}
              </p>
              <span className="font-mono text-indigo-light group-hover:translate-x-1 transition-transform whitespace-nowrap">
                {getTranslation(language, "getInTouch")} →
              </span>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
};

export default Bento;
