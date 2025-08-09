import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FoodItem, DbItem } from '../types';
import { dbItemToFoodItem, foodItemToDbInsert } from '../lib/typeMappers';

export function useFoodInventory() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Load items from database
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const mappedItems = data.map(dbItemToFoodItem);
      setItems(mappedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'in-stock' && item.in_stock) ||
                        (stockFilter === 'out-of-stock' && !item.in_stock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = Array.from(new Set(items.map(item => item.category)));

  const addItem = async (item: Omit<FoodItem, 'id' | 'last_edited'>) => {
    try {
      const dbItem = foodItemToDbInsert({
        ...item,
        last_edited: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from('items')
        .insert([dbItem])
        .select()
        .single();

      if (error) throw error;

      const newItem = dbItemToFoodItem(data as DbItem);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const numericId = parseInt(id);
      // Build update object, only including fields that are actually being updated
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.brand !== undefined) updateData.brand = updates.brand || null;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.in_stock !== undefined) updateData.in_stock = updates.in_stock;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.unit !== undefined) updateData.unit_of_measure = updates.unit;
      if (updates.quantity !== undefined) updateData.unit_quantity = updates.quantity;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url || null;
      if (updates.nutrition) {
        updateData.carbs_per_serving = updates.nutrition.carbs_per_100g / 100;
        updateData.fat_per_serving = updates.nutrition.fat_per_100g / 100;
        updateData.protein_per_serving = updates.nutrition.protein_per_100g / 100;
      }
      updateData.last_edited = new Date().toISOString();
      
      const { error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', numericId);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, last_edited: new Date().toISOString() }
          : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const numericId = parseInt(id);
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', numericId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  };

  const toggleStock = async (id: string) => {
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
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    categories,
    addItem,
    updateItem,
    deleteItem,
    toggleStock,
    outOfStockItems,
    refetch: loadItems,
  };
}