import { SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS, type AppSettings } from './settings-constants';
import { logger } from './logger';

export const getCalorieTarget = (): number => {
  const settings = getSettings();
  return settings.calorieTarget;
};

export const getProteinTarget = (): number => {
  const settings = getSettings();
  return settings.proteinTarget;
};

export const getCarbsTarget = (): number => {
  const settings = getSettings();
  return settings.carbsTarget;
};

export const getFatTarget = (): number => {
  const settings = getSettings();
  return settings.fatTarget;
};

export const getSettings = (): AppSettings => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (savedSettings) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    } catch (error) {
      logger.warn('Failed to parse settings from localStorage:', error);
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
};