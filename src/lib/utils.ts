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

/**
 * Get today's date in YYYY-MM-DD format using the user's local timezone
 * This avoids timezone issues that can occur with new Date().toISOString().split('T')[0]
 * @returns Today's date as a string in YYYY-MM-DD format
 */
export function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's date in YYYY-MM-DD format using the user's local timezone
 * @returns Yesterday's date as a string in YYYY-MM-DD format
 */
export function getYesterdayLocalDate(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the current week's date range (Sunday to Saturday) in local timezone
 * @returns Object with start and end dates as strings in YYYY-MM-DD format
 */
export function getCurrentWeekRange(): { start: string; end: string } {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)
  
  const startYear = startOfWeek.getFullYear();
  const startMonth = String(startOfWeek.getMonth() + 1).padStart(2, '0');
  const startDay = String(startOfWeek.getDate()).padStart(2, '0');
  
  const endYear = endOfWeek.getFullYear();
  const endMonth = String(endOfWeek.getMonth() + 1).padStart(2, '0');
  const endDay = String(endOfWeek.getDate()).padStart(2, '0');
  
  return {
    start: `${startYear}-${startMonth}-${startDay}`,
    end: `${endYear}-${endMonth}-${endDay}`
  };
}

/**
 * Get the last week's date range (Sunday to Saturday) in local timezone
 * @returns Object with start and end dates as strings in YYYY-MM-DD format
 */
export function getLastWeekRange(): { start: string; end: string } {
  const today = new Date();
  const startOfLastWeek = new Date(today);
  startOfLastWeek.setDate(today.getDate() - today.getDay() - 7); // Start of last week (Sunday)
  const endOfLastWeek = new Date(startOfLastWeek);
  endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // End of last week (Saturday)
  
  const startYear = startOfLastWeek.getFullYear();
  const startMonth = String(startOfLastWeek.getMonth() + 1).padStart(2, '0');
  const startDay = String(startOfLastWeek.getDate()).padStart(2, '0');
  
  const endYear = endOfLastWeek.getFullYear();
  const endMonth = String(endOfLastWeek.getMonth() + 1).padStart(2, '0');
  const endDay = String(endOfLastWeek.getDate()).padStart(2, '0');
  
  return {
    start: `${startYear}-${startMonth}-${startDay}`,
    end: `${endYear}-${endMonth}-${endDay}`
  };
}

/**
 * Format a date string (YYYY-MM-DD) for display without timezone conversion issues
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string for display
 */
export function formatDateStringForDisplay(dateString: string): string {
  // Parse the date string directly without creating a Date object that might have timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
  return date.toLocaleDateString();
}
