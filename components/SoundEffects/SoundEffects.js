import { useEffect } from 'react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const SoundEffects = () => {
  const { 
    playClickSound, 
    playTypingSound
  } = useSoundEffects();

  useEffect(() => {
    // Global click listener
    const handleClick = () => {
      playClickSound();
    };

    // Global typing listener
    const handleKeyPress = (e) => {
      // Only play sound for actual character keys (not modifiers, arrows, etc.)
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
        playTypingSound();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [playClickSound, playTypingSound]);

  // No visual button - sounds are always on
  return null;
};

export default SoundEffects;
