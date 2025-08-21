export const MEAL_TYPES = [
  'dessert',
  'protein-based',
  'vegetables',
  'starch & grains',
  'smoothie'
] as const;

export type MealType = typeof MEAL_TYPES[number];

export const MEAL_TYPE_OPTIONS = MEAL_TYPES.map(type => ({
  label: type,
  value: type
}));