import { describe, it, expect } from 'vitest';
import { 
  getFoodItemImage, 
  getDefaultImageByCategory, 
  FOOD_CATEGORY_IMAGES,
  type FoodCategory 
} from '../utils';

describe('Food Image Utils', () => {
  describe('FOOD_CATEGORY_IMAGES', () => {
    it('should have all required food categories', () => {
      const expectedCategories = [
        'Fruits',
        'Vegetables', 
        'Proteins',
        'Dairy & Eggs',
        'Grains & Starches',
        'Snacks',
        'Snacks & Packaged Foods',
        'Beverages',
        'Oils & Fats',
        'Seasonings & Spices',
        'Condiments & Sauces',
        'Baking Supplies'
      ];

      expectedCategories.forEach(category => {
        expect(FOOD_CATEGORY_IMAGES[category as FoodCategory]).toBeDefined();
      });
    });

    it('should use local image paths instead of external URLs', () => {
      Object.values(FOOD_CATEGORY_IMAGES).forEach(imagePath => {
        expect(imagePath).toMatch(/^\/images\/defaults\/.+\.jpeg$/);
        expect(imagePath).not.toMatch(/^https?:\/\//);
      });
    });

    it('should have correct image paths for each category', () => {
      expect(FOOD_CATEGORY_IMAGES['Fruits']).toBe('/images/defaults/fruits.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Vegetables']).toBe('/images/defaults/vegetables.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Proteins']).toBe('/images/defaults/proteins.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Dairy & Eggs']).toBe('/images/defaults/dairy_eggs.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Grains & Starches']).toBe('/images/defaults/grains_starches.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Snacks']).toBe('/images/defaults/snacks.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Snacks & Packaged Foods']).toBe('/images/defaults/snacks.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Beverages']).toBe('/images/defaults/beverages.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Oils & Fats']).toBe('/images/defaults/oils_fats.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Seasonings & Spices']).toBe('/images/defaults/seasonings_spices.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Condiments & Sauces']).toBe('/images/defaults/condiments_sauces.jpeg');
      expect(FOOD_CATEGORY_IMAGES['Baking Supplies']).toBe('/images/defaults/baking_supplies.jpeg');
    });
  });

  describe('getDefaultImageByCategory', () => {
    it('should return the correct image for valid categories', () => {
      expect(getDefaultImageByCategory('Fruits')).toBe('/images/defaults/fruits.jpeg');
      expect(getDefaultImageByCategory('Proteins')).toBe('/images/defaults/proteins.jpeg');
      expect(getDefaultImageByCategory('Vegetables')).toBe('/images/defaults/vegetables.jpeg');
    });

    it('should return fallback image for unknown categories', () => {
      expect(getDefaultImageByCategory('Unknown Category')).toBe('/images/defaults/proteins.jpeg');
    });

    it('should handle case-sensitive category names', () => {
      expect(getDefaultImageByCategory('fruits')).toBe('/images/defaults/proteins.jpeg');
      expect(getDefaultImageByCategory('FRUITS')).toBe('/images/defaults/proteins.jpeg');
    });
  });

  describe('getFoodItemImage', () => {
    it('should return item image when provided', () => {
      const itemImage = 'https://example.com/custom-image.jpg';
      const category = 'Fruits';
      
      expect(getFoodItemImage(itemImage, category)).toBe(itemImage);
    });

    it('should return default category image when item image is null', () => {
      const itemImage = null;
      const category = 'Vegetables';
      
      expect(getFoodItemImage(itemImage, category)).toBe('/images/defaults/vegetables.jpeg');
    });

    it('should return default category image when item image is undefined', () => {
      const itemImage = undefined;
      const category = 'Proteins';
      
      expect(getFoodItemImage(itemImage, category)).toBe('/images/defaults/proteins.jpeg');
    });

    it('should return default category image when item image is empty string', () => {
      const itemImage = '';
      const category = 'Dairy & Eggs';
      
      expect(getFoodItemImage(itemImage, category)).toBe('/images/defaults/dairy_eggs.jpeg');
    });

    it('should return default category image when item image is whitespace only', () => {
      const itemImage = '   ';
      const category = 'Grains & Starches';
      
      expect(getFoodItemImage(itemImage, category)).toBe('/images/defaults/grains_starches.jpeg');
    });

    it('should handle edge cases gracefully', () => {
      expect(getFoodItemImage('', '')).toBe('/images/defaults/proteins.jpeg');
      expect(getFoodItemImage('', 'Invalid Category')).toBe('/images/defaults/proteins.jpeg');
    });
  });
});
