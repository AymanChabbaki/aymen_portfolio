import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const About2 = ({ clientHeight }) => {
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);
  const { language } = useLanguage();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({
          defaults: { ease: "none", duration: 0.1 },
        })
        .from(quoteRef.current, { opacity: 0, duration: 2 })
        .to(quoteRef.current.querySelector(".about-3"), {
          backgroundPositionX: "100%",
          duration: 1,
        });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center bottom",
        end: "center center",
        scrub: 0,
        animation: tl,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full relative select-none overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-40 h-40 bg-indigo-light/10 rounded-full blur-2xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div
        className={`${
          clientHeight > 650 ? "py-80" : "py-72"
        } section-container relative z-10`}
      >
        <motion.h1
          ref={quoteRef}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-medium text-[2.70rem] md:text-6xl lg:text-[4rem] text-center"
        >
          {getTranslation(language, 'aboutObsession1')}{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="about-3 font-bold inline-block"
            style={{
              background:
                "linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #8b31ff 51%, #7000ff 102%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {getTranslation(language, 'aboutObsession2')}
          </motion.span>{" "}
          {getTranslation(language, 'aboutObsession3')}
        </motion.h1>
      </div>
    </section>
  );
};

export default About2;
