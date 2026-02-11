import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getTranslation } from "../../../locales/translations";

const Timeline = ({ items }) => {
  const { language } = useLanguage();
  const containerRef = useRef(null);
  
  // 3D scroll effect for the timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineScale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: (custom) => ({
      opacity: 0,
      x: custom % 2 === 0 ? -50 : 50,
      y: 20
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.2
      }
    }
  };

  const cardContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative py-12" ref={containerRef}>
      {/* 3D Animated Timeline line with scroll-based reveal */}
      <motion.div 
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-light via-purple-500 to-indigo-light origin-top"
        style={{ 
          scaleY: lineScale,
          opacity: lineOpacity,
          transformStyle: "preserve-3d",
          boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)"
        }}
      >
        {/* Animated glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-indigo-light via-purple-500 to-indigo-light blur-sm"
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Timeline items */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ margin: "-50px" }}
      >
        {items.map((item, index) => {
          // Calculate 3D position based on scroll
          const itemProgress = useTransform(
            scrollYProgress,
            [index / items.length, (index + 1) / items.length],
            [100, 0]
          );
          
          const itemRotateY = useTransform(
            scrollYProgress,
            [index / items.length, (index + 1) / items.length],
            [index % 2 === 0 ? -15 : 15, 0]
          );
          
          const itemZ = useTransform(
            scrollYProgress,
            [index / items.length, (index + 1) / items.length],
            [-100, 0]
          );

          return (
            <motion.div
              key={item.id}
              custom={index}
              variants={itemVariants}
              style={{
                x: itemProgress,
                rotateY: itemRotateY,
                z: itemZ,
                transformStyle: "preserve-3d"
              }}
              className={`relative flex items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex-row`}
            >
              {/* Animated Timeline dot with enhanced 3D effect */}
              <motion.div 
                variants={dotVariants}
                whileHover={{ 
                  scale: 1.5,
                  boxShadow: "0 0 30px rgba(124, 58, 237, 1)",
                  rotateY: 360
                }}
                transition={{
                  rotateY: { duration: 0.6, ease: "easeOut" }
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute left-4 md:left-1/2 w-5 h-5 -ml-2.5 rounded-full bg-indigo-light border-4 border-black z-10 shadow-lg shadow-indigo-light/50"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-indigo-light"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Content card with 3D hover */}
              <motion.div
                variants={cardContentVariants}
                whileHover={{ 
                  scale: 1.05,
                  z: 50,
                  rotateY: index % 2 === 0 ? 5 : -5,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
                className={`w-full md:w-5/12 p-6 bg-gray-dark rounded-lg border border-gray-light-1/20 
                           hover:border-indigo-light/30 transition-all shadow-xl backdrop-blur-sm
                           ${index % 2 === 0 ? "ml-12 md:ml-0 md:mr-auto" : "ml-12 md:ml-auto md:mr-0"}`}
              >
                {/* Period */}
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-indigo-light font-semibold text-sm mb-2"
                >
                  {getTranslation(language, item.periodKey)}
                </motion.p>

                {/* Title */}
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="text-xl font-bold text-white mb-1"
                >
                  {getTranslation(language, item.titleKey)}
                </motion.h3>

                {/* Institution/Company */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-light-2 font-medium mb-1"
                >
                  {getTranslation(language, item.institutionKey)}
                </motion.p>

                {/* Location */}
                <motion.p 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  className="flex items-center gap-1 text-gray-light-3 text-sm mb-3"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  {getTranslation(language, item.locationKey)}
                </motion.p>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-gray-light-3 text-sm leading-relaxed"
                >
                  {getTranslation(language, item.descriptionKey)}
                </motion.p>
              </motion.div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block w-5/12" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Timeline;
