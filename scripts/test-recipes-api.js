#!/usr/bin/env node

// Integration test script for recipes API using local Supabase
// This bypasses the Vitest mocking to test against real local database

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test recipe data
const testRecipe = {
  name: 'API Integration Test Recipe',
  instructions: '1. Mix ingredients\n2. Cook for 20 minutes\n3. Serve hot',
  servings: 4,
  total_time: 30,
  ingredient_list: ['flour', 'eggs', 'milk', 'salt'],
  nutrition_per_serving: {
    calories: 250,
    protein: 15,
    carbs: 30,
    fat: 8,
  },
  notes: 'This is a test recipe for API integration testing',
  nutrition_source: 'ai_generated',
  is_favorite: false,
};

// API Functions (copied from our service)
async function getAllRecipes() {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

async function getRecipeByName(name) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: `Recipe with name "${name}" not found`,
          success: false,
        };
      }
      
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

async function createRecipe(recipe) {
  try {
    // Check if recipe with same name already exists
    const existingRecipe = await getRecipeByName(recipe.name);
    if (existingRecipe.success && existingRecipe.data) {
      return {
        data: null,
        error: `Recipe with name "${recipe.name}" already exists`,
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

async function updateRecipeById(id, updates) {
  try {
    // Check if recipe exists
    const { error: fetchError } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return {
          data: null,
          error: `Recipe with ID ${id} not found`,
          success: false,
        };
      }
      return {
        data: null,
        error: fetchError.message,
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

async function deleteRecipeById(id) {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: { id },
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

async function deleteRecipeByName(name) {
  try {
    if (!name || name.trim().length === 0) {
      return {
        data: null,
        error: 'Recipe name is required',
        success: false,
      };
    }

    // First get the recipe to find its ID and verify it exists
    const existingRecipe = await getRecipeByName(name.trim());
    if (!existingRecipe.success || !existingRecipe.data) {
      return {
        data: null,
        error: existingRecipe.error || `Recipe with name "${name}" not found`,
        success: false,
      };
    }

    // Use the ID-based delete
    const deleteResult = await deleteRecipeById(existingRecipe.data.id);
    if (!deleteResult.success) {
      return {
        data: null,
        error: deleteResult.error,
        success: false,
      };
    }

    return {
      data: { 
        id: existingRecipe.data.id, 
        name: existingRecipe.data.name 
      },
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

async function searchRecipesByName(searchTerm) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('name', `%${searchTerm.trim()}%`)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err.message,
      success: false,
    };
  }
}

// Cleanup function
async function cleanupTestRecipes() {
  const { data: testRecipes } = await supabase
    .from('recipes')
    .select('id')
    .ilike('name', '%API Integration Test%');
  
  if (testRecipes && testRecipes.length > 0) {
    const testIds = testRecipes.map(r => r.id);
    await supabase
      .from('recipes')
      .delete()
      .in('id', testIds);
  }
}

// Test runner
async function runTests() {
  console.log('🧪 Starting Recipes API Integration Tests');
  console.log('📍 Testing against Local Supabase:', supabaseUrl);
  console.log();

  let passed = 0;
  let failed = 0;
  let createdRecipeId = null;

  async function test(name, testFn) {
    try {
      console.log(`🔄 ${name}`);
      await testFn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
    console.log();
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // Cleanup before tests
  await cleanupTestRecipes();

  // Test 1: Create Recipe
  await test('Should create a new recipe', async () => {
    const result = await createRecipe(testRecipe);
    assert(result.success, `Create failed: ${result.error}`);
    assert(result.data.name === testRecipe.name, 'Recipe name mismatch');
    assert(result.data.servings === testRecipe.servings, 'Servings mismatch');
    assert(result.data.id && typeof result.data.id === 'number', 'No valid ID returned');
    createdRecipeId = result.data.id;
    console.log(`   Created recipe with ID: ${createdRecipeId}`);
  });

  // Test 2: Get Recipe By Name
  await test('Should retrieve recipe by name', async () => {
    const result = await getRecipeByName(testRecipe.name);
    assert(result.success, `Get by name failed: ${result.error}`);
    assert(result.data.id === createdRecipeId, 'Retrieved wrong recipe');
    assert(result.data.name === testRecipe.name, 'Name mismatch');
    console.log(`   Retrieved recipe: ${result.data.name}`);
  });

  // Test 3: Get All Recipes
  await test('Should retrieve all recipes', async () => {
    const result = await getAllRecipes();
    assert(result.success, `Get all failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Data is not an array');
    assert(result.data.some(r => r.id === createdRecipeId), 'Created recipe not found in list');
    console.log(`   Found ${result.data.length} total recipes`);
  });

  // Test 4: Search Recipes
  await test('Should search recipes by name', async () => {
    const result = await searchRecipesByName('API Integration');
    assert(result.success, `Search failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Data is not an array');
    assert(result.data.length >= 1, 'No search results found');
    assert(result.data.some(r => r.id === createdRecipeId), 'Created recipe not found in search');
    console.log(`   Search returned ${result.data.length} results`);
  });

  // Test 5: Update Recipe
  await test('Should update recipe by ID', async () => {
    const updates = {
      servings: 8,
      notes: 'Updated in integration test',
      is_favorite: true,
    };
    const result = await updateRecipeById(createdRecipeId, updates);
    assert(result.success, `Update failed: ${result.error}`);
    assert(result.data.servings === 8, 'Servings not updated');
    assert(result.data.is_favorite === true, 'is_favorite not updated');
    assert(result.data.notes === updates.notes, 'Notes not updated');
    console.log(`   Updated recipe servings to ${result.data.servings}`);
  });

  // Test 6: Prevent Duplicate Names
  await test('Should prevent duplicate recipe names', async () => {
    const result = await createRecipe(testRecipe);
    assert(!result.success, 'Should have failed to create duplicate');
    assert(result.error.includes('already exists'), 'Wrong error message for duplicate');
    console.log(`   Correctly prevented duplicate: ${result.error}`);
  });

  // Test 7: Handle Non-Existent Recipe
  await test('Should handle non-existent recipe lookup', async () => {
    const result = await getRecipeByName('Non-Existent Recipe 12345');
    assert(!result.success, 'Should have failed to find non-existent recipe');
    assert(result.error.includes('not found'), 'Wrong error message for not found');
    console.log(`   Correctly handled not found: ${result.error}`);
  });

  // Test 8: Delete Recipe By Name
  await test('Should delete recipe by name', async () => {
    const result = await deleteRecipeByName(testRecipe.name);
    assert(result.success, `Delete by name failed: ${result.error}`);
    assert(result.data.id === createdRecipeId, 'Wrong ID returned from delete by name');
    assert(result.data.name === testRecipe.name, 'Wrong name returned from delete by name');
    
    // Verify deletion
    const getResult = await getRecipeByName(testRecipe.name);
    assert(!getResult.success, 'Recipe still exists after deletion by name');
    console.log(`   Deleted recipe "${testRecipe.name}" with ID ${createdRecipeId}`);
  });

  // Test 9: Handle Delete By Name Non-Existent Recipe
  await test('Should handle non-existent recipe deletion by name', async () => {
    const result = await deleteRecipeByName('Non-Existent Recipe XYZ');
    assert(!result.success, 'Should have failed to delete non-existent recipe by name');
    assert(result.error.includes('not found'), 'Wrong error message for delete by name not found');
    console.log(`   Correctly handled delete by name not found: ${result.error}`);
  });

  // Cleanup after tests
  await cleanupTestRecipes();

  // Results
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log(`   🔢 Total Tests: ${passed + failed}`);
  
  if (failed === 0) {
    console.log();
    console.log('🎉 All tests passed! Your Recipes API (including deleteRecipeByName) is working correctly with local Supabase.');
  } else {
    console.log();
    console.log('⚠️  Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});