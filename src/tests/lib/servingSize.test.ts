import { describe, it, expect } from 'vitest';
import { dbItemToFoodItem, foodItemToDbInsert } from '../../lib/typeMappers';
import { DbItem, FoodItem } from '../../types';

describe('Serving Size Functionality', () => {
  describe('Macro conversion with different serving sizes', () => {
    it('should correctly convert macros for 100g serving size', () => {
      const dbItem: DbItem = {
        id: 1,
        name: 'Chicken Breast',
        carbs_per_serving: 0,
        fat_per_serving: 3.6,
        protein_per_serving: 31,
        serving_size_grams: 100,
        servings_per_container: 1,
        last_edited: '2025-01-01T00:00:00Z',
      };

      const result = dbItemToFoodItem(dbItem);

      expect(result.nutrition.protein_per_100g).toBe(31);
      expect(result.nutrition.fat_per_100g).toBe(3.6);
      expect(result.nutrition.carbs_per_100g).toBe(0);
      expect(result.serving_size).toBe(100);
    });

    it('should correctly convert macros for 150g serving size', () => {
      const dbItem: DbItem = {
        id: 2,
        name: 'Salmon Fillet',
        carbs_per_serving: 0,
        fat_per_serving: 12,
        protein_per_serving: 22,
        serving_size_grams: 150,
        servings_per_container: 1,
        last_edited: '2025-01-01T00:00:00Z',
      };

      const result = dbItemToFoodItem(dbItem);

      // 22g protein in 150g serving = 14.67g per 100g
      expect(result.nutrition.protein_per_100g).toBeCloseTo(14.67, 2);
      // 12g fat in 150g serving = 8g per 100g
      expect(result.nutrition.fat_per_100g).toBeCloseTo(8, 2);
      expect(result.serving_size).toBe(150);
    });

    it('should correctly convert macros for 50g serving size', () => {
      const dbItem: DbItem = {
        id: 3,
        name: 'Nuts',
        carbs_per_serving: 6,
        fat_per_serving: 18,
        protein_per_serving: 7,
        serving_size_grams: 50,
        servings_per_container: 1,
        last_edited: '2025-01-01T00:00:00Z',
      };

      const result = dbItemToFoodItem(dbItem);

      // 7g protein in 50g serving = 14g per 100g
      expect(result.nutrition.protein_per_100g).toBe(14);
      // 18g fat in 50g serving = 36g per 100g
      expect(result.nutrition.fat_per_100g).toBe(36);
      // 6g carbs in 50g serving = 12g per 100g
      expect(result.nutrition.carbs_per_100g).toBe(12);
      expect(result.serving_size).toBe(50);
    });
  });

  describe('Calorie calculations with serving sizes', () => {
    it('should calculate calories correctly for different serving sizes', () => {
      const dbItem: DbItem = {
        id: 4,
        name: 'Mixed Food',
        carbs_per_serving: 20,
        fat_per_serving: 10,
        protein_per_serving: 15,
        serving_size_grams: 200,
        servings_per_container: 1,
        last_edited: '2025-01-01T00:00:00Z',
      };

      const result = dbItemToFoodItem(dbItem);

      // Calories per 100g: (15*4 + 20*4 + 10*9) * 100 / 200 = 175
      expect(result.nutrition.calories_per_100g).toBeCloseTo(175, 1);
    });
  });

  describe('Database round-trip conversion', () => {
    it('should preserve serving size through database conversion', () => {
      const originalItem: Omit<FoodItem, 'id'> = {
        name: 'Test Food',
        category: 'Test',
        in_stock: true,
        serving_size: 125,
        nutrition: {
          calories_per_100g: 200,
          protein_per_100g: 15,
          carbs_per_100g: 20,
          fat_per_100g: 8,
          fiber_per_100g: 5,
        },
        last_edited: '2025-01-01T00:00:00Z',
      };

      const dbFormat = foodItemToDbInsert(originalItem);
      const backToFoodItem = dbItemToFoodItem({
        ...dbFormat,
        id: 1,
        last_edited: '2025-01-01T00:00:00Z',
      });

      expect(backToFoodItem.serving_size).toBe(125);
      expect(backToFoodItem.nutrition.protein_per_100g).toBe(15);
      expect(backToFoodItem.nutrition.carbs_per_100g).toBe(20);
      expect(backToFoodItem.nutrition.fat_per_100g).toBe(8);
    });
  });

  describe('Default serving size handling', () => {
    it('should use 100g as default when serving_size_grams is null', () => {
      const dbItem: DbItem = {
        id: 5,
        name: 'Legacy Item',
        carbs_per_serving: 25,
        fat_per_serving: 5,
        protein_per_serving: 10,
        serving_size_grams: null,
        servings_per_container: 1,
        last_edited: '2025-01-01T00:00:00Z',
      };

      const result = dbItemToFoodItem(dbItem);

      expect(result.serving_size).toBe(100);
      expect(result.nutrition.protein_per_100g).toBe(10);
      expect(result.nutrition.carbs_per_100g).toBe(25);
      expect(result.nutrition.fat_per_100g).toBe(5);
    });
  });
});
