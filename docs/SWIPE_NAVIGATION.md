# Swipe Navigation Feature

## Overview

The TMDb Visualizer now supports intuitive swipe gestures for navigating back and forward through your browsing history, providing a native app-like experience on both desktop and mobile devices.

## Supported Gestures

### Desktop (Trackpad)
- **Two-finger horizontal swipe right** → Go back
- **Two-finger horizontal swipe left** → Go forward

### Mobile (Touch)
- **Swipe right (finger moves left-to-right)** → Go back
- **Swipe left (finger moves right-to-left)** → Go forward

## Features

### Smart Detection
- **Threshold-based**: Requires minimum 360px horizontal movement for very deliberate gestures
- **Direction-aware**: Ignores accidental vertical scrolling
- **Element-aware**: Automatically disabled on inputs, textareas, and scrollable areas
- **Cooldown protection**: 500ms cooldown prevents accidental multiple triggers

### Visual Feedback
- **Real-time indicators**: Edge overlays show swipe direction and progress
- **Progress tracking**: Visual feedback scales with swipe distance
- **iOS/Chrome-style**: Familiar edge indicators with gradient overlays
- **Smooth animations**: Enhanced 300ms ease-out transitions with cubic-bezier easing
- **View transitions**: Smooth 400ms fade-in animations when navigating between views

### Accessibility
- **Respects reduced motion**: Automatically disabled if user has `prefers-reduced-motion` enabled
- **Non-intrusive**: Only shows when history is available
- **No interference**: Doesn't interfere with normal scrolling or interactions

## Architecture

### Components

#### `useSwipeNavigation` Hook
Location: `/src/hooks/useSwipeNavigation.js`

Custom React hook that handles all swipe detection logic:
- Wheel event listener for trackpad swipes
- Touch events (touchstart, touchmove, touchend) for mobile swipes
- Smart filtering to prevent false positives
- Returns swipe state and progress for visual feedback

**Usage:**
```javascript
const { isSwipingLeft, isSwipingRight, swipeProgress } = useSwipeNavigation({
  onSwipeRight: handleBackNavigation,
  onSwipeLeft: handleForwardNavigation,
  threshold: 360,     // pixels (default: 360)
  cooldown: 500,      // milliseconds (default: 500)
  disabled: false,    // optional disable flag
});
```

#### `SwipeIndicator` Component
Location: `/src/components/ui/SwipeIndicator.jsx`

Visual feedback component that displays edge indicators:
- Shows direction arrow and label
- Animates with swipe progress
- Gradient overlay for depth effect
- Fixed positioning on screen edges

#### AppContext Navigation Stack
Location: `/src/context/AppContext.jsx`

Extended navigation system:
- `navigationStack`: Array of view states
- `navigationIndex`: Current position in history
- `goBack()`: Navigate to previous view
- `goForward()`: Navigate to next view
- `canGoBack`: Boolean flag for back availability
- `canGoForward`: Boolean flag for forward availability

### Integration

The swipe navigation is integrated into the `Layout` component, making it available globally across the entire app.

## Edge Cases Handled

1. **No History**: Swipe indicators only appear when navigation is possible
2. **Input Fields**: Disabled when user is typing in inputs/textareas
3. **Scrollable Areas**: Doesn't interfere with vertical scrolling
4. **Modal Open**: Works even when modals are active
5. **Rapid Gestures**: Cooldown prevents accidental double-triggers
6. **Reduced Motion**: Respects user accessibility preferences

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Safari (macOS/iOS)
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Passive event listeners**: No scroll performance impact
- **Debounced accumulation**: Efficient gesture detection
- **Minimal re-renders**: Optimized with refs and callbacks
- **Cleanup**: Proper event listener removal on unmount

## Configuration

The hook accepts these configuration options:

```javascript
{
  onSwipeRight: Function,   // Back navigation callback
  onSwipeLeft: Function,    // Forward navigation callback
  threshold: 360,           // Minimum pixels to trigger (default: 360)
  cooldown: 500,            // Cooldown between swipes in ms (default: 500)
  disabled: false,          // Disable the feature (default: false)
}
```

## Testing

### Manual Testing Steps

1. **Desktop Trackpad:**
   - Navigate to a show from search
   - Use two-finger horizontal swipe right to go back to search
   - Use two-finger horizontal swipe left to return to show

2. **Mobile Touch:**
   - Navigate to a show from search
   - Swipe right (finger left-to-right) to go back
   - Swipe left (finger right-to-left) to go forward

3. **Edge Cases:**
   - Try swiping in an input field (should be disabled)
   - Try vertical scrolling (should not trigger navigation)
   - Try rapid swipes (cooldown should prevent multiple triggers)

### Expected Behavior

- ✅ Visual indicators appear at screen edges during swipe
- ✅ Indicators fade in proportionally to swipe distance
- ✅ Navigation occurs when threshold (360px) is reached
- ✅ Smooth transitions between views
- ✅ History stack maintained correctly

## Future Enhancements

Potential improvements:
- [ ] Customizable threshold per device type
- [ ] Haptic feedback on mobile devices
- [ ] Keyboard shortcuts (Alt+Left/Right Arrow)
- [ ] Animation preloading for smoother transitions
- [ ] Gesture history analytics

## Troubleshooting

### Swipes Not Working
1. Check if `prefers-reduced-motion` is enabled in OS settings
2. Verify browser supports wheel/touch events
3. Ensure navigation history exists (canGoBack/canGoForward)

### False Triggers
1. Increase `threshold` value
2. Adjust `cooldown` duration
3. Check for conflicting event listeners

### Performance Issues
1. Event listeners are passive by default
2. All event handlers use refs to avoid re-renders
3. Timeouts are properly cleaned up

## License

Part of the TMDb Visualizer project.
