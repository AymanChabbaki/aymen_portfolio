import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MENULINKS } from "../../../constants";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getTranslation } from "../../../locales/translations";

const Menu = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const anchorNodes = document.querySelectorAll('a[href^="#"]');

    anchorNodes.forEach((el) => {
      el.addEventListener("click", () => {
        const checkbox = document.querySelector(".checkbox-toggle");
        checkbox.checked = false;
      });
    });
  }, []);

  return (
    <div className="menu fixed top-0 left-0 w-full h-full overflow-hidden invisible pointer-events-none flex items-center justify-center">
      <div className="flex-none overflow-hidden flex items-center justify-center">
        <div className="text-center opacity-0 overflow-y-auto overflow-x-hidden flex flex-none justify-center items-center max-h-screen">
          <ul className="list-none py-4 px-0 m-0 block max-h-screen">
            {MENULINKS.map((el, index) => (
              <motion.li 
                key={el.name} 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="p-0 m-6 text-2xl block"
              >
                <motion.a
                  whileHover={{ 
                    scale: 1.1, 
                    x: 10,
                    color: "#8b31ff",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="link relative inline font-mono font-bold text-5xl duration-300 hover:no-underline"
                  href={`#${el.ref}`}
                >
                  {getTranslation(language, el.ref)}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
