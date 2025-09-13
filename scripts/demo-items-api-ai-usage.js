#!/usr/bin/env node

// Demo script showing how to use Items API for AI recipe generation
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Functions
async function getItemsByCategory(category, includeOutOfStock = true) {
  try {
    let query = supabase
      .from('items')
      .select('name, brand, in_stock, category')
      .eq('category', category.trim())
      .order('name');

    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return { data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

async function getItemsByCategories(categories, includeOutOfStock = true) {
  try {
    let query = supabase
      .from('items')
      .select('name, brand, in_stock, category')
      .in('category', categories)
      .order('category')
      .order('name');

    if (!includeOutOfStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return { data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('category')
      .not('category', 'is', null)
      .order('category');

    if (error) throw new Error(error.message);
    
    const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
    return { data: uniqueCategories, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
}

function formatItemsForAI(items, title) {
  console.log(`\n🤖 ${title}`);
  console.log('=' .repeat(60));
  
  if (items.length === 0) {
    console.log('No items found.');
    return;
  }

  // Group by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([category, categoryItems]) => {
    console.log(`\n📦 ${category} (${categoryItems.length} items):`);
    categoryItems.forEach(item => {
      const stockStatus = item.in_stock ? '✅' : '❌';
      const brand = item.brand ? ` (${item.brand})` : '';
      console.log(`   ${stockStatus} ${item.name}${brand}`);
    });
  });

  // Create AI-friendly summary
  const itemNames = items.filter(item => item.in_stock).map(item => item.name);
  console.log(`\n🎯 For AI: "${itemNames.join(', ')}"`);
  console.log(`💡 Prompt suggestion: "Generate a recipe using these ${title.toLowerCase()}: ${itemNames.slice(0, 10).join(', ')}${itemNames.length > 10 ? '...' : ''}"`);
}

async function demo() {
  console.log('🎯 Items API Demo - AI Recipe Generation Use Cases');
  console.log('📍 Connected to:', supabaseUrl);
  console.log('\nThis demo shows how to fetch inventory items by category for AI recipe generation.');

  // Use Case 1: Get all condiments and sauces
  console.log('\n' + '='.repeat(80));
  console.log('🥫 USE CASE 1: "Generate a recipe using my condiments and sauces"');
  console.log('='.repeat(80));

  const condimentsResult = await getItemsByCategory('Condiments & Sauces', false);
  if (condimentsResult.success) {
    formatItemsForAI(condimentsResult.data, 'Condiments & Sauces (In-Stock Only)');
  }

  // Use Case 2: Get all seasonings and spices
  console.log('\n' + '='.repeat(80));
  console.log('🌶️ USE CASE 2: "What can I make with my current seasonings?"');
  console.log('='.repeat(80));

  const seasoningsResult = await getItemsByCategory('Seasonings & Spices', false);
  if (seasoningsResult.success) {
    formatItemsForAI(seasoningsResult.data, 'Seasonings & Spices (In-Stock Only)');
  }

  // Use Case 3: Get multiple categories for comprehensive recipe
  console.log('\n' + '='.repeat(80));
  console.log('🍳 USE CASE 3: "Create a recipe using my proteins and vegetables"');
  console.log('='.repeat(80));

  const multiCategoryResult = await getItemsByCategories(['Proteins', 'Vegetables'], false);
  if (multiCategoryResult.success) {
    formatItemsForAI(multiCategoryResult.data, 'Proteins & Vegetables (In-Stock Only)');
  }

  // Use Case 4: Show all available categories for dynamic prompts
  console.log('\n' + '='.repeat(80));
  console.log('📋 USE CASE 4: Dynamic category selection for AI prompts');
  console.log('='.repeat(80));

  const categoriesResult = await getAllCategories();
  if (categoriesResult.success) {
    console.log('\n🗂️ Available Categories for AI Recipe Generation:');
    console.log('=' .repeat(60));
    categoriesResult.data.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });

    console.log('\n💡 Example prompts you can now generate:');
    console.log('   • "Generate a recipe using my ' + categoriesResult.data[0] + '"');
    console.log('   • "What can I make with my ' + categoriesResult.data[1] + '?"');
    console.log('   • "Create a meal using items from ' + categoriesResult.data[2] + ' and ' + categoriesResult.data[3] + '"');
  }

  // Use Case 5: Baking-specific ingredients
  console.log('\n' + '='.repeat(80));
  console.log('🧁 USE CASE 5: "Help me bake something with what I have"');
  console.log('='.repeat(80));

  const bakingResult = await getItemsByCategories(['Baking Supplies', 'Dairy & Eggs'], false);
  if (bakingResult.success) {
    formatItemsForAI(bakingResult.data, 'Baking Supplies & Dairy (In-Stock Only)');
  }

  console.log('\n' + '='.repeat(80));
  console.log('🎉 Demo Complete!');
  console.log('='.repeat(80));
  console.log('\n✨ Key Benefits for AI Recipe Generation:');
  console.log('   🎯 Category-specific ingredient lists');
  console.log('   📦 In-stock filtering to avoid suggesting unavailable items');
  console.log('   🤖 AI-friendly formatted output for prompts');
  console.log('   🔄 Dynamic category-based recipe suggestions');
  console.log('   💡 Natural language integration ("give me all condiments")');
  
  console.log('\n🔗 Integration Examples:');
  console.log('   • ChatGPT Custom GPT: "List my seasonings and spices"');
  console.log('   • Recipe Generator: Auto-populate available ingredients');
  console.log('   • Meal Planning: Suggest recipes based on current inventory');
  console.log('   • Smart Shopping: Generate recipes before grocery trips');
}

demo().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});