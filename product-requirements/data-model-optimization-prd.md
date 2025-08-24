# Data Model Optimization & Weekly Meal Plan Enhancement PRD

## Executive Summary

This PRD outlines the optimization of the food tracking application's data model and enhancement of the weekly meal planning functionality. The changes focus on data consistency, audit trail improvements, and enhanced user experience for meal planning across different weeks.

## Current State Analysis

### Existing Data Model Issues
- **Items Table**: Contains deprecated fields (`barcode`, `last_edited`, `last_purchased`, `purchase_count`) that are no longer used
- **Nutrition Data**: Inconsistent structure across tables with varying field names and types
- **Audit Trail**: Missing `updated_at` field in `meal_logs` table
- **Weekly Meal Plans**: Limited to current week only, no navigation between weeks

### Current Weekly Meal Plan Implementation
- Single week view only
- Manual block naming (no auto-increment)
- No ability to reuse previous meal plan blocks
- Limited week navigation capabilities

## Objectives

1. **Data Model Cleanup**: Remove deprecated fields and standardize nutrition information
2. **Audit Trail Consistency**: Ensure all tables have consistent `updated_at` timestamps
3. **Nutrition Standardization**: Create unified nutrition interface across all tables
4. **Weekly Meal Plan Enhancement**: Enable multi-week navigation and block reuse
5. **Auto-increment Block Naming**: Implement automatic block numbering system

## Requirements

### 1. Items Data Model Cleanup

#### Remove Deprecated Fields
- [ ] Remove `barcode` field from items table
- [ ] Remove `last_edited` field from items table  
- [ ] Remove `last_purchased` field from items table
- [ ] Remove `purchase_count` field from items table

#### Database Schema Update (Update Existing Init File)
```sql
-- Update existing migration file: supabase/migrations/20250823_init_with_improvements.sql

-- Note: Since database will be reset after refactor, we'll update the DDL directly
-- in the existing init file instead of creating new migrations

-- Updated items table DDL (remove deprecated fields)
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    price NUMERIC(10,2) CHECK (price IS NULL OR price >= 0),
    nutrition_per_serving JSONB,
    serving_info JSONB,
    image_url TEXT,
    ingredients TEXT,
    nutrition_source TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    normalized_name TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Updated upsert function (no deprecated field references)
CREATE OR REPLACE FUNCTION upsert_item_by_name(
    p_name TEXT,
    p_brand TEXT,
    p_price NUMERIC,
    p_category TEXT DEFAULT NULL,
    p_in_stock BOOLEAN DEFAULT TRUE
) RETURNS items AS $$
INSERT INTO items (name, brand, price, category, in_stock)
VALUES (p_name, p_brand, p_price, p_category, COALESCE(p_in_stock, TRUE))
ON CONFLICT (normalized_name) DO UPDATE
    SET brand = EXCLUDED.brand,
        price = EXCLUDED.price,
        updated_at = NOW()
RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Updated batch_upsert_items function (no deprecated field references)
CREATE OR REPLACE FUNCTION batch_upsert_items(
    items_data JSONB
) RETURNS SETOF items AS $$
DECLARE
    item_data JSONB;
    result_item items;
BEGIN
    FOR item_data IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
        INSERT INTO items (
            name, 
            brand, 
            price, 
            category, 
            in_stock, 
            nutrition_per_serving,
            serving_info,
            image_url,
            ingredients,
            nutrition_source,
            rating
        )
        VALUES (
            item_data->>'name',
            item_data->>'brand',
            (item_data->>'price')::NUMERIC,
            item_data->>'category',
            COALESCE((item_data->>'in_stock')::BOOLEAN, TRUE),
            item_data->>'nutrition_per_serving',
            item_data->>'serving_info',
            item_data->>'image_url',
            item_data->>'ingredients',
            item_data->>'nutrition_source',
            (item_data->>'rating')::INTEGER
        )
        ON CONFLICT (normalized_name) DO UPDATE
        SET 
            brand = EXCLUDED.brand,
            price = EXCLUDED.price,
            category = EXCLUDED.category,
            in_stock = EXCLUDED.in_stock,
            nutrition_per_serving = EXCLUDED.nutrition_per_serving,
            serving_info = EXCLUDED.serving_info,
            image_url = EXCLUDED.image_url,
            ingredients = EXCLUDED.ingredients,
            nutrition_source = EXCLUDED.nutrition_source,
            rating = EXCLUDED.rating,
            updated_at = NOW()
        RETURNING * INTO result_item;
        
        RETURN NEXT result_item;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Nutrition Information Standardization

#### Create Unified Nutrition Interface
```typescript
// src/types/nutrition.ts
export interface NutritionInfo {
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  fiber_per_serving?: number;
  sugar_per_serving?: number;
  sodium_per_serving?: number;
  saturated_fat_per_serving?: number;
  trans_fat_per_serving?: number;
  cholesterol_per_serving?: number;
}

export interface NutritionPerServing extends NutritionInfo {
  serving_size_grams?: number;
  serving_quantity?: number;
  serving_unit?: string;
  serving_unit_type?: 'volume' | 'weight' | 'package';
}
```

#### Complete Nutrition System Refactor (Update Existing Init File)
```sql
-- Update existing migration file: supabase/migrations/20250823_init_with_improvements.sql

-- Step 1: Create comprehensive nutrition types
CREATE TYPE nutrition_info AS (
  calories_per_serving NUMERIC(10,2),
  protein_per_serving NUMERIC(10,2),
  carbs_per_serving NUMERIC(10,2),
  fat_per_serving NUMERIC(10,2),
  fiber_per_serving NUMERIC(10,2),
  sugar_per_serving NUMERIC(10,2),
  sodium_per_serving NUMERIC(10,2),
  saturated_fat_per_serving NUMERIC(10,2),
  trans_fat_per_serving NUMERIC(10,2),
  cholesterol_per_serving NUMERIC(10,2)
);

CREATE TYPE serving_info AS (
  size_grams NUMERIC(10,2),
  quantity NUMERIC(10,2),
  unit TEXT,
  unit_type serving_unit_type
);

-- Step 2: Update items table DDL to include new nutrition structure
-- The items table will be created with the new nutrition structure from the start
-- No ALTER TABLE statements needed since we're recreating the database

-- Step 3: Create clean schema with new nutrition structure
-- No data migration needed since we're doing a complete refactor
-- The new schema will be created fresh when the database is reset

-- Step 4: Create indexes for new nutrition JSONB columns
CREATE INDEX idx_items_nutrition_per_serving ON items USING GIN(nutrition_per_serving);
CREATE INDEX idx_items_serving_info ON items USING GIN(serving_info);
CREATE INDEX idx_recipes_nutrition_per_serving ON recipes USING GIN(nutrition_per_serving);
CREATE INDEX idx_meal_logs_macros ON meal_logs USING GIN(macros);



-- Step 5: Update seed.sql file (separate task after migration)
-- The seed.sql file will need to be updated to use the new nutrition structure:
-- - Convert all nutrition data to JSONB format
-- - Remove deprecated fields (barcode, last_purchased, purchase_count, last_edited)
-- - Update INSERT statements to use nutrition_per_serving and serving_info
-- - Example conversion:
--   OLD: (name, brand, category, in_stock, price, carbs_per_serving, fat_per_serving, protein_per_serving, servings_per_container, serving_size_grams, serving_quantity, serving_unit, serving_unit_type, image_url, ingredients, rating, nutrition_source, barcode, last_purchased, purchase_count, last_edited)
--   NEW: (name, brand, category, in_stock, price, nutrition_per_serving, serving_info, image_url, ingredients, rating, nutrition_source, created_at, updated_at)

-- Note: Since we're updating the existing init migration file, all schema changes
-- will be applied when the database is reset, ensuring a clean start with the new structure.

#### Update TypeScript Types
```typescript
// src/types/database.ts - Update items table
items: {
  Row: {
    // ... existing fields ...
    nutrition_per_serving: NutritionInfo | null;
    serving_info: {
      size_grams?: number;
      quantity?: number;
      unit?: string;
      unit_type?: 'volume' | 'weight' | 'package';
    } | null;
    // Remove deprecated fields
    // barcode: string | null; ❌
    // last_edited: string | null; ❌
    // last_purchased: string | null; ❌
    // purchase_count: number | null; ❌
  }
}

// Update recipes table
recipes: {
  Row: {
    // ... existing fields ...
    nutrition_per_serving: NutritionInfo | null;
  }
}

// Update meal_logs table
meal_logs: {
  Row: {
    // ... existing fields ...
    macros: NutritionInfo | null;
    updated_at: string; // ✅ Add this field
  }
}
```

### 3. Audit Trail Consistency

#### Add Missing updated_at Field
```sql
-- Add updated_at to meal_logs if not exists
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Create trigger for meal_logs updated_at
CREATE OR REPLACE FUNCTION trigger_update_meal_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_meal_logs_update_updated_at
    BEFORE UPDATE ON meal_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_meal_logs_updated_at();
```

### 4. Weekly Meal Plan Enhancement

#### Enable Multi-Week Navigation
```typescript
// src/hooks/useMealPlan.ts - Add week navigation
export const useMealPlan = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  
  // Load available weeks
  const loadAvailableWeeks = useCallback(async () => {
    const { data, error } = await supabase
      .from('weekly_meal_plans')
      .select('week_start')
      .order('week_start', { ascending: false });
    
    if (!error && data) {
      setAvailableWeeks(data.map(w => w.week_start));
    }
  }, []);

  // Navigate to specific week
  const navigateToWeek = useCallback(async (weekStart: string) => {
    setCurrentWeekStart(weekStart);
    await loadWeekPlan(weekStart);
  }, []);

  // Navigate to previous/next week
  const navigateToPreviousWeek = useCallback(() => {
    const currentIndex = availableWeeks.indexOf(currentWeekStart);
    if (currentIndex < availableWeeks.length - 1) {
      navigateToWeek(availableWeeks[currentIndex + 1]);
    }
  }, [currentWeekStart, availableWeeks]);

  const navigateToNextWeek = useCallback(() => {
    const currentIndex = availableWeeks.indexOf(currentWeekStart);
    if (currentIndex > 0) {
      navigateToWeek(availableWeeks[currentIndex - 1]);
    }
  }, [currentWeekStart, availableWeeks]);
};
```

#### Auto-increment Block Naming
```typescript
// src/components/AddEditMealPlanBlockDialog.tsx
export const AddEditMealPlanBlockDialog = () => {
  const generateBlockName = useCallback((weeklyPlanId: number) => {
    // Get existing blocks for this week
    const existingBlocks = weeklyPlan?.blocks || [];
    const blockNumbers = existingBlocks
      .map(block => {
        const match = block.name.match(/^block_(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);
    
    const nextBlockNumber = blockNumbers.length > 0 
      ? Math.max(...blockNumbers) + 1 
      : 1;
    
    return `block_${nextBlockNumber}`;
  }, [weeklyPlan]);

  const handleCreateBlock = useCallback((blockData: Omit<MealPlanBlock, 'id'>) => {
    const blockName = generateBlockName(weeklyPlan.id);
    const newBlock = { ...blockData, name: blockName };
    onCreateBlock(newBlock);
  }, [generateBlockName, weeklyPlan, onCreateBlock]);
};
```

#### Block Reuse Functionality
```typescript
// src/components/BlockReuseDialog.tsx
export const BlockReuseDialog = () => {
  const [availableBlocks, setAvailableBlocks] = useState<MealPlanBlock[]>([]);
  
  // Load blocks from other weeks
  const loadAvailableBlocks = useCallback(async () => {
    const { data, error } = await supabase
      .from('meal_plan_blocks')
      .select(`
        id,
        name,
        start_day,
        end_day,
        weekly_plan_id,
        weekly_meal_plans!inner(week_start)
      `)
      .neq('weekly_plan_id', currentWeeklyPlanId)
      .order('weekly_meal_plans.week_start', { ascending: false });
    
    if (!error && data) {
      setAvailableBlocks(data);
    }
  }, [currentWeeklyPlanId]);

  // Reuse block in current week
  const reuseBlock = useCallback(async (blockId: number) => {
    // Clone the block structure and create new instances
    const originalBlock = availableBlocks.find(b => b.id === blockId);
    if (originalBlock) {
      const newBlock = {
        ...originalBlock,
        id: undefined, // Will be generated by database
        weekly_plan_id: currentWeeklyPlanId,
        name: generateBlockName(currentWeeklyPlanId)
      };
      
      await createMealPlanBlock(newBlock);
    }
  }, [availableBlocks, currentWeeklyPlanId, createMealPlanBlock]);
};
```

#### Enhanced Planner UI
```typescript
// src/pages/Planner.tsx - Add week navigation
const Planner = () => {
  const {
    currentWeekStart,
    availableWeeks,
    navigateToWeek,
    navigateToPreviousWeek,
    navigateToNextWeek,
    // ... existing props
  } = useMealPlan();

  return (
    <Layout>
      <section className="space-y-6">
        {/* Week Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={navigateToPreviousWeek}
              disabled={!canNavigatePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Week
            </Button>
            
            <Select value={currentWeekStart} onValueChange={navigateToWeek}>
              <SelectTrigger className="w-48">
                <SelectValue>
                  {formatWeekStart(currentWeekStart)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableWeeks.map(weekStart => (
                  <SelectItem key={weekStart} value={weekStart}>
                    {formatWeekStart(weekStart)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={navigateToNextWeek}
              disabled={!canNavigateNext}
            >
              Next Week
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>
        
        {/* Existing content... */}
      </section>
    </Layout>
  );
};
```

## Implementation Plan

### Phase 1: Data Model Cleanup (Week 1)
1. Update existing init migration file with clean DDL (no deprecated fields)
2. Update upsert functions to remove deprecated field references
3. Update TypeScript types and interfaces
4. Prepare for database reset and migration
5. Run tests to ensure no breaking changes

### Phase 2: Complete Nutrition System Refactor (Week 2)
1. Update existing init migration file with comprehensive nutrition refactor
2. Implement new nutrition types and interfaces
3. Update all TypeScript types and interfaces
4. Refactor all components to use new nutrition system
5. Update all tests and validation
6. Performance testing for new JSONB queries
7. **Update seed.sql to use new nutrition structure** (after schema refactor is complete)
   - Convert all nutrition data from individual columns to JSONB format
   - Remove deprecated fields (barcode, last_purchased, purchase_count, last_edited)
   - Update all INSERT statements to use new structure
   - Test seed data insertion with new schema

### Phase 3: Weekly Meal Plan Enhancement (Week 3)
1. Implement week navigation functionality
2. Add auto-increment block naming
3. Create block reuse functionality
4. Update UI components for multi-week support
5. Add comprehensive testing

### Phase 4: Testing & Validation (Week 4)
1. End-to-end testing of all new functionality
2. Performance testing for multi-week navigation
3. Data migration validation
4. User acceptance testing
5. Documentation updates

## Testing Strategy

### Unit Tests
- Test nutrition interface consistency
- Test block naming auto-increment logic
- Test week navigation functions
- Test data migration functions

### Integration Tests
- Test database schema changes
- Test nutrition data migration
- Test weekly meal plan CRUD operations
- Test block reuse functionality

### E2E Tests
- Test complete user workflow for meal planning
- Test week navigation and block management
- Test nutrition data consistency across tables
- Test data integrity after migrations

## Success Criteria

1. **Data Model Cleanup**: All deprecated fields removed without data loss
2. **Nutrition Standardization**: Consistent nutrition interface across all tables
3. **Audit Trail**: All tables have consistent `updated_at` timestamps
4. **Week Navigation**: Users can navigate between different weeks seamlessly
5. **Block Management**: Auto-increment naming and block reuse working correctly
6. **Performance**: No degradation in application performance
7. **Data Integrity**: All existing data preserved and properly migrated

## Risk Assessment

### High Risk
- **Data Migration**: Complex nutrition data restructuring could lead to data loss
- **Breaking Changes**: Schema changes may affect existing functionality

### Medium Risk
- **Performance**: Multi-week navigation could impact load times
- **UI Complexity**: Enhanced planner interface may confuse users

### Mitigation Strategies
- **Comprehensive Testing**: Extensive testing before production deployment
- **Rollback Plan**: Database migration rollback procedures
- **User Training**: Clear documentation and user guides
- **Phased Rollout**: Gradual deployment to minimize impact

## Dependencies

- Supabase database access and migration capabilities
- TypeScript compiler and type checking
- React component library updates
- Testing framework compatibility
- User acceptance testing resources

## Conclusion

This PRD outlines a comprehensive plan to optimize the food tracking application's data model and enhance the weekly meal planning functionality. The changes will improve data consistency, user experience, and system maintainability while preserving all existing functionality.

The implementation follows a phased approach to minimize risk and ensure quality delivery. Each phase includes comprehensive testing and validation to maintain system integrity throughout the transformation process.
