import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Typed from "typed.js";
import gsap from "gsap";
import { motion } from "framer-motion";
import Button from "../Button/Button";
import Profiles from "../Profiles/Profiles";
import styles from "./Hero.module.scss";
import { MENULINKS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const Hero = () => {
  const sectionRef = useRef(null);
  const typedElementRef = useRef(null);
  const { language } = useLanguage();
  const typedInstanceRef = useRef(null);

  const getTypedStrings = () => [
    getTranslation(language, 'typedString1'),
    getTranslation(language, 'typedString2'),
    getTranslation(language, 'typedString3'),
    getTranslation(language, 'typedString4'),
    getTranslation(language, 'typedString5'),
    getTranslation(language, 'typedString6'),
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "none" } })
        .to(sectionRef.current, { opacity: 1, duration: 2 })
        .from(
          sectionRef.current.querySelectorAll(".staggered-reveal"),
          { opacity: 0, duration: 0.5, stagger: 0.5 },
          "<"
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Destroy previous instance if exists
    if (typedInstanceRef.current) {
      typedInstanceRef.current.destroy();
    }

    const options = {
      strings: getTypedStrings(),
      typeSpeed: 50,
      startDelay: 1500,
      backSpeed: 50,
      backDelay: 8000,
      loop: true,
    };

    typedInstanceRef.current = new Typed(typedElementRef.current, options);

    return () => {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, [typedElementRef, language]);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[0].ref}
      className="w-full flex md:items-center py-8 2xl:container mx-auto xl:px-20 md:px-12 px-4 min-h-screen relative mb-24"
      style={{ opacity: 0 }}
    >
      <style global jsx>
        {`
          .typed-cursor {
            font-size: 2rem;
          }
        `}
      </style>
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-indigo-light/5 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="flex flex-col pt-40 md:pt-0 select-none relative z-10">
        <motion.h5
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${styles.intro} font-mono font-medium text-indigo-light`}
        >
          {getTranslation(language, 'hiMyNameIs')}
        </motion.h5>
        <h1 className={`${styles.heroName} text-white text-6xl font-semibold`}>
          <motion.span 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
            className={`relative ${styles.emphasize} inline-block`}
          >
            Ayman
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
            className="inline-block"
          >
            {" "}Chabbaki
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span
            ref={typedElementRef}
            className="text-3xl text-gray-light-3 font-mono leading-relaxed"
          />
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Profiles />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="pt-4"
        >
          <Button href={`#${MENULINKS[4].ref}`} classes="link" type="primary">
            {getTranslation(language, 'letsTalk')}
          </Button>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
          y: [0, -20, 0]
        }}
        transition={{
          opacity: { duration: 0.8, delay: 1.8 },
          scale: { duration: 0.8, delay: 1.8 },
          rotate: { duration: 0.8, delay: 1.8 },
          y: { 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.6
          }
        }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="absolute invisible lg:visible lg:right-12 2xl:right-16 bottom-8"
      >
        <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-indigo-light shadow-2xl">
          <Image
            src="/me.jpeg"
            alt="Ayman Chabbaki"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
