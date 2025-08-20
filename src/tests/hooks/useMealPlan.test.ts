import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMealPlan } from '../../hooks/useMealPlan';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}));

describe('useMealPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with mock data', () => {
    const { result } = renderHook(() => useMealPlan());
    
    expect(result.current.weeklyPlan).toBeDefined();
    expect(result.current.weeklyPlan?.blocks).toHaveLength(2);
    expect(result.current.usingMockData).toBe(true);
  });

  it('should create a new meal plan block', () => {
    const { result } = renderHook(() => useMealPlan());
    
    const newBlock = {
      name: 'Test Block',
      startDay: 0,
      endDay: 2,
      rotations: [
        {
          name: 'Test Rotation',
          recipes: ['recipe-1', 'recipe-2'],
          notes: 'Test notes'
        }
      ]
    };

    act(() => {
      result.current.createMealPlanBlock(newBlock);
    });

    expect(result.current.weeklyPlan?.blocks).toHaveLength(3);
    const createdBlock = result.current.weeklyPlan?.blocks.find(b => b.name === 'Test Block');
    expect(createdBlock).toBeDefined();
    expect(createdBlock?.rotations).toHaveLength(1);
    expect(createdBlock?.rotations[0].recipes).toEqual(['recipe-1', 'recipe-2']);
  });

  it('should update an existing meal plan block', () => {
    const { result } = renderHook(() => useMealPlan());
    
    const blockId = result.current.weeklyPlan?.blocks[0].id;
    expect(blockId).toBeDefined();

    act(() => {
      result.current.updateMealPlanBlock(blockId!, { name: 'Updated Block Name' });
    });

    const updatedBlock = result.current.weeklyPlan?.blocks.find(b => b.id === blockId);
    expect(updatedBlock?.name).toBe('Updated Block Name');
  });

  it('should delete a meal plan block', () => {
    const { result } = renderHook(() => useMealPlan());
    
    const initialBlockCount = result.current.weeklyPlan?.blocks.length || 0;
    const blockId = result.current.weeklyPlan?.blocks[0].id;

    act(() => {
      result.current.deleteMealPlanBlock(blockId!);
    });

    expect(result.current.weeklyPlan?.blocks).toHaveLength(initialBlockCount - 1);
    expect(result.current.weeklyPlan?.blocks.find(b => b.id === blockId)).toBeUndefined();
  });

  it('should add a rotation to a block', () => {
    const { result } = renderHook(() => useMealPlan());
    
    const blockId = result.current.weeklyPlan?.blocks[0].id;
    const newRotation = {
      name: 'New Rotation',
      recipes: ['new-recipe'],
      notes: 'New rotation notes'
    };

    act(() => {
      result.current.addRotationToBlock(blockId!, newRotation);
    });

    const block = result.current.weeklyPlan?.blocks.find(b => b.id === blockId);
    expect(block?.rotations).toHaveLength(3); // Should have 2 original + 1 new
    const addedRotation = block?.rotations.find(r => r.name === 'New Rotation');
    expect(addedRotation).toBeDefined();
    expect(addedRotation?.recipes).toEqual(['new-recipe']);
  });

  it('should update a rotation', () => {
    const { result } = renderHook(() => useMealPlan());
    
    const blockId = result.current.weeklyPlan?.blocks[0].id;
    const rotationId = result.current.weeklyPlan?.blocks[0].rotations[0].id;

    act(() => {
      result.current.updateRotation(blockId!, rotationId!, { name: 'Updated Rotation' });
    });

    const block = result.current.weeklyPlan?.blocks.find(b => b.id === blockId);
    const updatedRotation = block?.rotations.find(r => r.id === rotationId);
    expect(updatedRotation?.name).toBe('Updated Rotation');
  });

  it('should delete a rotation', () => {
    const { result } = renderHook(() => useMealPlan());
    
    const blockId = result.current.weeklyPlan?.blocks[0].id;
    const initialRotationCount = result.current.weeklyPlan?.blocks[0].rotations.length;
    const rotationId = result.current.weeklyPlan?.blocks[0].rotations[0].id;

    act(() => {
      result.current.deleteRotation(blockId!, rotationId!);
    });

    const block = result.current.weeklyPlan?.blocks.find(b => b.id === blockId);
    expect(block?.rotations).toHaveLength(initialRotationCount - 1);
    expect(block?.rotations.find(r => r.id === rotationId)).toBeUndefined();
  });

  it('should get correct day names', () => {
    const { result } = renderHook(() => useMealPlan());
    
    expect(result.current.getDayName(0)).toBe('Monday');
    expect(result.current.getDayName(1)).toBe('Tuesday');
    expect(result.current.getDayName(6)).toBe('Sunday');
    expect(result.current.getDayName(7)).toBe('Unknown');
  });

  it('should get correct day ranges', () => {
    const { result } = renderHook(() => useMealPlan());
    
    expect(result.current.getDayRange(0, 2)).toBe('Monday - Wednesday');
    expect(result.current.getDayRange(3, 5)).toBe('Thursday - Saturday');
    expect(result.current.getDayRange(1, 1)).toBe('Tuesday');
  });
});
