import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { FoodItem, DbItem } from '../types';
import { dbItemToFoodItem, foodItemToDbInsert } from '../lib/type-mappers';
import { searchItems } from '../lib/search';
import { mockFoodItems } from '../data/mockData';
import { useDebounce } from '../lib/search';

interface InventoryFilters {
  category: string;
  stock: string;
  rating: string;
}

interface UseInventorySearchResult {
  // Data
  items: FoodItem[];
  allItems: FoodItem[];
  loading: boolean;
  error: string | null;
  usingMockData: boolean;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Filters
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  stockFilter: string;
  setStockFilter: (stock: string) => void;
  ratingFilter: string;
  setRatingFilter: (rating: string) => void;
  categories: string[];
  
  // Actions
  addItem: (item: Omit<FoodItem, 'id' | 'last_edited' | 'created_at' | 'updated_at'>) => Promise<FoodItem>;
  updateItem: (id: number, updates: Partial<FoodItem>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  toggleStock: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
  
  // Stats
  outOfStockItems: FoodItem[];
}

export function useInventorySearch(): UseInventorySearchResult {
  const queryClient = useQueryClient();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  
  // Mock data fallback state
  const [usingMockData, setUsingMockData] = useState(false);
  const [mockItems, setMockItems] = useState<FoodItem[]>([]);

  // Load all items from database (cached)
  const {
    data: allItems = [],
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      console.log('🔄 Loading items from Supabase...');
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');
      
      if (error) {
        console.warn('⚠️ Supabase connection failed, falling back to mock data:', error.message);
        setUsingMockData(true);
        setMockItems(mockFoodItems);
        return mockFoodItems;
      }
      
      if (data && data.length > 0) {
        console.log('✅ Loaded data from Supabase:', data.length, 'items');
        const mappedItems = data.map(dbItemToFoodItem);
        setUsingMockData(false);
        return mappedItems;
      } else {
        console.log('ℹ️ Database is empty, using mock data');
        setUsingMockData(true);
        setMockItems(mockFoodItems);
        return mockFoodItems;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Search items using full-text search (only when we have a search query and real data)
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError
  } = useQuery({
    queryKey: ['search-inventory', debouncedSearchQuery, categoryFilter, stockFilter],
    queryFn: async () => {
      if (usingMockData) {
        return null; // Don't search when using mock data
      }
      
      const searchOptions = {
        includeInactive: stockFilter !== 'in-stock',
        categories: categoryFilter !== 'all' ? [categoryFilter] : [],
        sortBy: 'relevance' as const,
        limit: 1000, // Get all matching items
      };

      const result = await searchItems(debouncedSearchQuery, searchOptions);
      return result.items;
    },
    enabled: !usingMockData && debouncedSearchQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Determine which items to use and apply client-side filtering
  const items = useMemo(() => {
    const baseItems = usingMockData ? mockItems : 
      (debouncedSearchQuery.length >= 2 && searchResults) ? searchResults : allItems;
    
    return baseItems.filter(item => {
      // For mock data, apply search filtering client-side
      let matchesSearch = true;
      if (debouncedSearchQuery && usingMockData) {
        const query = debouncedSearchQuery.toLowerCase();
        matchesSearch = item.name.toLowerCase().includes(query) ||
                       item.brand?.toLowerCase().includes(query) ||
                       item.category.toLowerCase().includes(query) ||
                       item.ingredients?.toLowerCase().includes(query);
      }
      
      // Apply filters
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'in-stock' && item.in_stock) ||
                          (stockFilter === 'out-of-stock' && !item.in_stock);
      const matchesRating = ratingFilter === 'all' ||
                           (ratingFilter === 'unrated' && !item.rating) ||
                           (ratingFilter !== 'unrated' && item.rating === parseInt(ratingFilter));
      
      return matchesSearch && matchesCategory && matchesStock && matchesRating;
    });
  }, [allItems, mockItems, searchResults, debouncedSearchQuery, usingMockData, categoryFilter, stockFilter, ratingFilter]);

  // Derive categories from current items
  const categories = useMemo(() => {
    const baseItems = usingMockData ? mockItems : allItems;
    return Array.from(new Set(baseItems.map(item => item.category)));
  }, [allItems, mockItems, usingMockData]);

  // Loading state
  const loading = isLoadingItems || (isSearching && !usingMockData);
  
  // Error state  
  const error = itemsError ? 
    (usingMockData ? 'Using mock data - database connection unavailable' : 
     itemsError instanceof Error ? itemsError.message : 'Failed to load items') :
    searchError instanceof Error ? searchError.message : null;

  // Stats
  const outOfStockItems = useMemo(() => 
    items.filter(item => !item.in_stock), [items]);

  // Actions
  const addItem = async (itemData: Omit<FoodItem, 'id' | 'last_edited' | 'created_at' | 'updated_at'>) => {
    try {
      // If using mock data, add to local state only
      if (usingMockData) {
        const newItem: FoodItem = {
          ...itemData,
          id: Date.now(),
          last_edited: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setMockItems(prev => [...prev, newItem]);
        return newItem;
      }

      // Otherwise, add to Supabase
      const now = new Date().toISOString();
      const dbItem = foodItemToDbInsert({
        ...itemData,
        last_edited: now,
        created_at: now,
        updated_at: now,
      });

      const { data, error } = await supabase
        .from('items')
        .insert([dbItem])
        .select()
        .single();

      if (error) {
        if (error.code === '23505' && error.message.includes('ux_items_normalized_name')) {
          const duplicateError = new Error(`An item with the name "${itemData.name}" already exists in your inventory.`);
          duplicateError.name = 'DuplicateItemError';
          throw duplicateError;
        }
        throw error;
      }

      const newItem = dbItemToFoodItem(data as DbItem);
      
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['search-inventory'] });
      
      return newItem;
    } catch (err) {
      if (err instanceof Error && err.name === 'DuplicateItemError') {
        throw err;
      }

      // Fall back to local mock mode
      console.warn('Add item failed, falling back to local mock mode:', err);
      const now = new Date().toISOString();
      const newItem: FoodItem = {
        ...itemData,
        id: Date.now(),
        last_edited: now,
        created_at: now,
        updated_at: now,
      };
      setMockItems(prev => [...prev, newItem]);
      setUsingMockData(true);
      return newItem;
    }
  };

  const updateItem = async (id: number, updates: Partial<FoodItem>) => {
    try {
      // If using mock data, update local state only
      if (usingMockData) {
        const now = new Date().toISOString();
        setMockItems(prev => prev.map(item => 
          item.id === id 
            ? { ...item, ...updates, last_edited: now, updated_at: now }
            : item
        ));
        return;
      }

      // Update in Supabase
      const now = new Date().toISOString();
      const updateData: Record<string, unknown> = {};
      
      // Map updates to database fields
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.brand !== undefined) updateData.brand = updates.brand || null;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.in_stock !== undefined) updateData.in_stock = updates.in_stock;
      if (updates.price !== undefined) updateData.price = updates.price || null;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url || null;
      if (updates.rating !== undefined) updateData.rating = updates.rating || null;
      if (updates.serving_size !== undefined) updateData.serving_size_grams = updates.serving_size || null;
      if (updates.serving_quantity !== undefined) updateData.serving_quantity = updates.serving_quantity || null;
      if (updates.serving_unit !== undefined) updateData.serving_unit = updates.serving_unit || null;
      if (updates.serving_unit_type !== undefined) updateData.serving_unit_type = updates.serving_unit_type || null;
      if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients || null;
      if (updates.notes !== undefined) updateData.notes = updates.notes || null;

      if (updates.nutrition) {
        if (updates.nutrition.calories_per_serving !== undefined) updateData.calories_per_serving = updates.nutrition.calories_per_serving || null;
        if (updates.nutrition.carbs_per_serving !== undefined) updateData.carbs_per_serving = updates.nutrition.carbs_per_serving || null;
        if (updates.nutrition.fat_per_serving !== undefined) updateData.fat_per_serving = updates.nutrition.fat_per_serving || null;
        if (updates.nutrition.protein_per_serving !== undefined) updateData.protein_per_serving = updates.nutrition.protein_per_serving || null;
      }
      
      updateData.last_edited = now;
      
      const { error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['search-inventory'] });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      throw new Error(errorMessage);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      // If using mock data, delete from local state only
      if (usingMockData) {
        setMockItems(prev => prev.filter(item => item.id !== id));
        return;
      }

      // Delete from Supabase
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['search-inventory'] });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      throw new Error(errorMessage);
    }
  };

  const toggleStock = async (id: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      await updateItem(id, { in_stock: !item.in_stock });
    }
  };

  return {
    // Data
    items,
    allItems: usingMockData ? mockItems : allItems,
    loading,
    error,
    usingMockData,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Filters
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    ratingFilter,
    setRatingFilter,
    categories,
    
    // Actions
    addItem,
    updateItem,
    deleteItem,
    toggleStock,
    refetch: refetchItems,
    
    // Stats
    outOfStockItems,
  };
}