/* eslint-disable @next/next/no-img-element */
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import { MENULINKS, SKILLS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

// One motion language for every skill icon: fade-up in, lift on hover, draggable for fun
const SkillIcon = ({ skill, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay: index * 0.04 }}
    whileHover={{ scale: 1.15, y: -4, transition: { duration: 0.2 } }}
    drag
    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
    dragElastic={0.7}
    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
    whileDrag={{ scale: 1.25, cursor: "grabbing" }}
    style={{ cursor: "grab" }}
  >
    <Image src={`/skills/${skill}.svg`} alt={skill} width={50} height={50} />
  </motion.div>
);

const SkillGroup = ({ titleKey, skills, className = "" }) => {
  const { language } = useLanguage();

  return (
    <SpotlightCard
      className={`rounded-2xl p-6 staggered-reveal ${className}`}
    >
      <h3 className="uppercase tracking-widest text-gray-light-2 font-medium text-base mb-5 relative z-10">
        {getTranslation(language, titleKey)}
      </h3>
      <div className="flex items-center flex-wrap gap-6 relative z-10 transform-gpu">
        {skills.map((skill, index) => (
          <SkillIcon key={skill} skill={skill} index={index} />
        ))}
      </div>
    </SpotlightCard>
  );
};

const Skills = () => {
  const sectionRef = useRef(null);
  const { language } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ defaults: { ease: "none" } })
        .from(
          sectionRef.current.querySelectorAll(".staggered-reveal"),
          { opacity: 0, duration: 0.5, stagger: 0.5 },
          "<"
        );

      ScrollTrigger.create({
        trigger: sectionRef.current.querySelector(".skills-wrapper"),
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
      id={MENULINKS[1].ref}
      className="w-full relative select-none mt-44"
    >
      <div className="section-container py-16 flex flex-col justify-center">
        <img
          src="/right-pattern.svg"
          alt=""
          className="absolute hidden right-0 bottom-2/4 w-2/12 max-w-xs md:block"
          loading="lazy"
          height={700}
          width={320}
        />
        <div className="flex flex-col skills-wrapper">
          <div className="flex flex-col">
            <p className="uppercase tracking-widest text-gray-light-1 staggered-reveal">
              SKILLS
            </p>
            <h1 className="text-6xl mt-2 font-medium text-gradient w-fit staggered-reveal">
              {getTranslation(language, "skillsTitle")}
            </h1>
            <h2 className="text-[1.65rem] font-medium md:max-w-lg w-full mt-2 staggered-reveal">
              {getTranslation(language, "skillsSubtitle")}{" "}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <SkillGroup
              titleKey="languagesAndTools"
              skills={SKILLS.languagesAndTools}
              className="md:col-span-2"
            />
            <SkillGroup
              titleKey="librariesAndFrameworks"
              skills={SKILLS.librariesAndFrameworks}
              className="md:col-span-2"
            />
            <SkillGroup titleKey="databases" skills={SKILLS.databases} />
            <SkillGroup titleKey="other" skills={SKILLS.other} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
