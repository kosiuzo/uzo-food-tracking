// REST API service for food inventory items using Supabase
// Designed for AI recipe generation and ChatGPT integration

import { supabase } from './supabase';
import type { Database } from '@/types/database';
import { FoodItem } from '@/types';

// Types for API operations
export interface ItemResponse {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  in_stock: boolean | null;
  price: number | null;
  calories_per_serving: number | null;
  carbs_per_serving: number | null;
  fat_per_serving: number | null;
  protein_per_serving: number | null;
  serving_quantity: number | null;
  serving_unit: string | null;
  serving_unit_type: string | null;
  servings_per_container: number | null;
  serving_size_grams: number | null;
  image_url: string | null;
  ingredients: string | null;
  nutrition_source: string | null;
  barcode: string | null;
  last_purchased: string | null;
  purchase_count: number | null;
  rating: number | null;
  last_edited: string | null;
  normalized_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Get all available categories from the database
 */
export async function getAllCategories(): Promise<ApiResponse<string[]>> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('category')
      .not('category', 'is', null)
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    // Extract unique categories
    const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean) as string[];

    return {
      data: uniqueCategories,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error fetching categories:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Get items by category (exact match)
 */
export async function getItemsByCategory(category: string, includeOutOfStock: boolean = true): Promise<ApiResponse<ItemResponse[]>> {
  try {
    if (!category || category.trim().length === 0) {
      return {
        data: null,
        error: 'Category is required',
        success: false,
      };
    }

    let query = supabase
      .from('items')
      .select('*')
      .eq('category', category.trim())
      .order('name');

    // Filter by stock status if requested
    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching items by category:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as ItemResponse[],
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error fetching items by category:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Search items by category (partial match)
 */
export async function searchItemsByCategory(searchTerm: string, includeOutOfStock: boolean = true): Promise<ApiResponse<ItemResponse[]>> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        data: null,
        error: 'Search term is required',
        success: false,
      };
    }

    let query = supabase
      .from('items')
      .select('*')
      .ilike('category', `%${searchTerm.trim()}%`)
      .order('category')
      .order('name');

    // Filter by stock status if requested
    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching items by category:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as ItemResponse[],
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error searching items by category:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Get items by multiple categories
 */
export async function getItemsByCategories(categories: string[], includeOutOfStock: boolean = true): Promise<ApiResponse<ItemResponse[]>> {
  try {
    if (!categories || categories.length === 0) {
      return {
        data: null,
        error: 'At least one category is required',
        success: false,
      };
    }

    // Filter out empty categories and trim whitespace
    const cleanCategories = categories
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0);

    if (cleanCategories.length === 0) {
      return {
        data: null,
        error: 'At least one valid category is required',
        success: false,
      };
    }

    let query = supabase
      .from('items')
      .select('*')
      .in('category', cleanCategories)
      .order('category')
      .order('name');

    // Filter by stock status if requested
    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching items by categories:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as ItemResponse[],
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error fetching items by categories:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Get category summary with item counts
 */
export async function getCategorySummary(includeOutOfStock: boolean = true): Promise<ApiResponse<{category: string, item_count: number, in_stock_count: number}[]>> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('category, in_stock')
      .not('category', 'is', null);

    if (error) {
      console.error('Error fetching category summary:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    // Process data to create summary
    const categoryMap = new Map<string, {total: number, inStock: number}>();
    
    data.forEach(item => {
      const category = item.category as string;
      const current = categoryMap.get(category) || {total: 0, inStock: 0};
      current.total += 1;
      if (item.in_stock) {
        current.inStock += 1;
      }
      categoryMap.set(category, current);
    });

    // Convert to array format
    const summary = Array.from(categoryMap.entries())
      .map(([category, counts]) => ({
        category,
        item_count: counts.total,
        in_stock_count: counts.inStock
      }))
      .filter(item => includeOutOfStock || item.in_stock_count > 0)
      .sort((a, b) => a.category.localeCompare(b.category));

    return {
      data: summary,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error fetching category summary:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}