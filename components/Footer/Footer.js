/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import Button from "../Button/Button";
import FooterBg from "./FooterBg/FooterBg";
import Profiles from "../Profiles/Profiles";
import { theme } from "tailwind.config";
import { MENULINKS } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const Footer = () => {
  const [playbackRate, setPlaybackRate] = useState(0.75);
  const { language } = useLanguage();

  const heartClickSound = new Howl({
    src: ["/sounds/glug-a.mp3"],
    rate: playbackRate,
    volume: 0.5,
  });

  const handleClick = () => {
    setPlaybackRate((rate) => rate + 0.1);
    heartClickSound.play();
  };

  return (
    <footer
      className="w-full relative select-none bg-cover"
      style={{
        backgroundImage: `linear-gradient(to right, ${theme.colors.indigo.light}, ${theme.colors.indigo.dark})`,
      }}
    >
      <FooterBg />
      <motion.div
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full pt-32">
          <div className="section-container flex flex-col h-full justify-end z-10 items-center py-12">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-medium text-3xl md:text-4xl text-center"
            >
              {getTranslation(language, 'footerText')}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Profiles />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4 text-center"
            >
              <Button
                href={`#${MENULINKS[4].ref}`}
                classes="link"
                type="secondary"
              >
                {getTranslation(language, 'letsTalk')}
              </Button>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center text-white text-sm sm:text-base font-medium tracking-wide mt-8"
            >
              {getTranslation(language, 'developedWith')}{" "}
              <motion.button 
                onClick={handleClick} 
                whileHover={{ scale: 1.3, rotate: 360 }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="link cursor-none inline-block"
              >
                <svg className="inline-block w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </motion.button>{" "}
              {getTranslation(language, 'by')} <span className="text-white">Ayman Chabbaki</span>
            </motion.p>
          </div>
        </div>
      </motion.div>
      <motion.img
        src="/footer-curve.svg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full rotate-180"
        alt="footer curve"
        loading="eager"
        height={180}
      />
    </footer>
  );
};

export default Footer;
