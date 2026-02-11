import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { MENULINKS } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { HiHome, HiChip, HiViewGridAdd, HiBriefcase, HiMail, HiStar } from 'react-icons/hi';

/**
 * ScrollingChatbot Component
 * 
 * A fun, interactive chatbot that follows users through the portfolio
 * Features:
 * - Draggable to any position on screen
 * - Random playful movements (left, right, center)
 * - Section-aware messages that change based on scroll position
 * - Bouncing animation and glow effects
 * - Click to show message on demand
 * - Fully bilingual (French/English)
 */
const ScrollingChatbot = () => {
  // ========== STATE MANAGEMENT ==========
  const [currentSection, setCurrentSection] = useState('home'); // Current section user is viewing
  const [showMessage, setShowMessage] = useState(false); // Toggle message bubble visibility
  const [isDragging, setIsDragging] = useState(false); // Track if user is dragging the chatbot
  const [hasBeenDragged, setHasBeenDragged] = useState(false); // Track if chatbot was manually moved
  const controls = useAnimation(); // Animation controller for playful movements
  const playfulInterval = useRef(null); // Reference to interval for random movements
  
  // ========== HOOKS ==========
  const { scrollY } = useScroll(); // Track scroll position
  const { language } = useLanguage(); // Get current language (fr/en)

  // ========== SCROLL-BASED ANIMATIONS ==========
  // Rotate the chatbot as user scrolls (full 360° rotation every 1000px)
  const rotate = useTransform(scrollY, [0, 1000, 2000, 3000], [0, 360, 0, 360]);
  
  // Scale animation - chatbot grows and shrinks as user scrolls
  const scale = useTransform(scrollY, 
    [0, 500, 1000, 1500, 2000], 
    [1, 1.2, 0.9, 1.1, 1] // Varies between 90% and 120% of original size
  );

  // ========== SECTION MESSAGES ==========
  // Messages that appear based on which section the user is viewing
  // Each section has a unique, fun message in both French and English
  const messages = {
    fr: {
      home: <><HiHome className="inline w-4 h-4 mr-1" /> Salut! Bienvenue sur mon portfolio!</>,
      skills: <><HiChip className="inline w-4 h-4 mr-1" /> Wow! Regarde toutes ces compétences!</>,
      projects: <><HiViewGridAdd className="inline w-4 h-4 mr-1" /> Ces projets sont incroyables!</>,
      work: <><HiBriefcase className="inline w-4 h-4 mr-1" /> Quel parcours impressionnant!</>,
      contact: <><HiMail className="inline w-4 h-4 mr-1" /> N'hésite pas à me contacter!</>,
      feedback: <><HiStar className="inline w-4 h-4 mr-1" /> Laisse ton avis, ça fait plaisir!</>
    },
    en: {
      home: <><HiHome className="inline w-4 h-4 mr-1" /> Hi! Welcome to my portfolio!</>,
      skills: <><HiChip className="inline w-4 h-4 mr-1" /> Wow! Look at all these skills!</>,
      projects: <><HiViewGridAdd className="inline w-4 h-4 mr-1" /> These projects are amazing!</>,
      work: <><HiBriefcase className="inline w-4 h-4 mr-1" /> What an impressive journey!</>,
      contact: <><HiMail className="inline w-4 h-4 mr-1" /> Feel free to reach out!</>,
      feedback: <><HiStar className="inline w-4 h-4 mr-1" /> Leave your feedback, it's appreciated!</>
    }
  };

  // ========== FEEDBACK FLASH HANDLER ==========
  // Triggers flash animation on feedback section and scrolls to it
  const handleFeedbackClick = () => {
    const feedbackSection = document.getElementById('feedback');
    if (feedbackSection) {
      // Trigger custom flash event
      window.dispatchEvent(new Event('flashFeedback'));
      
      // Smooth scroll to feedback section
      feedbackSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // ========== PLAYFUL RANDOM MOVEMENTS ==========
  // Make the chatbot move randomly around the screen (left, right, center)
  // Continuously plays as long as not being dragged
  useEffect(() => {
    if (!isDragging) {
      // Function to move to random position
      const moveToRandomPosition = () => {
        if (typeof window !== 'undefined') {
          const positions = [
            { x: window.innerWidth - 150, y: window.innerHeight - 150 }, // Bottom-right
            { x: 50, y: window.innerHeight - 150 }, // Bottom-left
            { x: window.innerWidth / 2 - 40, y: window.innerHeight - 150 }, // Bottom-center
            { x: window.innerWidth - 150, y: window.innerHeight / 2 - 40 }, // Middle-right
            { x: 50, y: window.innerHeight / 2 - 40 }, // Middle-left
          ];
          
          // Pick a random position
          const randomPosition = positions[Math.floor(Math.random() * positions.length)];
          
          // Animate to that position with bouncy effect
          controls.start({
            opacity: 1,
            scale: 1,
            x: randomPosition.x,
            y: randomPosition.y,
            transition: {
              type: "spring",
              stiffness: 80,
              damping: 12,
              duration: 1.5
            }
          });
        }
      };

      // Move to random position immediately on mount
      moveToRandomPosition();
      
      // Start random movements every 5-8 seconds
      playfulInterval.current = setInterval(() => {
        moveToRandomPosition();
      }, Math.random() * 3000 + 5000); // Random interval between 5-8 seconds
    }

    return () => {
      if (playfulInterval.current) {
        clearInterval(playfulInterval.current);
      }
    };
  }, [isDragging, controls]);

  // ========== SECTION DETECTION ==========
  // Detect which section the user is currently viewing
  // Show appropriate message when section changes
  useEffect(() => {
    const handleScroll = () => {
      // Don't show messages if user is dragging the chatbot
      if (isDragging) return;

      const sections = MENULINKS.map(link => link.ref); // Get all section IDs
      const scrollPosition = window.scrollY + window.innerHeight * 0.6; // Trigger when section reaches 60% down viewport

      // Loop through sections to find which one is in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          const elementBottom = elementTop + rect.height;
          
          // Check if this section is currently in the viewport
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            // Only update if we've moved to a new section
            if (currentSection !== section) {
              console.log('[Chatbot] Section changed to:', section, {
                elementTop,
                elementBottom,
                scrollPosition,
                height: rect.height
              });
              setCurrentSection(section);
              setShowMessage(true);
              // Auto-hide message after 8 seconds
              setTimeout(() => setShowMessage(false), 8000);
            }
            break;
          }
        }
      }
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial section on mount
    
    // Show welcome message on first load
    setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 8000);
    }, 500);

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, isDragging]);

  return (
    <motion.div
      // ========== MAIN CONTAINER ==========
      // Fixed position that follows scroll, draggable, playful animations
      className="fixed top-0 left-0 z-[9999] cursor-grab active:cursor-grabbing"
      style={{ pointerEvents: 'auto' }}
      initial={{ opacity: 0, scale: 0.5, x: typeof window !== 'undefined' ? window.innerWidth - 150 : 800, y: typeof window !== 'undefined' ? window.innerHeight - 150 : 600 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      
      // ========== DRAG FUNCTIONALITY ==========
      drag // Enable dragging
      dragMomentum={true} // Ball-like momentum when released
      dragElastic={0.3} // Bouncy elastic effect
      dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }} // Ball physics
      dragConstraints={{ 
        top: 0,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 100 : 1000, 
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - 100 : 1000
      }}
      onDragStart={() => {
        setIsDragging(true); // Update drag state
        setHasBeenDragged(true); // Mark as manually positioned
      }}
      onDragEnd={() => {
        setIsDragging(false); // Release drag state
      }}
      whileDrag={{ scale: 1.2, cursor: 'grabbing', rotate: 10 }} // Grow and tilt when dragging
    >
      {/* ========== MESSAGE BUBBLE ========== */}
      {/* Speech bubble that appears above the chatbot */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ 
          opacity: showMessage ? 1 : 0, // Fade in/out
          y: showMessage ? 0 : 20, // Slide up/down
          scale: showMessage ? 1 : 0.8 // Scale effect
        }}
        transition={{ duration: 0.3 }}
        className={`absolute bottom-full right-0 mb-4 ${currentSection === 'feedback' ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
        onClick={currentSection === 'feedback' ? handleFeedbackClick : undefined}
      >
        {/* Gradient background bubble */}
        <div className={`bg-gradient-to-r from-indigo-light to-purple-500 text-white px-4 py-3 rounded-2xl rounded-br-none shadow-xl max-w-md ${currentSection === 'feedback' ? 'hover:shadow-2xl hover:scale-105 transition-all duration-300' : ''}`}>
          <div className="text-sm font-medium whitespace-normal">
              {/* Display message based on current section and language */}
              {messages[language]?.[currentSection] || messages.en[currentSection]}
              {currentSection === 'feedback' && (
                <span className="block mt-1 text-xs opacity-80">👆 Click to jump to feedback!</span>
              )}
          </div>
          </div>
        </motion.div>

        {/* ========== CHATBOT IMAGE ========== */}
        {/* Main chatbot image with bounce animation */}
        <motion.div
          animate={{
            y: isDragging ? 0 : [0, -10, 0], // Bounce up and down when not dragging
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-20 h-20"
          whileHover={{ scale: 1.1, rotate: 5 }} // Slight grow and tilt on hover
          whileTap={{ scale: 0.95 }} // Shrink on click
          onClick={(e) => {
            // Click to show message on demand (only if not dragging)
            e.stopPropagation();
            if (!isDragging) {
              setShowMessage(true);
              setTimeout(() => setShowMessage(false), 8000);
            }
          }}
        >
          {/* ========== GLOW EFFECT ========== */}
          {/* Animated glow behind the chatbot for visual appeal */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-light/20 to-purple-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />
          
          {/* icc.png image */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-indigo-light shadow-xl">
            <Image
              src="/icc.png"
              alt="Chatbot Assistant"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              draggable={false} // Prevent native image drag
              priority
            />
          </div>
        </motion.div>

        {/* ========== ONLINE INDICATOR ========== */}
        {/* Green dot showing the chatbot is "active" */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], // Pulse effect
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white pointer-events-none"
        />
    </motion.div>
  );
};

export default ScrollingChatbot;
