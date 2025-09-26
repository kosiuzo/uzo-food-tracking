// Storage key for settings
export const SETTINGS_STORAGE_KEY = 'uzo-food-tracking-settings';

// Default settings
export const DEFAULT_SETTINGS = {
  calorieTarget: 2000,
  proteinTarget: 200,
  carbsTarget: 100,
  fatTarget: 100,
  calorieTargetEnabled: false,
  proteinTargetEnabled: false,
  carbsTargetEnabled: false,
  fatTargetEnabled: false,
};

// Types
export interface AppSettings {
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  calorieTargetEnabled: boolean;
  proteinTargetEnabled: boolean;
  carbsTargetEnabled: boolean;
  fatTargetEnabled: boolean;
}

// Target settings configurations with labels and descriptions
export const TARGET_CONFIGS = {
  calorie: {
    label: 'Calorie Target',
    description: 'Set your daily calorie intake goal',
    unit: 'calories',
    key: 'calorieTarget' as keyof AppSettings,
    enabledKey: 'calorieTargetEnabled' as keyof AppSettings,
    min: 800,
    max: 5000,
    step: 50
  },
  protein: {
    label: 'Protein Target',
    description: 'Set your daily protein intake goal',
    unit: 'grams',
    key: 'proteinTarget' as keyof AppSettings,
    enabledKey: 'proteinTargetEnabled' as keyof AppSettings,
    min: 50,
    max: 400,
    step: 5
  },
  carbs: {
    label: 'Carbs Target',
    description: 'Set your daily carbohydrate intake goal',
    unit: 'grams',
    key: 'carbsTarget' as keyof AppSettings,
    enabledKey: 'carbsTargetEnabled' as keyof AppSettings,
    min: 50,
    max: 500,
    step: 5
  },
  fat: {
    label: 'Fat Target',
    description: 'Set your daily fat intake goal',
    unit: 'grams',
    key: 'fatTarget' as keyof AppSettings,
    enabledKey: 'fatTargetEnabled' as keyof AppSettings,
    min: 20,
    max: 200,
    step: 5
  }
} as const;

// Quick target preset options
export const CALORIE_PRESETS = [
  { label: 'Sedentary (1600-1800)', value: 1700 },
  { label: 'Lightly Active (1800-2000)', value: 1900 },
  { label: 'Moderately Active (2000-2200)', value: 2100 },
  { label: 'Very Active (2200-2400)', value: 2300 },
  { label: 'Extremely Active (2400+)', value: 2500 }
];

export const PROTEIN_PRESETS = [
  { label: 'Maintenance (0.8g/kg)', value: 120 },
  { label: 'Active (1.2g/kg)', value: 180 },
  { label: 'Muscle Building (1.6g/kg)', value: 240 },
  { label: 'High Protein (2.0g/kg)', value: 300 }
];

export const CARBS_PRESETS = [
  { label: 'Low Carb (50-100g)', value: 75 },
  { label: 'Moderate (100-150g)', value: 125 },
  { label: 'Balanced (150-225g)', value: 190 },
  { label: 'High Carb (225g+)', value: 275 }
];

export const FAT_PRESETS = [
  { label: 'Low Fat (20-35g)', value: 30 },
  { label: 'Moderate (35-60g)', value: 50 },
  { label: 'Higher Fat (60-90g)', value: 75 },
  { label: 'High Fat (90g+)', value: 110 }
];