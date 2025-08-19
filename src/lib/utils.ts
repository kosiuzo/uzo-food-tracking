import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Food category to default image mapping using local default images
 * These images are categorized by food type and provide fallbacks for items without images
 */
export const FOOD_CATEGORY_IMAGES = {
  'Fruits': '/images/defaults/fruits.jpeg',
  'Vegetables': '/images/defaults/vegetables.jpeg',
  'Proteins': '/images/defaults/proteins.jpeg',
  'Dairy & Eggs': '/images/defaults/dairy_eggs.jpeg',
  'Grains & Starches': '/images/defaults/grains_starches.jpeg',
  'Snacks': '/images/defaults/snacks.jpeg',
  'Snacks & Packaged Foods': '/images/defaults/snacks.jpeg',
  'Beverages': '/images/defaults/beverages.jpeg',
  'Oils & Fats': '/images/defaults/oils_fats.jpeg',
  'Seasonings & Spices': '/images/defaults/seasonings_spices.jpeg',
  'Condiments & Sauces': '/images/defaults/condiments_sauces.jpeg',
  'Baking Supplies': '/images/defaults/baking_supplies.jpeg'
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
