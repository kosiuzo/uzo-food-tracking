#!/usr/bin/env node

// Integration test script for items API using local Supabase
// This bypasses the Vitest mocking to test against real local database

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Functions (copied from our service)
async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('category')
      .not('category', 'is', null)
      .order('category');

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    // Extract unique categories
    const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);

    return {
      data: uniqueCategories,
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

async function getItemsByCategory(category, includeOutOfStock = true) {
  try {
    if (!category || category.trim().length === 0) {
      return {
        data: null,
        error: 'Category is required',
        success: false,
      };
    }

    let query = supabase
      .from('items')
      .select('*')
      .eq('category', category.trim())
      .order('name');

    // Filter by stock status if requested
    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;

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

async function searchItemsByCategory(searchTerm, includeOutOfStock = true) {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        data: null,
        error: 'Search term is required',
        success: false,
      };
    }

    let query = supabase
      .from('items')
      .select('*')
      .ilike('category', `%${searchTerm.trim()}%`)
      .order('category')
      .order('name');

    // Filter by stock status if requested
    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;

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

async function getItemsByCategories(categories, includeOutOfStock = true) {
  try {
    if (!categories || categories.length === 0) {
      return {
        data: null,
        error: 'At least one category is required',
        success: false,
      };
    }

    // Filter out empty categories and trim whitespace
    const cleanCategories = categories
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0);

    if (cleanCategories.length === 0) {
      return {
        data: null,
        error: 'At least one valid category is required',
        success: false,
      };
    }

    let query = supabase
      .from('items')
      .select('*')
      .in('category', cleanCategories)
      .order('category')
      .order('name');

    // Filter by stock status if requested
    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;

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

async function getCategorySummary(includeOutOfStock = true) {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('category, in_stock')
      .not('category', 'is', null);

    if (error) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    // Process data to create summary
    const categoryMap = new Map();
    
    data.forEach(item => {
      const category = item.category;
      const current = categoryMap.get(category) || {total: 0, inStock: 0};
      current.total += 1;
      if (item.in_stock) {
        current.inStock += 1;
      }
      categoryMap.set(category, current);
    });

    // Convert to array format
    const summary = Array.from(categoryMap.entries())
      .map(([category, counts]) => ({
        category,
        item_count: counts.total,
        in_stock_count: counts.inStock
      }))
      .filter(item => includeOutOfStock || item.in_stock_count > 0)
      .sort((a, b) => a.category.localeCompare(b.category));

    return {
      data: summary,
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

// Test runner
async function runTests() {
  console.log('🧪 Starting Items API Integration Tests');
  console.log('📍 Testing against Local Supabase:', supabaseUrl);
  console.log();

  let passed = 0;
  let failed = 0;

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

  // Test 1: Get All Categories
  await test('Should get all categories', async () => {
    const result = await getAllCategories();
    assert(result.success, `Get categories failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Categories data is not an array');
    assert(result.data.length > 0, 'No categories found');
    assert(result.data.includes('Condiments & Sauces'), 'Expected category not found');
    assert(result.data.includes('Seasonings & Spices'), 'Expected category not found');
    console.log(`   Found ${result.data.length} categories: ${result.data.slice(0, 3).join(', ')}${result.data.length > 3 ? '...' : ''}`);
  });

  // Test 2: Get Items by Specific Category
  await test('Should get items by category (Condiments & Sauces)', async () => {
    const result = await getItemsByCategory('Condiments & Sauces');
    assert(result.success, `Get items by category failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Items data is not an array');
    assert(result.data.length > 0, 'No condiments & sauces found');
    
    // Verify all items are in the correct category
    result.data.forEach(item => {
      assert(item.category === 'Condiments & Sauces', `Item ${item.name} has wrong category: ${item.category}`);
    });
    
    console.log(`   Found ${result.data.length} condiments & sauces`);
    console.log(`   Sample items: ${result.data.slice(0, 3).map(item => item.name).join(', ')}`);
  });

  // Test 3: Get Items by Category (In-Stock Only)
  await test('Should get in-stock items only', async () => {
    const allResult = await getItemsByCategory('Seasonings & Spices', true);
    const inStockResult = await getItemsByCategory('Seasonings & Spices', false);
    
    assert(allResult.success, `Get all items failed: ${allResult.error}`);
    assert(inStockResult.success, `Get in-stock items failed: ${inStockResult.error}`);
    assert(inStockResult.data.length <= allResult.data.length, 'In-stock count should be <= total count');
    
    // Verify all returned items are in stock
    inStockResult.data.forEach(item => {
      assert(item.in_stock === true, `Item ${item.name} is not in stock`);
    });
    
    console.log(`   Total seasonings & spices: ${allResult.data.length}, In-stock: ${inStockResult.data.length}`);
  });

  // Test 4: Search Items by Category (Partial Match)
  await test('Should search items by category pattern', async () => {
    const result = await searchItemsByCategory('Spices');
    assert(result.success, `Search by category failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Search data is not an array');
    
    // Verify all items have category containing "Spices"
    result.data.forEach(item => {
      assert(item.category.includes('Spices'), `Item ${item.name} category "${item.category}" doesn't contain "Spices"`);
    });
    
    console.log(`   Found ${result.data.length} items with "Spices" in category`);
  });

  // Test 5: Get Items by Multiple Categories
  await test('Should get items from multiple categories', async () => {
    const result = await getItemsByCategories(['Oils & Fats', 'Condiments & Sauces']);
    assert(result.success, `Get items by multiple categories failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Items data is not an array');
    assert(result.data.length > 0, 'No items found for multiple categories');
    
    // Verify all items are in one of the requested categories
    const allowedCategories = ['Oils & Fats', 'Condiments & Sauces'];
    result.data.forEach(item => {
      assert(allowedCategories.includes(item.category), `Item ${item.name} has unexpected category: ${item.category}`);
    });
    
    console.log(`   Found ${result.data.length} items from oils and condiments`);
  });

  // Test 6: Get Category Summary
  await test('Should get category summary with counts', async () => {
    const result = await getCategorySummary();
    assert(result.success, `Get category summary failed: ${result.error}`);
    assert(Array.isArray(result.data), 'Summary data is not an array');
    assert(result.data.length > 0, 'No category summary found');
    
    // Verify summary structure
    result.data.forEach(summary => {
      assert(typeof summary.category === 'string', 'Category should be string');
      assert(typeof summary.item_count === 'number', 'Item count should be number');
      assert(typeof summary.in_stock_count === 'number', 'In-stock count should be number');
      assert(summary.in_stock_count <= summary.item_count, 'In-stock count should be <= total count');
    });
    
    console.log(`   Found summaries for ${result.data.length} categories`);
    const topCategories = result.data.sort((a, b) => b.item_count - a.item_count).slice(0, 3);
    topCategories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.item_count} total, ${cat.in_stock_count} in stock`);
    });
  });

  // Test 7: Handle Invalid Category
  await test('Should handle invalid category gracefully', async () => {
    const result = await getItemsByCategory('Non-Existent Category XYZ');
    assert(result.success, `Should succeed even with no results: ${result.error}`);
    assert(Array.isArray(result.data), 'Should return empty array');
    assert(result.data.length === 0, 'Should return no items for non-existent category');
    console.log(`   Correctly returned empty array for non-existent category`);
  });

  // Test 8: Handle Empty Category Input
  await test('Should handle empty category input', async () => {
    const result = await getItemsByCategory('');
    assert(!result.success, 'Should fail with empty category');
    assert(result.error === 'Category is required', `Wrong error message: ${result.error}`);
    console.log(`   Correctly handled empty category: ${result.error}`);
  });

  // Results
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log(`   🔢 Total Tests: ${passed + failed}`);
  
  if (failed === 0) {
    console.log();
    console.log('🎉 All tests passed! Your Items API is working correctly with local Supabase.');
    console.log('🤖 Ready for AI recipe generation based on inventory categories!');
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