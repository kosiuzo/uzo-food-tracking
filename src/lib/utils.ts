import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const APP_TIME_ZONE = 'America/New_York'

function formatDateToIso(date: Date, timeZone: string = 'UTC'): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(date)
}

function parseAppDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}

export function shiftAppDate(dateString: string, { days = 0, months = 0 }: { days?: number; months?: number }): string {
  const date = parseAppDate(dateString)
  if (days !== 0) {
    date.setUTCDate(date.getUTCDate() + days)
  }
  if (months !== 0) {
    date.setUTCMonth(date.getUTCMonth() + months)
  }
  return formatDateToIso(date)
}

export function formatAppDateForDisplay(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'en-US',
  timeZone: string = APP_TIME_ZONE
): string {
  if (!dateString) return ''
  const date = parseAppDate(dateString)
  return new Intl.DateTimeFormat(locale, { timeZone, ...options }).format(date)
}

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
 * Get today's date in YYYY-MM-DD format using the app's canonical timezone (Eastern Time)
 * This avoids timezone issues that can occur with new Date().toISOString().split('T')[0]
 * @returns Today's date as a string in YYYY-MM-DD format
 */
export function getTodayLocalDate(): string {
  return formatDateToIso(new Date(), APP_TIME_ZONE)
}

/**
 * Get yesterday's date in YYYY-MM-DD format using the app's canonical timezone (Eastern Time)
 * @returns Yesterday's date as a string in YYYY-MM-DD format
 */
export function getYesterdayLocalDate(): string {
  const now = new Date()
  now.setUTCDate(now.getUTCDate() - 1)
  return formatDateToIso(now, APP_TIME_ZONE)
}

/**
 * Get the current week's date range (Sunday to Saturday) in the app's timezone
 * @returns Object with start and end dates as strings in YYYY-MM-DD format
 */
export function getCurrentWeekRange(): { start: string; end: string } {
  const today = parseAppDate(getTodayLocalDate())
  const startOfWeek = new Date(today)
  const dayOfWeek = startOfWeek.getUTCDay()
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - dayOfWeek)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6)

  return {
    start: formatDateToIso(startOfWeek),
    end: formatDateToIso(endOfWeek)
  }
}

/**
 * Get the last week's date range (Sunday to Saturday) in the app's timezone
 * @returns Object with start and end dates as strings in YYYY-MM-DD format
 */
export function getLastWeekRange(): { start: string; end: string } {
  const today = parseAppDate(getTodayLocalDate())
  const startOfLastWeek = new Date(today)
  const dayOfWeek = startOfLastWeek.getUTCDay()
  startOfLastWeek.setUTCDate(startOfLastWeek.getUTCDate() - dayOfWeek - 7)
  const endOfLastWeek = new Date(startOfLastWeek)
  endOfLastWeek.setUTCDate(endOfLastWeek.getUTCDate() + 6)

  return {
    start: formatDateToIso(startOfLastWeek),
    end: formatDateToIso(endOfLastWeek)
  }
}

/**
 * Format a date string (YYYY-MM-DD) for display without timezone conversion issues
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string for display
 */
export function formatDateStringForDisplay(dateString: string): string {
  return formatAppDateForDisplay(dateString)
}

export { formatDateToIso as formatDateToIsoString, parseAppDate }
