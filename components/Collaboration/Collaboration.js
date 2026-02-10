import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const Collaboration = ({ clientHeight }) => {
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);
  const { language } = useLanguage();

  useEffect(() => {
    const smallScreen = document.body.clientWidth < 767;

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
    });

    timeline
      .from(quoteRef.current, { opacity: 0, duration: 2 })
      .to(quoteRef.current.querySelector(".text-strong"), {
        backgroundPositionX: "100%",
        duration: 1,
      });

    const slidingTl = gsap.timeline({ defaults: { ease: "none" } });

    slidingTl
      .to(sectionRef.current.querySelector(".ui-left"), {
        xPercent: smallScreen ? -500 : -150,
      })
      .from(
        sectionRef.current.querySelector(".ui-right"),
        { xPercent: smallScreen ? -500 : -150 },
        "<"
      );

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "center bottom",
      end: "center center",
      scrub: 1,
      animation: timeline,
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      animation: slidingTl,
    });

    return () => {
      timeline.kill();
      slidingTl.kill();
    };
  }, [quoteRef, sectionRef]);

  return (
    <section ref={sectionRef} className="w-full relative select-none my-40">
      <div
        className={`${
          clientHeight > 650 ? "py-36" : "py-48"
        } section-container flex flex-col`}
      >
        <p className="opacity-40 text-6xl sm:text-7xl font-semibold whitespace-nowrap ui-left transform-gpu">
          {Array(5)
            .fill(
              " Full Stack Development AI Engineering Machine Learning Computer Vision "
            )
            .reduce((str, el) => str.concat(el), "")}{" "}
        </p>

        <motion.h1
          ref={quoteRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-6 md:mt-8 font-medium text-4xl md:text-5xl text-center"
        >
          {getTranslation(language, 'interestedIn')}{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-strong font-semibold inline-block"
            style={{
              background:
                "linear-gradient(90deg, #ffffff 0%, #ffffff 50%, #8b31ff 51%, #7000ff 102%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {getTranslation(language, 'collaboration')}
          </motion.span>
          ?
        </motion.h1>

        <p className="mt-6 md:mt-8 opacity-40 text-6xl sm:text-7xl font-semibold whitespace-nowrap ui-right transform-gpu">
          {Array(5)
            .fill(
              " Web Development React.js Node.js Python Flask MongoDB "
            )
            .reduce((str, el) => str.concat(el), "")}{" "}
        </p>
      </div>
    </section>
  );
};

export default Collaboration;
