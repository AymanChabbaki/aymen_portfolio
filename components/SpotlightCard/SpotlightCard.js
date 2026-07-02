import { useRef, useCallback } from "react";

// Glass card with a radial glow that follows the cursor.
// Styling lives in the global .spotlight-card class (globals.scss).
const SpotlightCard = ({ children, className = "", as: Tag = "div", ...rest }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default SpotlightCard;
