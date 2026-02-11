import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

  const fireEmoji = useCallback((emoji = '🎉') => {
    const scalar = 2;
    const unicorn = confetti.shapeFromText({ text: emoji, scalar });

    confetti({
      shapes: [unicorn],
      particleCount: 30,
      spread: 360,
      scalar,
      startVelocity: 30,
      gravity: 0.5,
      ticks: 300,
    });
  }, []);

  const fireSideCannons = useCallback(() => {
    const end = Date.now() + 2 * 1000;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#667eea', '#764ba2', '#8b31ff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#667eea', '#764ba2', '#8b31ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const fireRocket = useCallback(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        particleCount: 100,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        },
        colors: ['#667eea', '#764ba2', '#8b31ff', '#fbbf24']
      });
    }, 200);
  }, []);

  return { fireConfetti, fireEmoji, fireSideCannons, fireRocket };
};
