import { describe, it, expect } from 'vitest';
import {
  getServingUnitType,
  validateServingUnit,
  toCup,
  fromCup,
  calculateGramsPerUnit,
  convertVolumeToGrams,
  scaleNutrition,
  UNIT_TO_TYPE
} from '../servingUnitUtils';

describe('servingUnitUtils', () => {
  describe('getServingUnitType', () => {
    it('should return correct type for volume units', () => {
      expect(getServingUnitType('cup')).toBe('volume');
      expect(getServingUnitType('Cup')).toBe('volume');
      expect(getServingUnitType('tbsp')).toBe('volume');
      expect(getServingUnitType('tsp')).toBe('volume');
      expect(getServingUnitType('ml')).toBe('volume');
      expect(getServingUnitType('fl oz')).toBe('volume');
      expect(getServingUnitType('fl_oz')).toBe('volume');
    });

    it('should return correct type for weight units', () => {
      expect(getServingUnitType('g')).toBe('weight');
      expect(getServingUnitType('gram')).toBe('weight');
      expect(getServingUnitType('kg')).toBe('weight');
      expect(getServingUnitType('oz')).toBe('weight');
      expect(getServingUnitType('lb')).toBe('weight');
    });

    it('should return correct type for package units', () => {
      expect(getServingUnitType('piece')).toBe('package');
      expect(getServingUnitType('slice')).toBe('package');
      expect(getServingUnitType('can')).toBe('package');
      expect(getServingUnitType('pouch')).toBe('package');
      expect(getServingUnitType('serving')).toBe('package');
    });

    it('should return null for unsupported units', () => {
      expect(getServingUnitType('gallon')).toBeNull();
      expect(getServingUnitType('invalid')).toBeNull();
    });
  });

  describe('validateServingUnit', () => {
    it('should validate supported units', () => {
      const result = validateServingUnit('cup');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('volume');
      expect(result.error).toBeUndefined();
    });

    it('should reject unsupported units', () => {
      const result = validateServingUnit('gallon');
      expect(result.isValid).toBe(false);
      expect(result.type).toBeNull();
      expect(result.error).toContain('Unsupported unit: gallon');
    });
  });

  describe('toCup', () => {
    it('should convert volume units to cups correctly', () => {
      expect(toCup(1, 'cup')).toBe(1);
      expect(toCup(16, 'tbsp')).toBe(1);
      expect(toCup(48, 'tsp')).toBe(1);
      expect(toCup(240, 'ml')).toBe(1);
      expect(toCup(8, 'fl_oz')).toBe(1);
      expect(toCup(8, 'fl oz')).toBe(1);
    });

    it('should handle fractional conversions', () => {
      expect(toCup(0.25, 'cup')).toBe(0.25);
      expect(toCup(4, 'tbsp')).toBe(0.25);
      expect(toCup(12, 'tsp')).toBe(0.25);
    });

    it('should throw error for unsupported units', () => {
      expect(() => toCup(1, 'gallon')).toThrow('Unsupported volume unit: gallon');
    });
  });

  describe('fromCup', () => {
    it('should convert cups to other volume units correctly', () => {
      expect(fromCup(1, 'cup')).toBe(1);
      expect(fromCup(1, 'tbsp')).toBe(16);
      expect(fromCup(1, 'tsp')).toBe(48);
      expect(fromCup(1, 'ml')).toBe(240);
      expect(fromCup(1, 'fl_oz')).toBe(8);
    });

    it('should throw error for unsupported units', () => {
      expect(() => fromCup(1, 'gallon')).toThrow('Unsupported volume unit: gallon');
    });
  });

  describe('calculateGramsPerUnit', () => {
    it('should calculate grams per unit correctly', () => {
      // Rice example from PRD: 0.25 cup = 45g
      expect(calculateGramsPerUnit(0.25, 45)).toBe(180);
      
      // 1 tbsp = 14g
      expect(calculateGramsPerUnit(1, 14)).toBe(14);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateGramsPerUnit(0, 45)).toThrow('Serving quantity must be greater than 0');
      expect(() => calculateGramsPerUnit(0.25, 0)).toThrow('Serving size in grams must be greater than 0');
      expect(() => calculateGramsPerUnit(-1, 45)).toThrow('Serving quantity must be greater than 0');
    });
  });

  describe('convertVolumeToGrams', () => {
    it('should convert recipe volume to grams correctly', () => {
      // Rice example: item is 0.25 cup = 45g, recipe needs 2 cups
      const result = convertVolumeToGrams(2, 'cup', 0.25, 'cup', 45);
      expect(result).toBe(360); // 2 cups * 180g/cup = 360g
    });

    it('should handle different volume units', () => {
      // Item: 1 tbsp = 14g, Recipe: 1 cup
      // 1 cup = 16 tbsp, so grams per cup = 14 * 16 = 224g
      const result = convertVolumeToGrams(1, 'cup', 1, 'tbsp', 14);
      expect(result).toBe(224);
    });

    it('should throw error for non-volume units', () => {
      expect(() => convertVolumeToGrams(2, 'piece', 0.25, 'cup', 45))
        .toThrow('Both recipe and item units must be volume units');
      
      expect(() => convertVolumeToGrams(2, 'cup', 0.25, 'piece', 45))
        .toThrow('Both recipe and item units must be volume units');
    });
  });

  describe('scaleNutrition', () => {
    it('should scale nutrition values correctly', () => {
      const baseNutrition = {
        calories: 100,
        protein: 10,
        carbs: 20,
        fat: 5
      };
      
      // Double the serving size
      const scaled = scaleNutrition(baseNutrition, 200, 100);
      expect(scaled).toEqual({
        calories: 200,
        protein: 20,
        carbs: 40,
        fat: 10
      });
    });

    it('should handle fractional scaling', () => {
      const baseNutrition = {
        calories: 100,
        protein: 10.5,
        carbs: 20.3,
        fat: 5.7
      };
      
      // Half the serving size
      const scaled = scaleNutrition(baseNutrition, 50, 100);
      expect(scaled).toEqual({
        calories: 50,
        protein: 5.25,
        carbs: 10.15,
        fat: 2.85
      });
    });

    it('should handle missing nutrition values', () => {
      const baseNutrition = {
        calories: 100
        // protein, carbs, fat missing
      };
      
      const scaled = scaleNutrition(baseNutrition, 200, 100);
      expect(scaled).toEqual({
        calories: 200,
        protein: 0,
        carbs: 0,
        fat: 0
      });
    });
  });

  describe('UNIT_TO_TYPE mapping completeness', () => {
    it('should include all units mentioned in PRD', () => {
      // Volume units from PRD
      expect(UNIT_TO_TYPE.tsp).toBe('volume');
      expect(UNIT_TO_TYPE.tbsp).toBe('volume');
      expect(UNIT_TO_TYPE.cup).toBe('volume');
      expect(UNIT_TO_TYPE.fl_oz).toBe('volume');
      expect(UNIT_TO_TYPE.ml).toBe('volume');
      expect(UNIT_TO_TYPE.l).toBe('volume');

      // Weight units from PRD
      expect(UNIT_TO_TYPE.g).toBe('weight');
      expect(UNIT_TO_TYPE.kg).toBe('weight');
      expect(UNIT_TO_TYPE.oz).toBe('weight');
      expect(UNIT_TO_TYPE.lb).toBe('weight');

      // Package units from PRD
      expect(UNIT_TO_TYPE.pouch).toBe('package');
      expect(UNIT_TO_TYPE.bar).toBe('package');
      expect(UNIT_TO_TYPE.bottle).toBe('package');
      expect(UNIT_TO_TYPE.pack).toBe('package');
      expect(UNIT_TO_TYPE.piece).toBe('package');
      expect(UNIT_TO_TYPE.scoop).toBe('package');
      expect(UNIT_TO_TYPE.slice).toBe('package');
      expect(UNIT_TO_TYPE.can).toBe('package');
    });
  });
});