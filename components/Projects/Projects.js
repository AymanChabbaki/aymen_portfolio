import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MENULINKS, PROJECTS } from "../../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ProjectTile from "./ProjectTile/ProjectTile";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const Projects = ({ isDesktop, clientHeight }) => {
  const sectionRef = useRef(null);
  const sectionTitleRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    let projectsScrollTrigger;
    let projectsTimeline;

    if (isDesktop) {
      [projectsTimeline, projectsScrollTrigger] = getProjectsSt();
    } else {
      const projectWrapper =
        sectionRef.current.querySelector(".project-wrapper");
      projectWrapper.style.width = "calc(100vw - 1rem)";
      projectWrapper.style.overflowX = "scroll";
    }

    const [revealTimeline, revealScrollTrigger] = getRevealSt();

    return () => {
      projectsScrollTrigger && projectsScrollTrigger.kill();
      projectsTimeline && projectsTimeline.kill();
      revealScrollTrigger && revealScrollTrigger.kill();
      revealTimeline && revealTimeline.progress(1);
    };
  }, [sectionRef, sectionTitleRef, isDesktop]);

  const getRevealSt = () => {
    const revealTl = gsap.timeline({ defaults: { ease: "none" } });

    revealTl.from(
      sectionRef.current.querySelectorAll(".staggered-reveal"),
      { opacity: 0, duration: 0.5, stagger: 0.5 },
      "<"
    );

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0,
      animation: revealTl,
    });

    return [revealTl, scrollTrigger];
  };

  const getProjectsSt = () => {
    const timeline = gsap.timeline({ defaults: { ease: "none" } });
    const sidePadding =
      document.body.clientWidth -
      sectionRef.current.querySelector(".inner-container").clientWidth;
    const elementWidth =
      sidePadding +
      sectionRef.current.querySelector(".project-wrapper").clientWidth;
    sectionRef.current.style.width = `${elementWidth}px`;
    const width = window.innerWidth - elementWidth;
    const duration = `${(elementWidth / window.innerHeight) * 100}%`;
    timeline
      .to(sectionRef.current, { x: width })
      .to(sectionTitleRef.current, { x: -width }, "<");

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: duration,
      scrub: 0,
      pin: true,
      animation: timeline,
      pinSpacing: "margin",
    });

    return [timeline, scrollTrigger];
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[2].ref}
      className={`${
        isDesktop && "min-h-screen"
      } w-full relative select-none section-container transform-gpu`}
    >
      <div className="flex flex-col py- justify-center h-full">
        <div
          className="flex flex-col inner-container transform-gpu"
          ref={sectionTitleRef}
        >
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-widest text-gray-light-1"
          >
            PROJECTS
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl mt-2 font-medium text-gradient w-fit"
          >
            {getTranslation(language, 'projectsTitle')}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[1.65rem] font-medium md:max-w-lg max-w-sm mt-2"
          >
            {getTranslation(language, 'projectsSubtitle')}{" "}
          </motion.h2>
        </div>
        <div
          className={`${
            clientHeight > 650 ? "mt-12" : "mt-8"
          } flex project-wrapper no-scrollbar w-fit staggered-reveal`}
        >
          {PROJECTS.map((project, index) => (
            <ProjectTile
              classes={
                index === PROJECTS.length - 1 ? "" : "mr-8 xs:mr-10 sm:mr-12"
              }
              project={project}
              key={project.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
