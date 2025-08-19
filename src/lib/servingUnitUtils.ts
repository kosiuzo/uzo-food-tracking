export type ServingUnitType = 'volume' | 'weight' | 'package';

// Unit → Type mapping (app-side; authoritative)
export const UNIT_TO_TYPE: Record<string, ServingUnitType> = {
  // volume
  tsp: 'volume',
  tbsp: 'volume', 
  cup: 'volume',
  fl_oz: 'volume',
  'fl oz': 'volume',
  ml: 'volume',
  l: 'volume',
  liter: 'volume',
  // weight
  g: 'weight',
  gram: 'weight',
  grams: 'weight',
  kg: 'weight',
  kilogram: 'weight',
  kilograms: 'weight',
  oz: 'weight',
  ounce: 'weight',
  ounces: 'weight',
  lb: 'weight',
  pound: 'weight',
  pounds: 'weight',
  // package / count
  pouch: 'package',
  pouches: 'package',
  bar: 'package',
  bars: 'package',
  bottle: 'package',
  bottles: 'package',
  pack: 'package',
  packs: 'package',
  piece: 'package',
  pieces: 'package',
  scoop: 'package',
  scoops: 'package',
  slice: 'package',
  slices: 'package',
  can: 'package',
  cans: 'package',
  serving: 'package',
  servings: 'package',
};

/**
 * Get the serving unit type for a given unit string
 */
export function getServingUnitType(unit: string): ServingUnitType | null {
  const normalizedUnit = unit.toLowerCase().trim().replace(/\s+/g, '_');
  return UNIT_TO_TYPE[normalizedUnit] || null;
}

/**
 * Validate serving unit and return the type
 */
export function validateServingUnit(unit: string): { isValid: boolean; type: ServingUnitType | null; error?: string } {
  const type = getServingUnitType(unit);
  
  if (!type) {
    return {
      isValid: false,
      type: null,
      error: `Unsupported unit: ${unit}. Please use a supported unit like cup, tbsp, g, oz, piece, etc.`
    };
  }
  
  return { isValid: true, type };
}

/**
 * Convert volume quantities to cups for normalization
 */
export function toCup(quantity: number, unit: string): number {
  const normalizedUnit = unit.toLowerCase().trim().replace(/\s+/g, '_');
  
  switch (normalizedUnit) {
    case 'cup':
      return quantity;
    case 'tbsp':
      return quantity / 16;
    case 'tsp':
      return quantity / 48;
    case 'ml':
      return quantity / 240;
    case 'fl_oz':
    case 'fl oz':
      return quantity / 8;   // US fluid ounce
    case 'l':
    case 'liter':
      return quantity * 4.227; // 1 liter = 4.227 US cups
    default:
      throw new Error(`Unsupported volume unit: ${unit}`);
  }
}

/**
 * Convert cups to another volume unit
 */
export function fromCup(cups: number, targetUnit: string): number {
  const normalizedUnit = targetUnit.toLowerCase().trim().replace(/\s+/g, '_');
  
  switch (normalizedUnit) {
    case 'cup':
      return cups;
    case 'tbsp':
      return cups * 16;
    case 'tsp':
      return cups * 48;
    case 'ml':
      return cups * 240;
    case 'fl_oz':
    case 'fl oz':
      return cups * 8;
    case 'l':
    case 'liter':
      return cups / 4.227;
    default:
      throw new Error(`Unsupported volume unit: ${targetUnit}`);
  }
}

/**
 * Calculate grams per unit when serving data is available
 */
export function calculateGramsPerUnit(
  servingQuantity: number,
  servingSizeGrams: number
): number {
  if (servingQuantity <= 0) {
    throw new Error('Serving quantity must be greater than 0');
  }
  if (servingSizeGrams <= 0) {
    throw new Error('Serving size in grams must be greater than 0');
  }
  
  return servingSizeGrams / servingQuantity;
}

/**
 * Convert recipe quantity to grams for volume-based ingredients
 */
export function convertVolumeToGrams(
  recipeQuantity: number,
  recipeUnit: string,
  itemServingQuantity: number,
  itemServingUnit: string,
  itemServingSizeGrams: number
): number {
  // Validate that both units are volume units
  const recipeUnitType = getServingUnitType(recipeUnit);
  const itemUnitType = getServingUnitType(itemServingUnit);
  
  if (recipeUnitType !== 'volume' || itemUnitType !== 'volume') {
    throw new Error('Both recipe and item units must be volume units');
  }
  
  // Convert both quantities to cups for comparison
  const recipeCups = toCup(recipeQuantity, recipeUnit);
  const itemCups = toCup(itemServingQuantity, itemServingUnit);
  
  // Calculate grams per cup for the item
  const gramsPerCup = calculateGramsPerUnit(itemCups, itemServingSizeGrams);
  
  // Return total grams for the recipe quantity
  return recipeCups * gramsPerCup;
}

/**
 * Scale nutrition values based on weight ratio
 */
export function scaleNutrition(
  baseNutrition: { calories?: number; protein?: number; carbs?: number; fat?: number },
  actualGrams: number,
  baseServingSizeGrams: number
): { calories: number; protein: number; carbs: number; fat: number } {
  const ratio = actualGrams / baseServingSizeGrams;
  
  return {
    calories: Math.round((baseNutrition.calories || 0) * ratio),
    protein: Math.round((baseNutrition.protein || 0) * ratio * 100) / 100,
    carbs: Math.round((baseNutrition.carbs || 0) * ratio * 100) / 100,
    fat: Math.round((baseNutrition.fat || 0) * ratio * 100) / 100,
  };
}