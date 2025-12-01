import React from 'react';

/**
 * Visual indicator for swipe navigation gestures
 * Shows a subtle edge indicator (like iOS/Chrome) when user is swiping
 *
 * @param {Object} props
 * @param {boolean} props.isSwipingLeft - Whether user is swiping left
 * @param {boolean} props.isSwipingRight - Whether user is swiping right
 * @param {number} props.progress - Swipe progress from 0 to 1
 */
const SwipeIndicator = ({ isSwipingLeft, isSwipingRight, progress = 0 }) => {
  if (!isSwipingLeft && !isSwipingRight) return null;

  const opacity = Math.min(progress * 2, 1); // Fade in as user swipes
  const translateX = progress * 20; // Subtle movement

  return (
    <>
      {/* Right edge indicator - swipe right to go back */}
      {isSwipingRight && (
        <div
          className="fixed left-0 top-0 bottom-0 w-16 pointer-events-none z-50 flex items-center justify-start pl-4 transition-all duration-300 ease-out"
          style={{ opacity }}
        >
          <div
            className="flex items-center gap-2 text-blue-500 transition-all duration-300 ease-out"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <div className="text-sm font-medium text-white/90">Back</div>
          </div>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
            style={{ opacity: opacity * 0.5 }}
          />
        </div>
      )}

      {/* Left edge indicator - swipe left to go forward */}
      {isSwipingLeft && (
        <div
          className="fixed right-0 top-0 bottom-0 w-16 pointer-events-none z-50 flex items-center justify-end pr-4 transition-all duration-300 ease-out"
          style={{ opacity }}
        >
          <div
            className="flex items-center gap-2 text-blue-500 transition-all duration-300 ease-out"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            <div className="text-sm font-medium text-white/90">Forward</div>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent"
            style={{ opacity: opacity * 0.5 }}
          />
        </div>
      )}
    </>
  );
};

export default SwipeIndicator;
