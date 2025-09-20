# Client-Side Search Pattern Guide

This guide documents the client-side search pattern used across the food tracking application for optimal user experience. This pattern provides instant, partial-matching search results without API delays.

## Pattern Overview

Instead of calling backend APIs for each search query, load all data once into React state and filter client-side using JavaScript's `includes()` method for partial matching.

## Benefits

- ⚡ **Instant Results**: No network delays during search
- 🔍 **Partial Matching**: "chick" finds "chicken", "tom" finds "tomato"
- 📱 **Mobile Optimized**: Better experience on mobile devices
- 🔄 **Offline Capable**: Works once data is loaded
- 🎯 **Consistent UX**: Same experience across all features

## Implementation Pattern

### 1. Data Loading Strategy

Load all data once when the component mounts and store in React state:

```typescript
// Load all data once on mount
useEffect(() => {
  loadAllData();
}, []);

const loadAllData = async () => {
  const { data } = await supabase
    .from('table_name')
    .select('*')
    .order('name');

  setAllData(data); // Store in React state for client-side filtering
};
```

### 2. Smart Search Filtering

Use `useMemo` with `includes()` for immediate partial matching:

```typescript
const filteredItems = useMemo(() => {
  if (!searchQuery) return allItems;

  const query = searchQuery.toLowerCase();

  return allItems.filter(item => {
    // Smart search: Check multiple fields for partial matches
    const nameMatch = item.name.toLowerCase().includes(query);
    const brandMatch = item.brand?.toLowerCase().includes(query);
    const categoryMatch = item.category.toLowerCase().includes(query);
    const ingredientsMatch = item.ingredients?.toLowerCase().includes(query);

    return nameMatch || brandMatch || categoryMatch || ingredientsMatch;
  });
}, [allItems, searchQuery]);
```

### 3. Search Input Optimization

Optimize search inputs for mobile and immediate feedback:

```tsx
<Input
  placeholder="Search by name, brand, category, or ingredients..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  autoComplete="off"      // Prevent browser autocomplete
  inputMode="search"      // Mobile keyboard optimization
  className="pl-10"       // Space for search icon
/>
```

### 4. State Management

Keep search state simple and reactive:

```typescript
const [searchQuery, setSearchQuery] = useState('');
// No debouncing needed - client-side filtering is fast enough
// No loading states during search - filtering is synchronous
```

## Current Implementations

This pattern is successfully implemented across three features:

### Meal Re-log Search
- **File**: `src/components/MealRelogDialog.tsx`
- **Data**: All meal logs loaded once
- **Search Fields**: meal name, ingredients
- **Experience**: Instant search through meal history

### Recipe Search
- **File**: `src/hooks/useRecipes.ts`
- **Data**: All recipes loaded once with ingredients and tags
- **Search Fields**: name, instructions, notes, ingredient list, tags
- **Experience**: Find recipes instantly while cooking

### Inventory Search
- **File**: `src/hooks/useInventorySearch.ts`
- **Data**: All food items loaded once
- **Search Fields**: name, brand, category, ingredients
- **Experience**: Quick inventory lookups

## Before vs After Comparison

### Traditional Backend Search (OLD)
```typescript
// ❌ Slow: API call for each search
const performSearch = async (query: string) => {
  setLoading(true);
  const results = await searchAPI(query); // Network delay
  setResults(results);
  setLoading(false);
};

// User types "chick" → API call → wait → show results
```

### Client-Side Search (NEW)
```typescript
// ✅ Fast: Immediate filtering
const filteredResults = allData.filter(item =>
  item.name.toLowerCase().includes(query.toLowerCase())
);

// User types "chick" → instant results
```

## When to Use This Pattern

### ✅ Ideal For:
- Datasets under ~1000 records that fit comfortably in memory
- Data that doesn't change frequently during user sessions
- Search-heavy user workflows
- Mobile applications where network is unreliable
- Real-time filtering and partial matching requirements

### ❌ Not Suitable For:
- Very large datasets (10,000+ records)
- Frequently changing data that requires real-time updates
- Complex search with joins across multiple tables
- When memory usage is a critical constraint

## Performance Considerations

### Memory Usage
- Each record in memory uses ~1-5KB depending on complexity
- 1000 food items ≈ 1-5MB memory usage (acceptable for modern devices)
- Monitor memory usage for larger datasets

### Search Performance
- JavaScript `includes()` is very fast for partial matching
- `useMemo` prevents unnecessary re-filtering
- No network requests = no loading states needed

### Optimization Tips
```typescript
// ✅ Use useMemo to prevent unnecessary filtering
const filteredItems = useMemo(() => {
  return items.filter(/* filtering logic */);
}, [items, searchQuery, otherFilters]);

// ✅ Pre-process search queries
const normalizedQuery = searchQuery.toLowerCase().trim();

// ✅ Early return for empty queries
if (!normalizedQuery) return allItems;
```

## Implementation Checklist

- [ ] Load all data once on component mount
- [ ] Store data in React state (not just React Query cache)
- [ ] Use `useMemo` for filtering to prevent unnecessary recalculations
- [ ] Implement partial matching with `includes()`
- [ ] Search across multiple relevant fields
- [ ] Add mobile-optimized input attributes
- [ ] Remove loading states during search (not needed for client-side)
- [ ] Remove API calls during search operations
- [ ] Test with realistic data volumes
- [ ] Verify memory usage is acceptable

## Mobile UX Enhancements

```tsx
// Mobile-optimized search input
<Input
  autoComplete="off"           // Prevent browser suggestions
  inputMode="search"           // Show search keyboard on mobile
  placeholder="Search..."      // Clear, concise placeholder
  className="touch-friendly"   // Ensure adequate touch targets
/>
```

## Example: Converting Backend Search to Client-Side

### Before (Backend Search)
```typescript
const [searchResults, setSearchResults] = useState([]);
const [isSearching, setIsSearching] = useState(false);

const performSearch = async (query: string) => {
  setIsSearching(true);
  try {
    const results = await searchAPI(query);
    setSearchResults(results);
  } finally {
    setIsSearching(false);
  }
};

// Complex state management, loading states, error handling
```

### After (Client-Side Search)
```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredResults = useMemo(() => {
  if (!searchQuery) return allData;

  const query = searchQuery.toLowerCase();
  return allData.filter(item =>
    item.name.toLowerCase().includes(query)
  );
}, [allData, searchQuery]);

// Simple, immediate, no loading states needed
```

## Testing Strategy

1. **Functionality**: Verify partial matching works correctly
2. **Performance**: Test with realistic data volumes
3. **Memory**: Monitor memory usage during filtering
4. **Mobile**: Test on various devices and screen sizes
5. **Edge Cases**: Empty queries, special characters, very long queries

## Troubleshooting

### Common Issues

1. **Re-filtering on every render**
   - **Solution**: Wrap filtering logic in `useMemo`

2. **Search not working for some fields**
   - **Solution**: Check for null/undefined values before calling `includes()`

3. **Memory usage too high**
   - **Solution**: Consider pagination or virtual scrolling for large datasets

4. **Inconsistent results**
   - **Solution**: Ensure consistent case normalization and string handling

## Related Documentation

- [Mobile Keyboard Handling Guide](./mobile-keyboard-handling.md)
- [Troubleshooting Guide](./troubleshooting-guide.md)
- See implementation examples in:
  - `src/components/MealRelogDialog.tsx`
  - `src/hooks/useRecipes.ts`
  - `src/hooks/useInventorySearch.ts`