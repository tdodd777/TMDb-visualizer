# Universal Navigation System

## Overview

The TMDb Visualizer now features a comprehensive universal navigation system that tracks your browsing history and allows seamless navigation via both swipe gestures and the home button from any page.

## Navigation Features

### 1. **Universal Home Button**
The ShowGrid logo in the header functions as a home button from **any page**:
- ✅ Works from home page
- ✅ Works from search results
- ✅ Works from Top 100 view
- ✅ Works from Popular Now view
- ✅ Works from show heatmap
- ✅ Works from random show
- ✅ Always returns to clean home state

**Behavior:**
- Clears all search results
- Clears selected show
- Resets navigation history
- Returns to pristine homepage

### 2. **Universal Swipe Navigation**
Swipe gestures work **everywhere** in the app:

#### Desktop (Trackpad):
- **Swipe right** (360px threshold) → Navigate back
- **Swipe left** → Navigate forward (if history exists)

#### Mobile (Touch):
- **Swipe right** → Navigate back
- **Swipe left** → Navigate forward (if history exists)

**Always Available:**
- ✅ From home page (disabled - nowhere to go)
- ✅ From search results → back to previous search/home
- ✅ From Top 100 view → back to home
- ✅ From Popular Now view → back to home
- ✅ From show heatmap → back to search results/browse list
- ✅ From random show → back to previous view

## Navigation Stack Architecture

### Automatic History Tracking

The app maintains a comprehensive navigation stack that tracks state for:

1. **Search Operations**
   - Regular searches via search bar
   - Navigation between different searches

2. **Browse Operations**
   - Top 100 TV Shows
   - Popular Now
   - Random show selection

3. **Show Selection**
   - From search results
   - From browse lists
   - From trending carousel

### Navigation Stack Structure

Each history entry contains:
```javascript
{
  type: 'home' | 'search' | 'show',
  searchResults: [],
  searchQuery: '',
  selectedShow: null | ShowObject
}
```

### Multi-Level Fallback System

The `goBack()` function uses a 3-tier fallback system:

**Tier 1: Navigation Stack (Primary)**
```javascript
if (navigationIndex > 0) {
  // Use modern navigation stack
  // Restore previous state from stack
}
```

**Tier 2: Legacy Navigation (Backup)**
```javascript
if (previousView && previousResults.length > 0) {
  // Use legacy previous view system
  // For backwards compatibility
}
```

**Tier 3: Smart Home Fallback (Always Works)**
```javascript
if (selectedShow || searchResults.length > 0 || searchQuery) {
  // Not on home? Go to home
  // Ensures swipe back always works
}
```

## Usage Examples

### Example 1: Search Flow
```
Home → Search "Breaking Bad" → Select Show → Swipe Right → Back to Results → Swipe Right → Home
```

**Navigation Stack:**
```
[Home] → [Search Results] → [Show] → [Search Results] → [Home]
  ↑         ↑                 ↑            ↑
Index: -1    0                1            0            -1
```

### Example 2: Browse Flow
```
Home → Top 100 → Select Show → Swipe Right → Top 100 → Swipe Right → Home
```

**Navigation Stack:**
```
[Home] → [Top 100] → [Show] → [Top 100] → [Home]
  ↑        ↑          ↑          ↑
Index: -1   0         1          0          -1
```

### Example 3: Random Show
```
Home → Random Show → Swipe Right → Home
```

**Navigation Stack:**
```
[Home] → [Random Show] → [Home]
  ↑          ↑
Index: -1     0           -1
```

### Example 4: Multiple Searches
```
Home → Search "The Wire" → Search "Sopranos" → Swipe Right → "The Wire" → Swipe Right → Home
```

**Navigation Stack:**
```
[Home] → [Wire Results] → [Sopranos Results] → [Wire Results] → [Home]
  ↑         ↑                  ↑                    ↑
Index: -1    0                 1                    0            -1
```

## Smart Navigation Features

### 1. **Context-Aware Back Button**
The `canGoBack` flag is intelligent:
```javascript
canGoBack = navigationIndex > 0 ||              // Stack history exists
            (previousView && previousResults) || // Legacy history exists
            selectedShow !== null ||             // Viewing a show
            searchResults.length > 0 ||          // Has search results
            searchQuery !== '';                  // Has active search
```

**Result:** Back navigation is always available unless you're on a clean home page.

### 2. **Forward Navigation**
```javascript
canGoForward = navigationIndex < navigationStack.length - 1;
```

Only available when you've gone back and there's forward history.

### 3. **Stack Management**
- Branching: New navigation clears forward history
- Cleanup: Going home resets the entire stack
- Persistence: Stack maintained across view changes

## Visual Feedback

### Swipe Indicators
- **Edge indicators** show swipe direction
- **Progress bar** shows distance to threshold (360px)
- **Color coding:**
  - Blue: Back navigation available
  - Grey: No navigation available
- **Labels:** "Back" / "Forward" text on indicators

### Hover States
- **Home button:** Blue text on hover
- **Opacity change:** 80% opacity on logo hover
- **Smooth transitions:** 300ms ease-out

## Accessibility

### Motion Preferences
- Respects `prefers-reduced-motion`
- Disables swipe gestures if motion reduced
- Navigation still available via home button

### Keyboard Navigation
Future enhancement: Alt+Left/Right arrow keys

## Edge Cases Handled

### 1. **Empty Stack with Content**
If navigation stack is empty but user has content:
- ✅ Swipe back → Goes to home
- ✅ Home button → Clears all, goes to home

### 2. **Mid-Stack Navigation**
User at index 3 of 5-item stack, performs new action:
- ✅ Items 4-5 are removed (branching)
- ✅ New state appended
- ✅ Index becomes 4

### 3. **Rapid Navigation**
User swipes multiple times quickly:
- ✅ 500ms cooldown prevents double-triggers
- ✅ Each swipe waits for previous to complete

### 4. **Input Fields**
User swipes while typing:
- ✅ Swipe disabled in inputs/textareas
- ✅ Normal typing behavior preserved

### 5. **Scrolling**
User scrolls vertically while swiping:
- ✅ Vertical movement > horizontal → scroll takes priority
- ✅ No accidental navigation triggers

## Technical Implementation

### Files Modified

1. **src/context/AppContext.jsx**
   - Added `navigationStack` and `navigationIndex` state
   - Enhanced `goBack()` with 3-tier fallback
   - Added `goHome()` function
   - Updated all browse/search functions to track history
   - Enhanced `canGoBack` logic

2. **src/components/layout/Header.jsx**
   - Removed conditional logo disabling
   - Integrated `goHome()` function
   - Added hover states and accessibility

3. **src/components/layout/Layout.jsx**
   - Already integrated with swipe navigation
   - Connects swipe gestures to navigation functions

4. **src/hooks/useSwipeNavigation.js**
   - 360px threshold for deliberate gestures
   - Smart element filtering
   - Respects reduced motion

## Performance Considerations

### Navigation Stack Size
- Typically 5-10 entries max
- Cleared on home button
- Minimal memory footprint

### State Updates
- Optimized with `useCallback`
- Batch state updates where possible
- No unnecessary re-renders

## Future Enhancements

- [ ] Persist navigation stack to localStorage
- [ ] Keyboard shortcuts (Alt+Arrow keys)
- [ ] Breadcrumb navigation UI
- [ ] Animation direction based on navigation (left/right slide)
- [ ] Touch gesture on mobile for forward navigation
- [ ] Navigation analytics tracking

## Testing Checklist

### Basic Navigation
- [ ] Home button works from all pages
- [ ] Swipe right from show → back to results
- [ ] Swipe right from results → back to home
- [ ] Swipe left when forward history exists

### Browse Flows
- [ ] Top 100 → Show → Swipe back → Top 100
- [ ] Popular Now → Show → Swipe back → Popular Now
- [ ] Random → Swipe back → Previous view

### Edge Cases
- [ ] Swipe disabled in search input
- [ ] Vertical scrolling doesn't trigger navigation
- [ ] Multiple rapid swipes handled gracefully
- [ ] Forward navigation after going back
- [ ] Navigation cleared after home button

### Accessibility
- [ ] Works with reduced motion enabled
- [ ] Visual feedback clear and understandable
- [ ] Home button has proper ARIA label

## Summary

The universal navigation system provides:
- ✅ **Consistent behavior** across all pages
- ✅ **Multiple navigation methods** (swipe, home button)
- ✅ **Smart fallbacks** ensure navigation always works
- ✅ **Full history tracking** with forward/back support
- ✅ **Accessibility** and performance optimized
- ✅ **Edge case handling** for robust UX

Users can now navigate naturally through the app using gestures or clicks, with confidence that they can always get back to where they were or return home.
