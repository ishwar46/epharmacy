import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll position
 * @param {number} throttleMs - Throttle scroll events (default: 100ms)
 * @returns {number} Current scroll position
 */
export const useScrollPosition = (throttleMs = 100) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let timeoutId = null;

    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    const onScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updatePosition, throttleMs);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updatePosition(); // Set initial position

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, [throttleMs]);

  return scrollPosition;
};