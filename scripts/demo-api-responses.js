#!/usr/bin/env node

// Demo script to show actual API response formats
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Functions (same as our service)
async function getAllRecipes() {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message, success: false };
    }
    return { data: data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
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
        return { data: null, error: `Recipe with name "${name}" not found`, success: false };
      }
      return { data: null, error: error.message, success: false };
    }
    return { data: data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

async function createRecipe(recipe) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message, success: false };
    }
    return { data: data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
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
      return { data: null, error: error.message, success: false };
    }
    return { data: data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

async function updateRecipeById(id, updates) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message, success: false };
    }
    return { data: data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

async function deleteRecipeById(id) {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      return { data: null, error: error.message, success: false };
    }
    return { data: { id }, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

async function deleteRecipeByName(name) {
  try {
    if (!name || name.trim().length === 0) {
      return { data: null, error: 'Recipe name is required', success: false };
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
      return { data: null, error: deleteResult.error, success: false };
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
    return { data: null, error: err.message, success: false };
  }
}

function logResponse(title, response) {
  console.log(`\n🔷 ${title}`);
  console.log('=' .repeat(50));
  console.log(JSON.stringify(response, null, 2));
}

async function demo() {
  console.log('🎯 API Response Demo - Real Data from Local Supabase');
  console.log('📍 Connected to:', supabaseUrl);
  
  // 1. Get All Recipes (first 2 only for demo)
  const allRecipes = await getAllRecipes();
  if (allRecipes.success && allRecipes.data.length > 0) {
    // Show only first 2 recipes to keep output manageable
    const limitedResponse = {
      ...allRecipes,
      data: allRecipes.data.slice(0, 2)
    };
    limitedResponse.data_summary = `Showing 2 of ${allRecipes.data.length} total recipes`;
    logResponse('GET ALL RECIPES (First 2)', limitedResponse);
  }

  // 2. Get Recipe by Name (exact match)
  const singleRecipe = await getRecipeByName('Tzatziki');
  logResponse('GET RECIPE BY NAME: "Tzatziki"', singleRecipe);

  // 3. Search Recipes (partial match)
  const searchResults = await searchRecipesByName('Pasta');
  logResponse('SEARCH RECIPES: "Pasta"', searchResults);

  // 4. Create a New Recipe
  const newRecipe = {
    name: 'Demo API Recipe',
    instructions: '1. Heat oil in pan\n2. Add ingredients\n3. Cook for 10 minutes\n4. Serve hot',
    servings: 4,
    total_time: 25,
    ingredient_list: ['olive oil', 'garlic', 'onion', 'tomatoes', 'basil'],
    nutrition_per_serving: {
      calories: 180,
      protein: 8,
      carbs: 25,
      fat: 6
    },
    notes: 'Quick and easy weeknight meal',
    nutrition_source: 'ai_generated',
    is_favorite: true
  };
  
  const createResult = await createRecipe(newRecipe);
  logResponse('CREATE NEW RECIPE', createResult);
  
  let createdId = null;
  if (createResult.success) {
    createdId = createResult.data.id;
  }

  // 5. Update Recipe (if we created one)
  if (createdId) {
    const updateResult = await updateRecipeById(createdId, {
      servings: 6,
      notes: 'Updated: Great for family dinners',
      is_favorite: false
    });
    logResponse('UPDATE RECIPE (Partial Update)', updateResult);
  }

  // 6. Delete Recipe By Name
  if (createdId) {
    const deleteByNameResult = await deleteRecipeByName('Demo API Recipe');
    logResponse('DELETE RECIPE BY NAME', deleteByNameResult);
  }

  // 7. Error Response Examples
  const errorResponse = await getRecipeByName('Non-Existent Recipe XYZ');
  logResponse('ERROR RESPONSE: Recipe Not Found', errorResponse);

  const errorDeleteResponse = await deleteRecipeByName('Non-Existent Recipe ABC');
  logResponse('ERROR RESPONSE: Delete Recipe By Name Not Found', errorDeleteResponse);

  // No need to cleanup since we already deleted via name

  console.log('\n✨ Demo completed! These are the exact JSON responses your API returns.');
}

demo().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});