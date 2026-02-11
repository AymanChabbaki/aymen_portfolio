import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Howl } from "howler";
import SoundBar from "./SoundBar/SoundBar";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";
import { trackDownload } from "../../hooks/useAnalytics";
import usePortfolioAnalytics from "../../hooks/usePortfolioAnalytics";

const multiPop = new Howl({
  src: ["/sounds/multi-pop.mp3"],
});

const Header = ({ children }) => {
  const inputRef = useRef(null);
  const { language, toggleLanguage } = useLanguage();
  const { trackEvent } = usePortfolioAnalytics();

  const handleDownloadResume = () => {
    const resumeFile = language === 'fr' ? '/fr.pdf' : '/us.pdf';
    const fileName = language === 'fr' ? 'CV_Ayman_Chabbaki.pdf' : 'Resume_Ayman_Chabbaki.pdf';
    
    // Track download with old analytics
    trackDownload(fileName, 'resume');
    
    // Track with new analytics system
    trackEvent('download_cv', { fileName, language });
    
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = useCallback((e) => {
    if (e.target.checked) multiPop.play();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape" && inputRef.current?.checked) {
      inputRef.current.checked = false;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <nav className="w-full fixed top-0 py-4 z-50 select-none bg-gradient-to-b from-black shadow-black transition-all duration-300">
      <div className="flex justify-between items-center section-container">
        <motion.a 
          href="#home" 
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="link h-12 flex items-center"
        >
          <Image
            src="/logo.png"
            alt="Logo - Ayman Chabbaki"
            width={125}
            height={48}
            style={{ width: '125px', height: 'auto', objectFit: 'contain' }}
          />
        </motion.a>
        <div className="outer-menu relative flex items-center gap-8 z-[1]">
          <motion.button
            onClick={handleDownloadResume}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-light to-purple-500 hover:from-purple-500 hover:to-indigo-light text-white rounded-lg transition-all duration-300 shadow-lg shadow-indigo-light/30 hover:shadow-indigo-light/50"
          >
            {getTranslation(language, 'downloadResume')}
          </motion.button>
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="px-3 py-2 flex items-center gap-2 text-sm font-medium bg-gray-dark-4 hover:bg-indigo-light/20 text-white rounded-lg transition-all duration-300 border border-gray-dark-1 hover:border-indigo-light"
          >
            <Image
              src={language === 'fr' ? '/us.svg' : '/fr.svg'}
              alt={language === 'fr' ? 'English' : 'Français'}
              width={20}
              height={15}
              style={{ width: '20px', height: '15px', objectFit: 'contain' }}
            />
            {language === 'fr' ? 'EN' : 'FR'}
          </motion.button>
          <SoundBar />
          <input
            ref={inputRef}
            aria-labelledby="menu"
            aria-label="menu"
            className="checkbox-toggle link absolute top-0 right-0 w-6 h-6 opacity-0 cursor-pointer z-[100]"
            type="checkbox"
            onClick={handleClick}
          />
          <div className="hamburger w-6 h-6 flex items-center justify-center">
            <div className="relative flex-none w-full bg-white duration-300 flex items-center justify-center" />
          </div>
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Header;
