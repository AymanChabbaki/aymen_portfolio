import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import gsap from "gsap";
import { useLanguage } from "../../contexts/LanguageContext";
import { useConfetti } from "../../hooks/useConfetti";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import styles from "./Feedback.module.scss";

const Feedback = () => {
  const { language } = useLanguage();
  const { fireConfetti, fireEmoji } = useConfetti();
  const { playSuccessSound } = useSoundEffects();
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(true);
  const [shouldFlash, setShouldFlash] = useState(false);

  const translations = {
    en: {
      title: "Feedback",
      subtitle: "Share your thoughts about my portfolio",
      namePlaceholder: "Your name",
      feedbackPlaceholder: "Write your feedback here...",
      submitButton: "Submit Feedback",
      submitting: "Submitting...",
      noFeedbacks: "Be the first to leave feedback!",
      recentFeedbacks: "What People Say",
      successMessage: "Thank you for your feedback!",
      errorMessage: "Failed to submit feedback. Please try again.",
      nameRequired: "Please enter your name",
      feedbackRequired: "Please write your feedback",
      ratingRequired: "Please select a rating",
      ratingLabel: "Rate your experience",
    },
    fr: {
      title: "Commentaires",
      subtitle: "Partagez vos impressions sur mon portfolio",
      namePlaceholder: "Votre nom",
      feedbackPlaceholder: "Écrivez votre commentaire ici...",
      submitButton: "Envoyer",
      submitting: "Envoi en cours...",
      noFeedbacks: "Soyez le premier à laisser un commentaire!",
      recentFeedbacks: "Témoignages",
      successMessage: "Merci pour votre commentaire!",
      errorMessage: "Échec de l'envoi. Veuillez réessayer.",
      nameRequired: "Veuillez entrer votre nom",
      feedbackRequired: "Veuillez écrire votre commentaire",
      ratingRequired: "Veuillez sélectionner une note",
      ratingLabel: "Notez votre expérience",
    },
  };

  const t = translations[language];

  // Fetch feedbacks on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle flash animation when navigating to feedback section
  useEffect(() => {
    // Check if URL has #feedback hash or if custom event is triggered
    const handleFlashFeedback = () => {
      setShouldFlash(true);
      setTimeout(() => setShouldFlash(false), 2000); // Flash for 2 seconds
    };

    // Check hash on mount
    if (typeof window !== 'undefined' && window.location.hash === '#feedback') {
      handleFlashFeedback();
    }

    // Listen for custom flash event
    window.addEventListener('flashFeedback', handleFlashFeedback);

    return () => {
      window.removeEventListener('flashFeedback', handleFlashFeedback);
    };
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback/get");
      const data = await response.json();
      
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setFetchingFeedbacks(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error(t.nameRequired);
      return;
    }

    if (!feedback.trim()) {
      toast.error(t.feedbackRequired);
      return;
    }

    if (rating === 0) {
      toast.error(t.ratingRequired);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          feedback: feedback.trim(),
          rating: rating,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t.successMessage);
        setName("");
        setFeedback("");
        setRating(0);
        
        // Celebration confetti and sound
        playSuccessSound();
        if (rating >= 4) {
          fireConfetti(); // Full confetti for great ratings
        } else {
          fireEmoji("⭐"); // Star emoji for other ratings
        }
        
        // Refresh feedbacks
        fetchFeedbacks();

        // GSAP animation for success
        gsap.fromTo(
          ".feedback-form",
          { scale: 1 },
          { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }
        );
      } else {
        toast.error(data.error || t.errorMessage);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <motion.section
      id="feedback"
      className={styles.feedback}
      animate={shouldFlash ? {
        boxShadow: [
          '0 0 0 0 rgba(99, 102, 241, 0)',
          '0 0 30px 10px rgba(99, 102, 241, 0.5)',
          '0 0 60px 20px rgba(99, 102, 241, 0.8)',
          '0 0 30px 10px rgba(99, 102, 241, 0.5)',
          '0 0 0 0 rgba(99, 102, 241, 0)',
        ],
        scale: [1, 1.01, 1.02, 1.01, 1],
      } : {}}
      transition={{ duration: 0.6, repeat: 2 }}
    >
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <div className={styles.titleWrapper}>
            <svg className={styles.titleIcon} viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className={styles.title}>{t.title}</h2>
          </div>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </motion.div>

        {/* Feedback Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className={`${styles.form} feedback-form`}
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            className={styles.input}
            disabled={loading}
          />

          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            placeholder={t.feedbackPlaceholder}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={1000}
            rows={5}
            className={styles.textarea}
            disabled={loading}
          />

          {/* Star Rating */}
          <div className={styles.ratingWrapper}>
            <label className={styles.ratingLabel}>{t.ratingLabel}</label>
            <div className={styles.starsInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9, rotate: -15 }}
                  disabled={loading}
                  className={styles.starButton}
                >
                  <motion.svg
                    initial={false}
                    animate={{
                      scale: star <= (hoveredStar || rating) ? 1 : 0.8,
                      rotate: star <= (hoveredStar || rating) ? 0 : -10,
                    }}
                    viewBox="0 0 24 24"
                    fill={star <= (hoveredStar || rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </motion.svg>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? t.submitting : t.submitButton}
          </motion.button>
        </motion.form>

        {/* Feedbacks List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.feedbacksList}
        >
          <h3 className={styles.feedbacksTitle}>
            ✨ {t.recentFeedbacks}
          </h3>

          {fetchingFeedbacks ? (
            <div className={styles.loading}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={styles.spinner}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.415, 31.415" strokeLinecap="round"/>
                </svg>
              </motion.div>
            </div>
          ) : feedbacks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.noFeedbacks}
            >
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10h.01M12 10h.01M16 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>{t.noFeedbacks}</p>
            </motion.div>
          ) : (
            <div className={styles.feedbacksGrid}>
              <AnimatePresence>
                {feedbacks.map((fb, index) => (
                  <motion.div
                    key={fb.id}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateZ: 15 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.03,
                      boxShadow: "0 20px 60px rgba(139, 49, 255, 0.3)",
                      cursor: "grab"
                    }}
                    whileDrag={{
                      scale: 1.1,
                      rotate: 5,
                      cursor: "grabbing",
                      boxShadow: "0 25px 80px rgba(139, 49, 255, 0.5)",
                      zIndex: 10
                    }}
                    className={styles.feedbackCard}
                  >
                    <div className={styles.cardGlow} />
                    <div className={styles.quoteIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                      </svg>
                    </div>
                    <div className={styles.feedbackContent}>
                      <p className={styles.feedbackText}>{fb.feedback}</p>
                    </div>
                    <div className={styles.feedbackFooter}>
                      <div className={styles.avatarWrapper}>
                        <motion.div 
                          className={styles.avatar}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {fb.name.charAt(0).toUpperCase()}
                        </motion.div>
                        <div className={styles.userInfo}>
                          <span className={styles.feedbackName}>{fb.name}</span>
                          <span className={styles.feedbackDate}>
                            {formatDate(fb.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <motion.svg
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + i * 0.05, type: "spring" }}
                            whileHover={{ scale: 1.3, rotate: 15 }}
                            viewBox="0 0 24 24"
                            fill={i < (fb.rating || 5) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </motion.svg>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Background Animation */}
      <div className={styles.bgAnimation}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={styles.bgOrb1}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={styles.bgOrb2}
        />
      </div>
    </motion.section>
  );
};

export default Feedback;
