import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../locales/translations";

const MAX_TESTIMONIALS = 12;
// Below this count a marquee visibly repeats the same cards — show a static row instead
const MIN_FOR_MARQUEE = 5;

const Stars = ({ rating }) => (
  <div className="flex gap-0.5 text-indigo-light">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

// Auto-scrolling strip of the best feedback entries (rating >= 4).
// Renders nothing when there is no qualifying feedback.
const Testimonials = () => {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch("/api/feedback/get")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.success || !Array.isArray(data.feedbacks)) return;
        const seen = new Set();
        setTestimonials(
          data.feedbacks
            .filter((fb) => {
              if ((fb.rating || 0) < 4 || !fb.feedback?.trim()) return false;
              // Drop duplicate entries (same author + same text)
              const key = `${fb.name}::${fb.feedback.trim()}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .slice(0, MAX_TESTIMONIALS)
        );
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const cards = testimonials.map((fb, i) => (
    <SpotlightCard
      key={`${fb.id}-${i}`}
      className="rounded-2xl p-6 w-80 flex-none mx-3 flex flex-col justify-between gap-4"
    >
      <div className="relative z-10">
        <FaQuoteLeft className="w-4 h-4 text-indigo-light/60 mb-3" />
        <p className="text-gray-light-2 leading-relaxed line-clamp-4">
          {fb.feedback}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-none w-9 h-9 rounded-full bg-gradient-to-br from-indigo-light to-indigo-dark flex items-center justify-center text-white font-semibold">
            {fb.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-white font-medium truncate">{fb.name}</span>
        </div>
        <Stars rating={fb.rating || 5} />
      </div>
    </SpotlightCard>
  ));

  return (
    <section className="w-full relative select-none py-16">
      <div className="section-container flex flex-col mb-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-widest text-gray-light-1"
        >
          {getTranslation(language, "testimonialsLabel")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl mt-2 font-medium text-gradient w-fit"
        >
          {getTranslation(language, "testimonialsTitle")}
        </motion.h1>
      </div>

      {testimonials.length >= MIN_FOR_MARQUEE ? (
        <div
          className="marquee w-full"
          style={{ "--marquee-duration": `${Math.max(testimonials.length * 6, 30)}s` }}
        >
          <div className="marquee-track py-2">
            <div className="flex">{cards}</div>
            <div className="flex" aria-hidden="true">{cards}</div>
          </div>
        </div>
      ) : (
        <div className="section-container flex flex-wrap justify-center gap-y-6 py-2">
          {cards}
        </div>
      )}
    </section>
  );
};

export default Testimonials;
