import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Food category to default image mapping using reliable Pexels images
 * These images are categorized by food type and provide fallbacks for items without images
 */
export const FOOD_CATEGORY_IMAGES = {
  'Fruits': 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400',
  'Vegetables': 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400',
  'Proteins': 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400',
  'Dairy & Eggs': 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400',
  'Grains & Starches': 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400',
  'Beverages': 'https://images.pexels.com/photos/1546173/pexels-photo-1546173.jpeg?w=400',
  'Condiments & Sauces': 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400',
  'Oils & Fats': 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400',
  'Seasonings & Spices': 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400',
  'Baking Supplies': 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400',
  'Snacks & Packaged Foods': 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400'
} as const;

/**
 * Get the default image URL for a food category
 * @param category - The food category to get an image for
 * @returns The default image URL for the category, or a fallback image if category not found
 */
export function getDefaultImageByCategory(category: string): string {
  return FOOD_CATEGORY_IMAGES[category as keyof typeof FOOD_CATEGORY_IMAGES] || FOOD_CATEGORY_IMAGES['Proteins'];
}

/**
 * Get an image URL for a food item, using the item's image if available or falling back to category default
 * @param itemImage - The item's specific image URL (can be empty/null)
 * @param category - The food category for fallback
 * @returns A valid image URL for the food item
 */
export function getFoodItemImage(itemImage: string | null | undefined, category: string): string {
  if (itemImage && itemImage.trim() !== '') {
    return itemImage;
  }
  return getDefaultImageByCategory(category);
}

/**
 * Type for food categories that have default images
 */
export type FoodCategory = keyof typeof FOOD_CATEGORY_IMAGES;
