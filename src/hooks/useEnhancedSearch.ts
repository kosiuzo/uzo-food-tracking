import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  searchItems, 
  searchRecipes, 
  searchTags, 
  searchMealLogs,
  globalSearch,
  getSearchSuggestions,
  useDebounce,
  SearchOptions,
  SearchResult,
  GlobalSearchResult 
} from '../lib/search';
import { FoodItem, Recipe, Tag, MealLog } from '../types';

/**
 * Enhanced search hook for food items with debouncing and caching
 */
export function useItemSearch(initialQuery = '', options: SearchOptions = {}) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: searchResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['search-items', debouncedQuery, options],
    queryFn: () => searchItems(debouncedQuery, options),
    enabled: debouncedQuery.length >= 2 || debouncedQuery === '',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    query,
    setQuery,
    items: searchResult?.items || [],
    total: searchResult?.total || 0,
    hasMore: searchResult?.hasMore || false,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Enhanced search hook for recipes with debouncing and caching
 */
export function useRecipeSearch(initialQuery = '', options: SearchOptions = {}) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: searchResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['search-recipes', debouncedQuery, options],
    queryFn: () => searchRecipes(debouncedQuery, options),
    enabled: debouncedQuery.length >= 2 || debouncedQuery === '',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    query,
    setQuery,
    recipes: searchResult?.items || [],
    total: searchResult?.total || 0,
    hasMore: searchResult?.hasMore || false,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Enhanced search hook for tags with debouncing and caching
 */
export function useTagSearch(initialQuery = '', options: SearchOptions = {}) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: searchResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['search-tags', debouncedQuery, options],
    queryFn: () => searchTags(debouncedQuery, options),
    enabled: debouncedQuery.length >= 2 || debouncedQuery === '',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    query,
    setQuery,
    tags: searchResult?.items || [],
    total: searchResult?.total || 0,
    hasMore: searchResult?.hasMore || false,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Global search hook that searches across all entity types
 */
export function useGlobalSearch(initialQuery = '', options: Partial<SearchOptions> = {}) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: searchResult,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['global-search', debouncedQuery, options],
    queryFn: () => globalSearch(debouncedQuery, options),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    query,
    setQuery,
    results: searchResult || {
      items: [],
      recipes: [],
      tags: [],
      mealLogs: [],
      total: 0
    },
    isLoading,
    error,
    refetch,
  };
}

/**
 * Search suggestions hook with debouncing
 */
export function useSearchSuggestions(
  query: string, 
  type?: 'items' | 'recipes' | 'tags'
) {
  const debouncedQuery = useDebounce(query, 200);

  const {
    data: suggestions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery, type],
    queryFn: () => getSearchSuggestions(debouncedQuery, type),
    enabled: debouncedQuery.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    suggestions,
    isLoading,
    error,
  };
}

/**
 * Multi-entity search hook for complex search scenarios
 */
export function useMultiEntitySearch() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    tags: number[];
    includeInactive: boolean;
  }>({
    categories: [],
    tags: [],
    includeInactive: false,
  });

  const debouncedQuery = useDebounce(query, 300);

  // Search items
  const itemsQuery = useQuery({
    queryKey: ['multi-search-items', debouncedQuery, activeFilters],
    queryFn: () => searchItems(debouncedQuery, {
      categories: activeFilters.categories,
      includeInactive: activeFilters.includeInactive,
      limit: 20,
    }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 3 * 60 * 1000,
  });

  // Search recipes
  const recipesQuery = useQuery({
    queryKey: ['multi-search-recipes', debouncedQuery, activeFilters],
    queryFn: () => searchRecipes(debouncedQuery, {
      tags: activeFilters.tags,
      limit: 20,
    }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 3 * 60 * 1000,
  });

  const addCategoryFilter = useCallback((category: string) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  }, []);

  const removeCategoryFilter = useCallback((category: string) => {
    setActiveFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  }, []);

  const addTagFilter = useCallback((tagId: number) => {
    setActiveFilters(prev => ({
      ...prev,
      tags: [...prev.tags, tagId]
    }));
  }, []);

  const removeTagFilter = useCallback((tagId: number) => {
    setActiveFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagId)
    }));
  }, []);

  const toggleIncludeInactive = useCallback(() => {
    setActiveFilters(prev => ({
      ...prev,
      includeInactive: !prev.includeInactive
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      categories: [],
      tags: [],
      includeInactive: false,
    });
  }, []);

  return {
    query,
    setQuery,
    activeFilters,
    
    // Results
    items: itemsQuery.data?.items || [],
    recipes: recipesQuery.data?.items || [],
    
    // Loading states
    isLoadingItems: itemsQuery.isLoading,
    isLoadingRecipes: recipesQuery.isLoading,
    isLoading: itemsQuery.isLoading || recipesQuery.isLoading,
    
    // Errors
    itemsError: itemsQuery.error,
    recipesError: recipesQuery.error,
    
    // Filter controls
    addCategoryFilter,
    removeCategoryFilter,
    addTagFilter,
    removeTagFilter,
    toggleIncludeInactive,
    clearAllFilters,
    
    // Refetch
    refetchItems: itemsQuery.refetch,
    refetchRecipes: recipesQuery.refetch,
    refetchAll: () => {
      itemsQuery.refetch();
      recipesQuery.refetch();
    },
  };
}

/**
 * Recent searches hook for maintaining search history
 */
export function useRecentSearches(maxItems = 10) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to parse recent searches from localStorage');
      }
    }
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || trimmedQuery.length < 2) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(search => search !== trimmedQuery);
      const updated = [trimmedQuery, ...filtered].slice(0, maxItems);
      
      // Save to localStorage
      try {
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent searches to localStorage');
      }
      
      return updated;
    });
  }, [maxItems]);

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(search => search !== query);
      
      // Save to localStorage
      try {
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent searches to localStorage');
      }
      
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}