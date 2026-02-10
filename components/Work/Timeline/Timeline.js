import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getTranslation } from "../../../locales/translations";

const Timeline = ({ items }) => {
  const { language } = useLanguage();
  
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
        duration: 0.4,
        delay: 0.3
      }
    }
  };
  
  return (
    <div className="relative">
      {/* Animated Timeline line */}
      <motion.div 
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-light via-purple-500 to-indigo-light origin-top"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      <motion.div 
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            custom={index}
            variants={itemVariants}
            className={`relative flex items-center ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } flex-row`}
          >
            {/* Animated Timeline dot with pulse */}
            <motion.div 
              variants={dotVariants}
              whileHover={{ 
                scale: 1.3,
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.8)"
              }}
              className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-indigo-light border-4 border-black z-10 shadow-lg shadow-indigo-light/50"
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

            {/* Content card */}
            <div
              className={`ml-12 md:ml-0 w-full md:w-5/12 ${
                index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
              }`}
            >
              <motion.div 
                className="bg-gradient-to-br from-gray-dark-4 to-gray-dark-3 p-6 rounded-xl border border-gray-dark-1 shadow-xl hover:shadow-2xl hover:shadow-indigo-light/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                variants={cardContentVariants}
              >
                {/* Icon/Type badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    item.type === "education"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {item.type === "education" ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                    </svg>
                  )}
                  {getTranslation(language, item.type === "education" ? "education" : "experience").replace(/🎓|💼/g, '').trim()}
                </motion.div>

                {/* Period */}
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-indigo-light font-semibold text-sm mb-2"
                >
                  {getTranslation(language, item.periodKey)}
                </motion.p>

                {/* Title */}
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55 }}
                  className="text-xl font-bold text-white mb-1"
                >
                  {getTranslation(language, item.titleKey)}
                </motion.h3>

                {/* Institution/Company */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-light-2 font-medium mb-1"
                >
                  {getTranslation(language, item.institutionKey)}
                </motion.p>

                {/* Location */}
                <motion.p 
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="text-gray-light-3 text-sm leading-relaxed"
                >
                  {getTranslation(language, item.descriptionKey)}
                </motion.p>
              </motion.div>
            </div>

            {/* Empty space for alternating layout */}
            <div className="hidden md:block w-5/12" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Timeline;
