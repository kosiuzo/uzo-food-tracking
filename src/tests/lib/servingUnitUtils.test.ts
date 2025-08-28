import { describe, it, expect } from 'vitest';
import {
  getServingUnitType,
  validateServingUnit,
  toCup,
  fromCup,
  calculateGramsPerUnit,
  convertVolumeToGrams,
  scaleNutrition,
} from '../../lib/servingUnitUtils';

describe('servingUnitUtils', () => {
  describe('getServingUnitType', () => {
    it('identifies volume units correctly', () => {
      expect(getServingUnitType('cup')).toBe('volume');
      expect(getServingUnitType('ml')).toBe('volume');
      expect(getServingUnitType('fl oz')).toBe('volume');
      expect(getServingUnitType('tbsp')).toBe('volume');
      expect(getServingUnitType('tsp')).toBe('volume');
    });

    it('identifies weight units correctly', () => {
      expect(getServingUnitType('g')).toBe('weight');
      expect(getServingUnitType('kg')).toBe('weight');
      expect(getServingUnitType('oz')).toBe('weight');
      expect(getServingUnitType('lb')).toBe('weight');
      expect(getServingUnitType('pound')).toBe('weight');
    });

    it('identifies package units correctly', () => {
      expect(getServingUnitType('piece')).toBe('package');
      expect(getServingUnitType('serving')).toBe('package');
      expect(getServingUnitType('bottle')).toBe('package');
      expect(getServingUnitType('can')).toBe('package');
      expect(getServingUnitType('slice')).toBe('package');
    });

    it('returns null for unknown units', () => {
      expect(getServingUnitType('unknown')).toBeNull();
      expect(getServingUnitType('')).toBeNull();
    });

    it('handles case insensitive input', () => {
      expect(getServingUnitType('CUP')).toBe('volume');
      expect(getServingUnitType('Gram')).toBe('weight');
      expect(getServingUnitType('PIECE')).toBe('package');
    });
  });

  describe('validateServingUnit', () => {
    it('validates known units', () => {
      const result = validateServingUnit('cup');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('volume');
      expect(result.error).toBeUndefined();
    });

    it('rejects unknown units', () => {
      const result = validateServingUnit('unknown');
      expect(result.isValid).toBe(false);
      expect(result.type).toBeNull();
      expect(result.error).toContain('Unsupported unit');
    });
  });

  describe('volume conversions', () => {
    describe('toCup', () => {
      it('converts tablespoons to cups', () => {
        expect(toCup(16, 'tbsp')).toBe(1);
        expect(toCup(8, 'tbsp')).toBe(0.5);
      });

      it('converts teaspoons to cups', () => {
        expect(toCup(48, 'tsp')).toBe(1);
        expect(toCup(24, 'tsp')).toBe(0.5);
      });

      it('converts milliliters to cups', () => {
        expect(toCup(240, 'ml')).toBe(1);
        expect(toCup(120, 'ml')).toBe(0.5);
      });

      it('converts fluid ounces to cups', () => {
        expect(toCup(8, 'fl oz')).toBe(1);
        expect(toCup(4, 'fl_oz')).toBe(0.5);
      });

      it('handles cups directly', () => {
        expect(toCup(1, 'cup')).toBe(1);
        expect(toCup(0.5, 'cup')).toBe(0.5);
      });

      it('throws error for unsupported units', () => {
        expect(() => toCup(1, 'unknown')).toThrow('Unsupported volume unit');
      });
    });

    describe('fromCup', () => {
      it('converts cups to tablespoons', () => {
        expect(fromCup(1, 'tbsp')).toBe(16);
        expect(fromCup(0.5, 'tbsp')).toBe(8);
      });

      it('converts cups to milliliters', () => {
        expect(fromCup(1, 'ml')).toBe(240);
        expect(fromCup(0.5, 'ml')).toBe(120);
      });

      it('handles cups directly', () => {
        expect(fromCup(1, 'cup')).toBe(1);
        expect(fromCup(2, 'cup')).toBe(2);
      });

      it('throws error for unsupported units', () => {
        expect(() => fromCup(1, 'unknown')).toThrow('Unsupported volume unit');
      });
    });
  });

  describe('calculateGramsPerUnit', () => {
    it('calculates grams per unit correctly', () => {
      expect(calculateGramsPerUnit(1, 100)).toBe(100);
      expect(calculateGramsPerUnit(2, 200)).toBe(100);
      expect(calculateGramsPerUnit(4, 100)).toBe(25);
    });

    it('throws error for invalid inputs', () => {
      expect(() => calculateGramsPerUnit(0, 100)).toThrow();
      expect(() => calculateGramsPerUnit(1, 0)).toThrow();
      expect(() => calculateGramsPerUnit(-1, 100)).toThrow();
      expect(() => calculateGramsPerUnit(1, -100)).toThrow();
    });
  });

  describe('convertVolumeToGrams', () => {
    it('converts volume quantities to grams', () => {
      // 1 cup of milk (recipe) when item is measured in 1 cup servings at 240g
      const result = convertVolumeToGrams(1, 'cup', 1, 'cup', 240);
      expect(result).toBe(240);
    });

    it('handles different volume units', () => {
      // 2 tbsp of oil when item serving is 1 cup at 240g
      const result = convertVolumeToGrams(2, 'tbsp', 1, 'cup', 240);
      expect(result).toBe(30); // 2 tbsp = 1/8 cup, so 240/8 = 30g
    });

    it('throws error for non-volume units', () => {
      expect(() => convertVolumeToGrams(1, 'g', 1, 'cup', 240)).toThrow();
      expect(() => convertVolumeToGrams(1, 'cup', 1, 'piece', 240)).toThrow();
    });
  });

  describe('scaleNutrition', () => {
    const baseNutrition = {
      calories: 100,
      protein: 10,
      carbs: 20,
      fat: 5,
    };

    it('scales nutrition proportionally', () => {
      const result = scaleNutrition(baseNutrition, 200, 100);
      expect(result.calories).toBe(200);
      expect(result.protein).toBe(20);
      expect(result.carbs).toBe(40);
      expect(result.fat).toBe(10);
    });

    it('handles fractional scaling', () => {
      const result = scaleNutrition(baseNutrition, 50, 100);
      expect(result.calories).toBe(50);
      expect(result.protein).toBe(5);
      expect(result.carbs).toBe(10);
      expect(result.fat).toBe(2.5);
    });

    it('rounds calories to whole numbers', () => {
      const result = scaleNutrition(baseNutrition, 33, 100);
      expect(result.calories).toBe(33);
    });

    it('rounds other nutrients to 2 decimal places', () => {
      const result = scaleNutrition(baseNutrition, 33, 100);
      expect(result.protein).toBe(3.3);
      expect(result.carbs).toBe(6.6);
      expect(result.fat).toBe(1.65);
    });

    it('handles missing nutrition values', () => {
      const result = scaleNutrition({}, 200, 100);
      expect(result.calories).toBe(0);
      expect(result.protein).toBe(0);
      expect(result.carbs).toBe(0);
      expect(result.fat).toBe(0);
    });
  });
});