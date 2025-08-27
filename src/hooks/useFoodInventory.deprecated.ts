import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FoodItem, DbItem } from '../types';
import { dbItemToFoodItem, foodItemToDbInsert } from '../lib/type-mappers';
import { searchItems } from '../lib/search';
import { mockFoodItems } from '../data/mockData';

export function useFoodInventory() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [usingMockData, setUsingMockData] = useState(false);

  // Load items from database
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Attempting to load items from Supabase...');
      
      // Try to connect to Supabase first
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');
      
      if (error) {
        console.warn('⚠️ Supabase connection failed, falling back to mock data:', error.message);
        // Fall back to mock data
        setItems(mockFoodItems);
        setUsingMockData(true);
        console.log('✅ Loaded mock data:', mockFoodItems.length, 'items');
        return;
      }
      
      if (data && data.length > 0) {
        console.log('✅ Loaded data from Supabase:', data.length, 'items');
        const mappedItems = data.map(dbItemToFoodItem);
        setItems(mappedItems);
        setUsingMockData(false);
      } else {
        // Database is empty, use mock data
        console.log('ℹ️ Database is empty, using mock data');
        setItems(mockFoodItems);
        setUsingMockData(true);
        console.log('✅ Loaded mock data:', mockFoodItems.length, 'items');
      }
    } catch (err) {
      console.warn('❌ Failed to load from Supabase, using mock data:', err);
      // Fall back to mock data on any error
      setItems(mockFoodItems);
      setUsingMockData(true);
      setError('Using mock data - database connection unavailable');
      console.log('✅ Loaded mock data:', mockFoodItems.length, 'items');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering with search capabilities
  const filteredItems = items.filter(item => {
    let matchesSearch = true;
    
    // If we have a search query, use it for filtering (fallback for mock data)
    if (searchQuery && usingMockData) {
      matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     item.ingredients?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'in-stock' && item.in_stock) ||
                        (stockFilter === 'out-of-stock' && !item.in_stock);
    const matchesRating = ratingFilter === 'all' ||
                         (ratingFilter === 'unrated' && !item.rating) ||
                         (ratingFilter !== 'unrated' && item.rating === parseInt(ratingFilter));
    
    return matchesSearch && matchesCategory && matchesStock && matchesRating;
  });


  const categories = Array.from(new Set(items.map(item => item.category)));

  const addItem = async (item: Omit<FoodItem, 'id' | 'last_edited' | 'created_at' | 'updated_at'>) => {
    try {
      // If using mock data, add to local state only
      if (usingMockData) {
        const newItem: FoodItem = {
          ...item,
          id: Date.now(), // Now using number ID
          last_edited: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setItems(prev => [...prev, newItem]);
        return newItem;
      }

      // Otherwise, try to add to Supabase
      const now = new Date().toISOString();
      const dbItem = foodItemToDbInsert({
        ...item,
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
        // Check if it's a duplicate constraint error
        if (error.code === '23505' && error.message.includes('ux_items_normalized_name')) {
          const duplicateError = new Error(`An item with the name "${item.name}" already exists in your inventory.`);
          duplicateError.name = 'DuplicateItemError';
          throw duplicateError;
        }
        throw error;
      }

      const newItem = dbItemToFoodItem(data as DbItem);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      // If it's a duplicate error, don't fall back to mock mode
      if (err instanceof Error && err.name === 'DuplicateItemError') {
        throw err;
      }

      // For other errors, fall back to local mock mode
      console.warn('Add item failed, falling back to local mock mode:', err);
      const now = new Date().toISOString();
      const newItem: FoodItem = {
        ...item,
        id: Date.now(), // Now using number ID
        last_edited: now,
        created_at: now,
        updated_at: now,
      };
      setItems(prev => [...prev, newItem]);
      setUsingMockData(true);
      return newItem;
    }
  };

  const updateItem = async (id: number, updates: Partial<FoodItem>) => {
    try {
      // If using mock data, update local state only
      if (usingMockData) {
        const now = new Date().toISOString();
        setItems(prev => prev.map(item => 
          item.id === id 
            ? { ...item, ...updates, last_edited: now, updated_at: now }
            : item
        ));
        return;
      }

      // Otherwise, try to update in Supabase
      // Build update object, only including fields that are actually being updated
      const now = new Date().toISOString();
      const updateData: Record<string, unknown> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.brand !== undefined) updateData.brand = updates.brand || null;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.in_stock !== undefined) updateData.in_stock = updates.in_stock;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.image_url !== undefined) {
        console.log('🖼️ Updating image_url:', { 
          from: items.find(item => item.id === id)?.image_url, 
          to: updates.image_url,
          final: updates.image_url || null 
        });
        updateData.image_url = updates.image_url || null;
      }
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.serving_size !== undefined) updateData.serving_size_grams = updates.serving_size;
      if (updates.serving_quantity !== undefined) updateData.serving_quantity = updates.serving_quantity;
      if (updates.serving_unit !== undefined) updateData.serving_unit = updates.serving_unit || null;
      if (updates.serving_unit_type !== undefined) updateData.serving_unit_type = updates.serving_unit_type || null;
      if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients || null;
      if (updates.nutrition) {
        // Store nutrition values directly as per-serving
        if (updates.nutrition.calories_per_serving !== undefined) updateData.calories_per_serving = updates.nutrition.calories_per_serving;
        if (updates.nutrition.carbs_per_serving !== undefined) updateData.carbs_per_serving = updates.nutrition.carbs_per_serving;
        if (updates.nutrition.fat_per_serving !== undefined) updateData.fat_per_serving = updates.nutrition.fat_per_serving;
        if (updates.nutrition.protein_per_serving !== undefined) updateData.protein_per_serving = updates.nutrition.protein_per_serving;
      }
      // Triggers will handle updated_at, but we set last_edited for backward compatibility
      updateData.last_edited = now;
      
      const { error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, last_edited: now, updated_at: now }
          : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      // If using mock data, delete from local state only
      if (usingMockData) {
        setItems(prev => prev.filter(item => item.id !== id));
        return;
      }

      // Otherwise, try to delete from Supabase
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  };

  const toggleStock = async (id: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      await updateItem(id, { in_stock: !item.in_stock });
    }
  };

  const outOfStockItems = items.filter(item => !item.in_stock);

  return {
    items: filteredItems,
    allItems: items,
    loading,
    error,
    usingMockData,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    ratingFilter,
    setRatingFilter,
    categories,
    addItem,
    updateItem,
    deleteItem,
    toggleStock,
    outOfStockItems,
    refetch: loadItems,
  };
}