import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useFoodInventory } from './useFoodInventory';
import { FoodItem } from '../types';

export interface ShoppingListSummary {
  totalItems: number;
  totalUnits: number;
  estimatedTotal: number;
  itemsWithoutPrices: number;
}

export function useShoppingList() {
  const { outOfStockItems, updateItem } = useFoodInventory();

  // Calculate shopping list summary with useMemo for proper reactivity
  const summary = useMemo((): ShoppingListSummary => {
    const totalItems = outOfStockItems.length;
    const totalUnits = outOfStockItems.reduce((total, item) => total + item.quantity, 0);
    const estimatedTotal = outOfStockItems.reduce(
      (total, item) => total + ((item.price || 0) * item.quantity), 
      0
    );
    const itemsWithoutPrices = outOfStockItems.filter(item => !item.price).length;

    return {
      totalItems,
      totalUnits,
      estimatedTotal,
      itemsWithoutPrices,
    };
  }, [outOfStockItems]);

  // Mark item as purchased and update inventory
  const markAsPurchased = async (item: FoodItem, purchasedQuantity?: number) => {
    const quantityToSet = purchasedQuantity || Math.max(item.quantity, 1);
    const purchaseDate = new Date().toISOString().split('T')[0];
    
    // Determine if this is a re-purchase (item has been bought before)
    const isRepurchase = !!item.last_purchased;
    
    // Update purchase count and last purchased date directly in database
    try {
      const numericId = parseInt(item.id);
      
      // First, get the current purchase count
      const { data: currentItem, error: fetchError } = await supabase
        .from('items')
        .select('purchase_count')
        .eq('id', numericId)
        .single();

      if (fetchError) throw fetchError;
      
      // Update with incremented purchase count
      const { error } = await supabase
        .from('items')
        .update({
          in_stock: true,
          unit_quantity: quantityToSet,
          last_purchased: purchaseDate,
          purchase_count: (currentItem?.purchase_count || 0) + 1,
        })
        .eq('id', numericId);

      if (error) throw error;

      // Also update the local state through the hook
      await updateItem(item.id, {
        in_stock: true,
        quantity: quantityToSet,
        last_purchased: purchaseDate,
      });
    } catch (err) {
      throw new Error(`Failed to update purchase: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    return {
      name: item.name,
      quantity: quantityToSet,
      unit: item.unit,
      isRepurchase,
    };
  };

  // Add item to shopping list (mark as out of stock)
  const addToShoppingList = async (itemId: string, quantity: number = 1) => {
    await updateItem(itemId, {
      in_stock: false,
      quantity: quantity,
    });
  };

  // Remove item from shopping list (without purchasing - just mark as in stock)
  const removeFromShoppingList = async (itemId: string) => {
    await updateItem(itemId, {
      in_stock: true,
    });
  };

  // Calculate individual item total
  const getItemTotal = (item: FoodItem): number => {
    return (item.price || 0) * item.quantity;
  };

  // Update item quantity in shopping list
  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or negative, remove from shopping list
      await removeFromShoppingList(itemId);
    } else {
      await updateItem(itemId, {
        quantity: newQuantity,
      });
    }
  };

  // Categorize shopping items by purchase history
  const getItemsByCategory = () => {
    const repurchaseItems = outOfStockItems.filter(item => item.last_purchased);
    const newItems = outOfStockItems.filter(item => !item.last_purchased);
    
    return {
      repurchaseItems,
      newItems,
    };
  };

  // Get frequently purchased items (items with purchase history, sorted by recency)
  const getFrequentlyPurchasedItems = () => {
    return outOfStockItems
      .filter(item => item.last_purchased)
      .sort((a, b) => {
        const dateA = new Date(a.last_purchased!).getTime();
        const dateB = new Date(b.last_purchased!).getTime();
        return dateB - dateA; // Most recent first
      });
  };

  return {
    shoppingItems: outOfStockItems,
    summary,
    markAsPurchased,
    addToShoppingList,
    removeFromShoppingList,
    updateItemQuantity,
    getItemTotal,
    getItemsByCategory,
    getFrequentlyPurchasedItems,
  };
}