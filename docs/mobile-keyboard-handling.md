# Mobile Keyboard Handling Guide

This guide outlines best practices for handling virtual keyboards on mobile devices in React web applications, specifically addressing common UX issues where keyboards cover dialog content.

## Common Mobile Keyboard Issues

1. **Content Obscuring**: Virtual keyboard covers input fields and dialog content
2. **Poor Positioning**: Dialogs remain in center while keyboard takes up bottom half
3. **Scroll Issues**: Users can't see what they're typing or navigate properly
4. **Layout Breaks**: Fixed positioning doesn't account for viewport changes

## Implementation Strategy

### 1. Keyboard Detection

Use viewport height changes to detect when the virtual keyboard is visible:

```typescript
const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

useEffect(() => {
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      // Detect if keyboard is likely visible on mobile
      const isMobile = window.innerWidth <= 768;
      const heightDifference = window.screen.height - window.innerHeight;
      const keyboardThreshold = 150; // Adjust based on testing

      if (isMobile && heightDifference > keyboardThreshold) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize(); // Check initial state

  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 2. Auto-Scroll Input Fields

Automatically scroll focused input fields into view when keyboard appears:

```typescript
useEffect(() => {
  const handleFocus = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      setTimeout(() => {
        e.target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 300); // Delay to allow keyboard animation
    }
  };

  document.addEventListener('focusin', handleFocus);
  return () => document.removeEventListener('focusin', handleFocus);
}, []);
```

### 3. Dynamic Dialog Sizing

Adjust dialog dimensions and positioning based on keyboard state:

```tsx
<DialogContent
  className={`max-w-2xl ${isKeyboardVisible ? 'max-h-[50vh]' : 'max-h-[90vh]'} overflow-y-auto`}
  style={isKeyboardVisible ? {
    position: 'fixed',
    top: '10px',
    transform: 'translateX(-50%)',
    left: '50%'
  } : undefined}
>
```

### 4. Responsive Content Areas

Reduce content area heights when keyboard is visible:

```tsx
<div className={`${isKeyboardVisible ? 'max-h-32' : 'max-h-64'} overflow-y-auto`}>
  {/* Scrollable content */}
</div>
```

### 5. Input Optimizations

Use appropriate input attributes for better mobile experience:

```tsx
<Input
  ref={inputRef}
  autoComplete="off"
  inputMode="search" // or "text", "email", "numeric", etc.
  placeholder="Search..."
  className="touch-friendly-class"
/>
```

## Best Practices

### Layout Guidelines

1. **Touch Targets**: Minimum 44px height for touch-friendly interaction
2. **Dynamic Heights**: Use viewport units that adapt (vh, dvh where supported)
3. **Fixed Positioning**: Avoid fixed positioning that doesn't account for keyboard
4. **Scroll Containers**: Ensure scrollable areas work with reduced heights

### UX Considerations

1. **Visual Feedback**: Provide clear indication when keyboard affects layout
2. **Smooth Transitions**: Use CSS transitions for height/position changes
3. **Fallback Behavior**: Graceful degradation when detection fails
4. **Testing**: Test on various devices and screen sizes

### Performance Tips

1. **Debounce Resize**: Limit resize event frequency if needed
2. **Cleanup Listeners**: Always remove event listeners in useEffect cleanup
3. **Conditional Logic**: Only apply mobile optimizations on mobile devices
4. **Memory Management**: Clean up state when components unmount

## Testing Checklist

- [ ] Test on iOS Safari (iPhone/iPad)
- [ ] Test on Android Chrome
- [ ] Test with different keyboard types (search, numeric, email)
- [ ] Test landscape and portrait orientations
- [ ] Test with browser zoom enabled
- [ ] Verify input fields remain visible when focused
- [ ] Check dialog positioning and sizing
- [ ] Ensure scrollable areas work correctly

## Implementation Example

See `src/components/MealRelogDialog.tsx` for a complete implementation example that:

- Detects keyboard visibility using viewport changes
- Adjusts dialog height and position dynamically
- Auto-scrolls focused inputs into view
- Reduces content area heights appropriately
- Provides smooth user experience across devices

## Browser Compatibility

- **iOS Safari**: Full support with viewport detection
- **Android Chrome**: Full support with viewport detection
- **Firefox Mobile**: Partial support (some detection edge cases)
- **Samsung Internet**: Good support with minor variations

## Troubleshooting

### Common Issues

1. **False Positives**: Adjust `keyboardThreshold` value for your use case
2. **Scroll Conflicts**: Ensure parent containers don't interfere with scrollIntoView
3. **iOS Safari Quirks**: May need additional handling for address bar behavior
4. **Timing Issues**: Adjust setTimeout delays for different devices

### Debug Tips

```typescript
// Add debug logging to understand behavior
console.log('Screen height:', window.screen.height);
console.log('Inner height:', window.innerHeight);
console.log('Height difference:', window.screen.height - window.innerHeight);
```

Remember to remove debug logs in production builds.