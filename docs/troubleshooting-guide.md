# Troubleshooting Guide

This document captures common issues, their symptoms, root causes, and solutions to help with faster debugging and resolution.

## MultiSelect Component Issues

### Issue: Tags appearing as "black blobs" or not pre-selecting in edit mode

**Symptoms:**
- MultiSelect shows selected values as unreadable black elements
- Existing tags don't pre-populate when editing recipes
- Tags appear to work in add mode but fail in edit mode

**Root Cause:**
Data type mismatch between database numeric IDs and MultiSelect component expecting string values.

**Technical Details:**
- Database stores `tag.id` as `number`
- MultiSelect component uses `JSON.stringify()` to compare `defaultValue` with internal state
- When types don't match (number vs string), comparison fails
- This causes existing selections to not be recognized

**Solution:**
Ensure consistent string conversion for all MultiSelect values:

```typescript
// ❌ Wrong - mixing number and string types
options={allTags.map(tag => ({ label: tag.name, value: tag.id }))}
selectedTagIds: editingRecipe.tags?.map(tag => tag.id.toString()) || []

// ✅ Correct - consistent string types
options={allTags.map(tag => ({ label: tag.name, value: tag.id.toString() }))}
selectedTagIds: editingRecipe.tags?.map(tag => tag.id.toString()) || []
```

**Files to check:**
- `src/components/AddRecipeDialog.tsx` - MultiSelect options and defaultValue
- Any component using MultiSelect with database IDs

**Prevention:**
- Always convert database numeric IDs to strings for UI components
- Use consistent data types throughout the component hierarchy
- Test both add and edit modes when implementing MultiSelect

---

## Form Component Data Flow Issues

### Issue: Form pre-population fails in edit mode

**Symptoms:**
- Forms work fine for new entries but fail to populate existing data
- Some fields populate correctly while others remain empty
- MultiSelect or similar complex components don't show existing selections

**Common Causes:**
1. **Type Mismatches:** Database types don't match component expected types
2. **Async Timing:** Form initializes before data loads
3. **Reference Equality:** Objects not matching due to different references

**General Debugging Steps:**
1. Check browser console for type-related errors
2. Verify `useEffect` dependency arrays for data loading
3. Log the data being passed to components
4. Check if `defaultValue` matches the component's expected format

**Example Fix Pattern:**
```typescript
// ❌ Potential issue - async data not handled
useEffect(() => {
  if (editingRecipe) {
    setFormData({
      selectedTagIds: editingRecipe.tags?.map(tag => tag.id) // might be undefined initially
    });
  }
}, [editingRecipe]);

// ✅ Better - handle async loading and type consistency
useEffect(() => {
  if (editingRecipe && editingRecipe.tags) {
    setFormData({
      selectedTagIds: editingRecipe.tags.map(tag => tag.id.toString()) // consistent types
    });
  }
}, [editingRecipe]);
```

---

## Database ID Type Issues

### Issue: Inconsistent handling of numeric vs string IDs

**Symptoms:**
- Components work with some data but not others
- Edit functionality breaks while create functionality works
- Search or filtering fails intermittently

**Best Practices:**
1. **Consistent Conversion:** Always convert DB numeric IDs to strings at the boundary
2. **Type Definitions:** Use clear TypeScript types for ID handling
3. **Utility Functions:** Create helper functions for ID conversion

**Example Utility:**
```typescript
// Create in src/lib/utils.ts
export const toStringId = (id: number | string): string => {
  return typeof id === 'string' ? id : id.toString();
};

export const toNumberId = (id: number | string): number => {
  return typeof id === 'number' ? id : parseInt(id, 10);
};
```

---

## Component Library Integration Issues

### Issue: Third-party components not working as expected

**Common Problems:**
- Component expects specific data formats
- Event handlers receive different parameter types than expected
- Styling conflicts with custom CSS

**Debugging Approach:**
1. **Read Component Docs:** Check expected prop types and formats
2. **Check Examples:** Look for official examples of the component usage
3. **Console Logging:** Log props being passed to identify mismatches
4. **Type Definitions:** Check TypeScript definitions for expected interfaces

**Prevention:**
- Always check component documentation for expected data formats
- Test components with both static and dynamic data
- Use TypeScript strictly to catch type mismatches early

---

## Testing Issues

### Issue: Tests pass but functionality fails in browser

**Common Causes:**
- Test data doesn't match real data structure
- Missing async handling in tests
- Browser-specific behavior not covered in tests

**Best Practices:**
- Use realistic test data that matches production data structure
- Test both success and edge cases (empty data, loading states)
- Include E2E tests for critical user flows

---

## Performance Issues

### Issue: Components re-rendering excessively

**Symptoms:**
- UI feels slow or laggy
- Network requests fired multiple times
- Form inputs have delayed responses

**Common Causes:**
- Missing dependency arrays in useEffect
- Objects recreated on every render
- Unnecessary re-renders due to prop changes

**Quick Fixes:**
```typescript
// ❌ Object created on every render
const options = allTags.map(tag => ({ label: tag.name, value: tag.id.toString() }));

// ✅ Memoized to prevent unnecessary re-renders
const options = useMemo(() =>
  allTags.map(tag => ({ label: tag.name, value: tag.id.toString() })),
  [allTags]
);
```

---

## Dialog State Management Issues

### Issue: Dialog updates not reflecting in parent component list

**Symptoms:**
- Dialog shows success message after action (e.g., logging meal)
- Parent component list (e.g., meal logs) doesn't update automatically
- User must refresh page to see new items in list
- Dialog auto-closes but changes aren't visible

**Root Cause:**
Component using separate hook instances instead of sharing state with parent component.

**Technical Details:**
- Child dialog component uses its own `useMealLogs()` hook instance
- Parent component uses different `useMealLogs()` hook instance
- When dialog updates its state, parent state remains unchanged
- React state is isolated per hook instance

**Solution:**
Pass state management functions from parent to child as props:

```typescript
// ❌ Wrong - Dialog uses separate hook instance
export function LogMealDialog({ open, onOpenChange }: Props) {
  const { addMealLogFromItems } = useMealLogs(); // Separate state!
  // ... rest of component
}

// ✅ Correct - Share parent's hook functions
interface LogMealDialogProps {
  // ... other props
  addMealLogFromItems?: (items: string[], notes?: string, rating?: number) => Promise<MealLog>;
}

export function LogMealDialog({ addMealLogFromItems: propAdd, ...props }: LogMealDialogProps) {
  const fallbackHook = useMealLogs();
  const addMealLogFromItems = propAdd || fallbackHook.addMealLogFromItems; // Use prop or fallback
}

// Parent component passes its functions
<LogMealDialog
  addMealLogFromItems={addMealLogFromItems}
  // ... other props
/>
```

**Files affected:**
- Dialog component (e.g., `LogMealDialog.tsx`) - Accept functions as props
- Parent component (e.g., `Meals.tsx`) - Pass hook functions to dialog
- Hook interfaces - Export required functions

**Prevention:**
- Design dialogs to accept state management functions as props
- Use fallback pattern for backward compatibility
- Consider using global state management (Redux, Zustand) for complex state sharing
- Test that parent lists update immediately after dialog actions

**Related UX Issues:**
This issue often occurs alongside auto-closing dialogs that hide the problem. Implement user-controlled dialog closing with clear success states to make state synchronization issues more visible.

---

## When to Update This Guide

Add new issues to this guide when:
- The same issue occurs more than once
- The solution is not immediately obvious
- The issue involves component integration or data flow
- The debugging process was complex or time-consuming

**Template for new issues:**
```markdown
### Issue: [Brief description]

**Symptoms:**
- Bullet point list of what the user sees

**Root Cause:**
Technical explanation of why it happens

**Solution:**
Code examples and specific fixes

**Files affected:**
- List of files that needed changes

**Prevention:**
How to avoid this issue in the future
```