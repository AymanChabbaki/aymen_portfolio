import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import Timeline from "./Timeline/Timeline";
import { MENULINKS } from "../../constants";
import { timeline } from "../../timeline";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const Work = ({ isDesktop }) => {
  const sectionRef = useRef(null);
  const [activeView, setActiveView] = useState("all"); // "all", "education", "experience"
  const { language } = useLanguage();

  const filteredTimeline = 
    activeView === "all"
      ? timeline
      : timeline.filter((item) => item.type === activeView);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ defaults: { ease: "none" } })
        .from(
          sectionRef.current.querySelectorAll(".staggered-reveal"),
          { opacity: 0, duration: 0.3, stagger: 0.15 },
          "<"
        );

      ScrollTrigger.create({
        trigger: sectionRef.current.querySelector(".work-wrapper"),
        start: "100px bottom",
        end: "center center",
        scrub: 0,
        animation: tl,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[3].ref}
      className="w-full relative select-none xs:mt-40 sm:mt-72 mb-96"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/left-pattern.svg"
        className="absolute hidden left-0 -top-1/4 w-1/12 max-w-xs md:block"
        loading="lazy"
        height={700}
        width={320}
        alt="left pattern"
      />
      <div className="section-container py-16 flex flex-col justify-center">
        <div className="flex flex-col work-wrapper">
          <div className="flex flex-col">
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-widest text-gray-light-1"
            >
              {getTranslation(language, 'workLabel')}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl mt-2 font-medium text-gradient w-fit"
            >
              {getTranslation(language, 'workTitle')}
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[1.65rem] font-medium md:max-w-lg w-full mt-2"
            >
              {getTranslation(language, 'workSubtitle')}{" "}
            </motion.h2>
          </div>

          {/* Toggle Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center gap-4 mt-12 mb-8"
          >
            <motion.button
              onClick={() => setActiveView("all")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeView === "all"
                  ? "bg-gradient-to-r from-indigo-light to-purple-500 text-white shadow-lg shadow-indigo-light/50"
                  : "bg-gray-dark-4 text-gray-light-3 hover:bg-gray-dark-3"
              }`}
            >
              {getTranslation(language, 'all')}
            </motion.button>
            <motion.button
              onClick={() => setActiveView("education")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeView === "education"
                  ? "bg-gradient-to-r from-indigo-light to-purple-500 text-white shadow-lg shadow-indigo-light/50"
                  : "bg-gray-dark-4 text-gray-light-3 hover:bg-gray-dark-3"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              {getTranslation(language, 'education').replace(/🎓/g, '').trim()}
            </motion.button>
            <motion.button
              onClick={() => setActiveView("experience")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeView === "experience"
                  ? "bg-gradient-to-r from-indigo-light to-purple-500 text-white shadow-lg shadow-indigo-light/50"
                  : "bg-gray-dark-4 text-gray-light-3 hover:bg-gray-dark-3"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
              </svg>
              {getTranslation(language, 'experience').replace(/💼/g, '').trim()}
            </motion.button>
          </motion.div>

          {/* Timeline */}
          <div className="mt-8">
            <Timeline items={filteredTimeline} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
