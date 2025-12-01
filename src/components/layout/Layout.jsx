import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import SwipeIndicator from '../ui/SwipeIndicator';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { goBack, goForward, canGoBack, canGoForward } = useApp();

  // Handle swipe navigation
  const handleSwipeRight = () => {
    if (canGoBack) {
      goBack();
    }
  };

  const handleSwipeLeft = () => {
    if (canGoForward) {
      goForward();
    }
  };

  // Use swipe navigation hook
  const { isSwipingLeft, isSwipingRight, swipeProgress } = useSwipeNavigation({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    threshold: 360, // 3x increased resistance for very deliberate gestures
    cooldown: 500,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-4 pt-2 pb-2 md:py-8">
        {children}
      </main>

      <Footer />

      {/* Swipe navigation visual feedback */}
      <SwipeIndicator
        isSwipingLeft={isSwipingLeft && canGoForward}
        isSwipingRight={isSwipingRight && canGoBack}
        progress={swipeProgress}
      />
    </div>
  );
};

export default Layout;
