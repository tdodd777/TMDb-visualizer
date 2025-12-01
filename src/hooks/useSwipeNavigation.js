import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for detecting horizontal swipe gestures on trackpad and touch devices
 * Supports two-finger trackpad swipes and mobile touch swipes for navigation
 *
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Callback for left swipe (forward navigation)
 * @param {Function} options.onSwipeRight - Callback for right swipe (back navigation)
 * @param {number} options.threshold - Minimum horizontal distance to trigger swipe (default: 360px)
 * @param {number} options.cooldown - Cooldown period between swipes in ms (default: 500ms)
 * @param {boolean} options.disabled - Disable the hook (default: false)
 * @returns {Object} - { isSwipingLeft, isSwipingRight, swipeProgress }
 */
export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 360,
  cooldown = 500,
  disabled = false,
} = {}) => {
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0 to 1

  const touchStartRef = useRef(null);
  const wheelAccumulatorRef = useRef(0);
  const lastSwipeTimeRef = useRef(0);
  const isSwipingRef = useRef(false);
  const swipeTimeoutRef = useRef(null);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Reset swipe visual feedback
  const resetSwipeState = useCallback(() => {
    setIsSwipingLeft(false);
    setIsSwipingRight(false);
    setSwipeProgress(0);
    isSwipingRef.current = false;
  }, []);

  // Check if element should be ignored
  const shouldIgnoreElement = useCallback((target) => {
    if (!target) return false;

    // Ignore inputs, textareas, and contenteditable elements
    const tagName = target.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tagName)) {
      return true;
    }

    if (target.isContentEditable) {
      return true;
    }

    // Ignore elements with overflow scroll
    const overflowY = window.getComputedStyle(target).overflowY;
    if (['auto', 'scroll'].includes(overflowY) && target.scrollHeight > target.clientHeight) {
      return true;
    }

    return false;
  }, []);

  // Handle trackpad wheel events
  const handleWheel = useCallback((e) => {
    if (disabled || prefersReducedMotion.current) return;
    if (shouldIgnoreElement(e.target)) return;

    const now = Date.now();
    const timeSinceLastSwipe = now - lastSwipeTimeRef.current;

    // Cooldown check
    if (timeSinceLastSwipe < cooldown) return;

    // Only handle horizontal scrolling (trackpad horizontal swipe)
    const deltaX = e.deltaX;
    const deltaY = Math.abs(e.deltaY);
    const absDeltaX = Math.abs(deltaX);

    // Ignore if vertical movement is dominant (user is scrolling)
    if (deltaY > absDeltaX) {
      wheelAccumulatorRef.current = 0;
      resetSwipeState();
      return;
    }

    // Accumulate horizontal movement
    if (absDeltaX > 5) { // Increased minimum sensitivity for more resistance
      wheelAccumulatorRef.current += deltaX;

      // Update visual feedback
      const progress = Math.min(Math.abs(wheelAccumulatorRef.current) / threshold, 1);
      setSwipeProgress(progress);

      if (wheelAccumulatorRef.current < 0) {
        setIsSwipingRight(true);
        setIsSwipingLeft(false);
      } else {
        setIsSwipingLeft(true);
        setIsSwipingRight(false);
      }

      // Clear existing timeout
      if (swipeTimeoutRef.current) {
        clearTimeout(swipeTimeoutRef.current);
      }

      // Check threshold
      if (Math.abs(wheelAccumulatorRef.current) >= threshold && !isSwipingRef.current) {
        isSwipingRef.current = true;
        lastSwipeTimeRef.current = now;

        if (wheelAccumulatorRef.current < 0) {
          // Swipe right - go back
          onSwipeRight?.();
        } else {
          // Swipe left - go forward
          onSwipeLeft?.();
        }

        // Reset after action
        wheelAccumulatorRef.current = 0;
        setTimeout(resetSwipeState, 300);
      } else {
        // Reset accumulator if no action within 150ms
        swipeTimeoutRef.current = setTimeout(() => {
          wheelAccumulatorRef.current = 0;
          resetSwipeState();
        }, 150);
      }
    }
  }, [disabled, cooldown, threshold, onSwipeLeft, onSwipeRight, shouldIgnoreElement, resetSwipeState]);

  // Handle touch events
  const handleTouchStart = useCallback((e) => {
    if (disabled || prefersReducedMotion.current) return;
    if (shouldIgnoreElement(e.target)) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, [disabled, shouldIgnoreElement]);

  const handleTouchMove = useCallback((e) => {
    if (disabled || prefersReducedMotion.current) return;
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Ignore if vertical movement is dominant
    if (absDeltaY > absDeltaX) {
      resetSwipeState();
      return;
    }

    // Update visual feedback
    const progress = Math.min(absDeltaX / threshold, 1);
    setSwipeProgress(progress);

    if (deltaX > 0) {
      setIsSwipingRight(true);
      setIsSwipingLeft(false);
    } else {
      setIsSwipingLeft(true);
      setIsSwipingRight(false);
    }
  }, [disabled, threshold, resetSwipeState]);

  const handleTouchEnd = useCallback((e) => {
    if (disabled || prefersReducedMotion.current) return;
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const now = Date.now();
    const timeSinceLastSwipe = now - lastSwipeTimeRef.current;

    // Cooldown check
    if (timeSinceLastSwipe < cooldown) {
      resetSwipeState();
      touchStartRef.current = null;
      return;
    }

    // Check if horizontal swipe
    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      lastSwipeTimeRef.current = now;

      if (deltaX > 0) {
        // Swipe right - go back
        onSwipeRight?.();
      } else {
        // Swipe left - go forward
        onSwipeLeft?.();
      }
    }

    setTimeout(resetSwipeState, 300);
    touchStartRef.current = null;
  }, [disabled, cooldown, threshold, onSwipeLeft, onSwipeRight, resetSwipeState]);

  // Attach event listeners
  useEffect(() => {
    if (disabled || prefersReducedMotion.current) return;

    const options = { passive: true };

    window.addEventListener('wheel', handleWheel, options);
    window.addEventListener('touchstart', handleTouchStart, options);
    window.addEventListener('touchmove', handleTouchMove, options);
    window.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (swipeTimeoutRef.current) {
        clearTimeout(swipeTimeoutRef.current);
      }
    };
  }, [disabled, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isSwipingLeft,
    isSwipingRight,
    swipeProgress,
  };
};

export default useSwipeNavigation;
