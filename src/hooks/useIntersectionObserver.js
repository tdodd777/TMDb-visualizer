import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer
 * Detects when an element enters the viewport
 *
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Percentage of visibility to trigger (0-1)
 * @param {string} options.rootMargin - Margin around root element
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @returns {Object} - { ref, isVisible, hasBeenVisible }
 */
export const useIntersectionObserver = ({
  threshold = 0.2,
  rootMargin = '0px',
  triggerOnce = true,
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;

    // Check if IntersectionObserver is supported
    if (!currentElement || typeof IntersectionObserver === 'undefined') {
      // Fallback: immediately visible if not supported
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    // Callback when intersection changes
    const handleIntersection = (entries) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasBeenVisible(true);

        // Disconnect observer if triggerOnce is true
        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else {
        // Only update if not triggerOnce
        if (!triggerOnce) {
          setIsVisible(false);
        }
      }
    };

    // Create observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Start observing
    observerRef.current.observe(currentElement);

    // Cleanup
    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return {
    ref: elementRef,
    isVisible,
    hasBeenVisible,
  };
};
