# Data Model Optimization & Weekly Meal Plan Enhancement - Task List

## Overview
This document contains all the actionable tasks needed to implement the data model optimization and weekly meal plan enhancement as outlined in the PRD.

## Important Implementation Note
**This project involves a complete database refactor, not incremental migrations. All DDL statements in the migration file will be updated to reflect the new data model going forward. When the database is reset, it will be created with the new optimized schema from the start. No ALTER TABLE statements are needed.**

## Key Changes in Approach
- **Update CREATE TABLE statements** instead of altering existing tables
- **Remove deprecated fields** from DDL definitions
- **Add new nutrition structure** to DDL definitions
- **Database reset** will apply all new DDL statements
- **Clean slate approach** ensures optimal performance and structure

## Phase 1: Data Model Cleanup (Week 1)
*Note: This phase focuses on updating the DDL statements in the migration file to reflect the new data model going forward. Since we're resetting the database, we're not altering existing tables but updating the CREATE TABLE statements.*

### Database Schema Updates
- [ ] **Task 1.1**: Update `supabase/migrations/20250823_init_with_improvements.sql`
  - [ ] **Update items table DDL** (not alter existing table):
    - [ ] Remove deprecated fields from CREATE TABLE statement:
      - [ ] Remove `barcode` field
      - [ ] Remove `last_edited` field
      - [ ] Remove `last_purchased` field
      - [ ] Remove `purchase_count` field
    - [ ] Remove old nutrition columns from CREATE TABLE statement:
      - [ ] Remove `carbs_per_serving`
      - [ ] Remove `fat_per_serving`
      - [ ] Remove `protein_per_serving`
      - [ ] Remove `calories_per_serving`
      - [ ] Remove `servings_per_container`
      - [ ] Remove `serving_size_grams`
      - [ ] Remove `serving_quantity`
      - [ ] Remove `serving_unit`
      - [ ] Remove `serving_unit_type`
    - [ ] Add new nutrition structure to CREATE TABLE statement:
      - [ ] Add `nutrition_per_serving JSONB` column
      - [ ] Add `serving_info JSONB` column
  - [ ] **Update recipes table DDL** to use standardized nutrition structure
  - [ ] **Update meal_logs table DDL** to use standardized macros structure
  - [ ] Ensure all table DDLs reflect the new data model going forward

### Function Updates
- [ ] **Task 1.2**: Update `upsert_item_by_name` function
  - [ ] Remove references to deprecated fields
  - [ ] Update function to use new nutrition structure
  - [ ] Test function with new schema

- [ ] **Task 1.3**: Update `batch_upsert_items` function
  - [ ] Remove references to deprecated fields
  - [ ] Update function to use `nutrition_per_serving` and `serving_info`
  - [ ] Test function with new schema

### TypeScript Type Updates
- [ ] **Task 1.4**: Update `src/types/database.ts`
  - [ ] Remove deprecated fields from items table types
  - [ ] Add new nutrition fields to items table types
  - [ ] Update Row, Insert, and Update interfaces

- [ ] **Task 1.5**: Update `src/types/index.ts`
  - [ ] Remove deprecated fields from FoodItem and DbItem interfaces
  - [ ] Add new nutrition structure to interfaces
  - [ ] Ensure consistency across all type definitions

### Testing & Validation
- [ ] **Task 1.6**: Update existing tests
  - [ ] Fix any tests that reference deprecated fields
  - [ ] Update test data to use new nutrition structure
  - [ ] Ensure all tests pass with new schema

- [ ] **Task 1.7**: Database reset preparation
  - [ ] Backup any important test data
  - [ ] Prepare for clean database recreation
  - [ ] Test database reset process

---

## Phase 2: Complete Nutrition System Refactor (Week 2)
*Note: This phase focuses on updating the DDL statements to implement the new nutrition system structure. All tables will be created with the new structure when the database is reset.*

### Database Schema Updates
- [ ] **Task 2.1**: Add nutrition types to migration file
  - [ ] Create `nutrition_info` type with comprehensive nutrition fields
  - [ ] Create `serving_info` type for serving details
  - [ ] Add types to existing migration file

- [ ] **Task 2.2**: Update recipes table DDL
  - [ ] Modify CREATE TABLE statement to use standardized `nutrition_per_serving JSONB` format
  - [ ] Ensure DDL reflects the new nutrition structure going forward
  - [ ] Test table creation with new DDL

- [ ] **Task 2.3**: Update meal_logs table DDL
  - [ ] Modify CREATE TABLE statement to use standardized `macros JSONB` format
  - [ ] Ensure DDL reflects the new macros structure going forward
  - [ ] Test table creation with new DDL

### Performance Optimization
- [ ] **Task 2.4**: Create JSONB indexes
  - [ ] Add GIN index for `items.nutrition_per_serving`
  - [ ] Add GIN index for `items.serving_info`
  - [ ] Add GIN index for `recipes.nutrition_per_serving`
  - [ ] Add GIN index for `meal_logs.macros`
  - [ ] Test query performance with new indexes

### TypeScript Interface Updates
- [ ] **Task 2.5**: Create unified nutrition interfaces
  - [ ] Create `src/types/nutrition.ts` file
  - [ ] Define `NutritionInfo` interface
  - [ ] Define `NutritionPerServing` interface
  - [ ] Export interfaces for use across the application

- [ ] **Task 2.6**: Update all component types
  - [ ] Update FoodItem interface to use new nutrition structure
  - [ ] Update Recipe interface to use new nutrition structure
  - [ ] Update MealLog interface to use new nutrition structure
  - [ ] Ensure type consistency across all components

### Component Refactoring
- [ ] **Task 2.7**: Update inventory components
  - [ ] Update `AddEditItemDialog.tsx` to use new nutrition structure
  - [ ] Update `FoodItemCard.tsx` to display new nutrition format
  - [ ] Update `InventoryPage.tsx` to handle new data structure
  - [ ] Test all inventory functionality

- [ ] **Task 2.8**: Update recipe components
  - [ ] Update `AddRecipeDialog.tsx` to use new nutrition structure
  - [ ] Update `RecipePreviewDialog.tsx` to display new nutrition format
  - [ ] Update recipe creation and editing flows
  - [ ] Test all recipe functionality

- [ ] **Task 2.9**: Update meal logging components
  - [ ] Update `LogMealDialog.tsx` to use new macros structure
  - [ ] Update meal log display components
  - [ ] Test meal logging functionality

### Seed Data Update
- [ ] **Task 2.10**: Update `supabase/seed.sql`
  - [ ] Convert all nutrition data to JSONB format
  - [ ] Remove deprecated fields from INSERT statements
  - [ ] Update all INSERT statements to use new structure
  - [ ] Test seed data insertion with new schema
  - [ ] Verify data integrity after seeding

### Testing & Validation
- [ ] **Task 2.11**: Comprehensive testing
  - [ ] Test nutrition data creation and retrieval
  - [ ] Test serving information handling
  - [ ] Test JSONB query performance
  - [ ] Test data validation and error handling

- [ ] **Task 2.12**: Performance testing
  - [ ] Test query performance with new JSONB structure
  - [ ] Benchmark against old structure if possible
  - [ ] Optimize any slow queries

---

## Phase 3: Weekly Meal Plan Enhancement (Week 3)

### Week Navigation Implementation
- [ ] **Task 3.1**: Update `useMealPlan` hook
  - [ ] Add `currentWeekStart` state management
  - [ ] Add `availableWeeks` state management
  - [ ] Implement `loadAvailableWeeks` function
  - [ ] Implement `navigateToWeek` function
  - [ ] Implement `navigateToPreviousWeek` function
  - [ ] Implement `navigateToNextWeek` function
  - [ ] Test week navigation functionality

### Auto-increment Block Naming
- [x] **Task 3.2**: Update `AddEditMealPlanBlockDialog.tsx`
  - [x] Implement `generateBlockName` function
  - [x] Add logic to auto-increment block numbers
  - [x] Ensure block names follow `block_1`, `block_2` pattern
  - [x] Test block naming functionality

### Block Reuse Functionality
- [ ] **Task 3.3**: Create `BlockReuseDialog.tsx`
  - [ ] Create component for reusing meal plan blocks
  - [ ] Implement `loadAvailableBlocks` function
  - [ ] Implement `reuseBlock` function
  - [ ] Add UI for selecting and reusing blocks
  - [ ] Test block reuse functionality

### Enhanced Planner UI
- [ ] **Task 3.4**: Update `Planner.tsx`
  - [ ] Add week navigation header with previous/next buttons
  - [ ] Add week selector dropdown
  - [ ] Integrate week navigation with existing planner functionality
  - [ ] Test complete planner workflow

- [ ] **Task 3.5**: Update `WeeklyMealPlanOverview.tsx`
  - [ ] Ensure component works with multi-week navigation
  - [ ] Test week switching functionality
  - [ ] Verify data display across different weeks

### Database Integration
- [ ] **Task 3.6**: Test weekly meal plan CRUD operations
  - [ ] Test creating meal plans for different weeks
  - [ ] Test updating meal plans across weeks
  - [ ] Test deleting meal plans and blocks
  - [ ] Verify data integrity across weeks

---

## Phase 4: Testing & Validation (Week 4)

### End-to-End Testing
- [ ] **Task 4.1**: Complete user workflow testing
  - [ ] Test complete meal planning workflow
  - [ ] Test week navigation and block management
  - [ ] Test nutrition data consistency across tables
  - [ ] Test data integrity after all changes

### Performance Testing
- [ ] **Task 4.2**: Multi-week navigation performance
  - [ ] Test loading performance for multiple weeks
  - [ ] Test memory usage with large datasets
  - [ ] Optimize any performance bottlenecks

### Data Migration Validation
- [ ] **Task 4.3**: Verify database integrity
  - [ ] Test database reset and recreation
  - [ ] Verify all new schema elements work correctly
  - [ ] Test seed data insertion and retrieval
  - [ ] Verify no data loss during migration

### User Acceptance Testing
- [ ] **Task 4.4**: User experience validation
  - [ ] Test UI responsiveness and usability
  - [ ] Verify all new features work as expected
  - [ ] Test edge cases and error handling
  - [ ] Gather feedback on new functionality

### Documentation Updates
- [ ] **Task 4.5**: Update project documentation
  - [ ] Update README.md with new features
  - [ ] Update API documentation if applicable
  - [ ] Create user guides for new meal planning features
  - [ ] Document any breaking changes

---

## Cross-Phase Tasks

### Code Quality & Standards
- [ ] **Task X.1**: Code review and refactoring
  - [ ] Review all changes for code quality
  - [ ] Ensure consistent coding standards
  - [ ] Remove any unused code or imports
  - [ ] Optimize performance where possible

### Testing Coverage
- [ ] **Task X.2**: Test coverage improvement
  - [ ] Add unit tests for new functionality
  - [ ] Add integration tests for database changes
  - [ ] Add E2E tests for critical user flows
  - [ ] Ensure minimum 80% test coverage

### Error Handling
- [ ] **Task X.3**: Comprehensive error handling
  - [ ] Add error boundaries for React components
  - [ ] Implement proper error handling for database operations
  - [ ] Add user-friendly error messages
  - [ ] Test error scenarios and recovery

### Accessibility
- [ ] **Task X.4**: Accessibility improvements
  - [ ] Ensure all new components are keyboard navigable
  - [ ] Add proper ARIA labels and roles
  - [ ] Test with screen readers
  - [ ] Verify color contrast meets WCAG standards

---

## Risk Mitigation Tasks

### Rollback Preparation
- [ ] **Task R.1**: Prepare rollback procedures
  - [ ] Document rollback steps for each phase
  - [ ] Create backup strategies for critical data
  - [ ] Test rollback procedures
  - [ ] Prepare communication plan for issues

### Data Backup
- [ ] **Task R.2**: Data backup strategies
  - [ ] Backup current database state
  - [ ] Backup current codebase
  - [ ] Document backup procedures
  - [ ] Test backup restoration

---

## Success Criteria Checklist

### Data Model Cleanup
- [ ] All deprecated fields removed from database schema
- [ ] All deprecated fields removed from TypeScript types
- [ ] All functions updated to use new schema
- [ ] All tests pass with new structure

### Nutrition Standardization
- [ ] Unified nutrition interface implemented
- [ ] All tables use consistent nutrition structure
- [ ] JSONB indexes created and optimized
- [ ] Seed data updated and tested

### Weekly Meal Plan Enhancement
- [ ] Multi-week navigation working correctly
- [ ] Auto-increment block naming implemented
- [ ] Block reuse functionality working
- [ ] Enhanced UI components tested

### Overall System Health
- [ ] No breaking changes introduced
- [ ] Performance maintained or improved
- [ ] All existing functionality preserved
- [ ] New features working as expected

---

## Notes

- **Priority**: Tasks are ordered by phase and dependency
- **Effort**: Each task should be estimated individually based on complexity
- **Dependencies**: Some tasks may require others to be completed first
- **Testing**: Each task should include testing as part of completion criteria
- **Documentation**: Code changes should include appropriate documentation updates

## Estimated Timeline

- **Phase 1**: 5-7 days
- **Phase 2**: 7-10 days  
- **Phase 3**: 5-7 days
- **Phase 4**: 3-5 days
- **Total**: 20-29 days (4-6 weeks)

*Note: Timeline estimates assume 1 developer working full-time on these tasks. Adjust based on team size and availability.*
