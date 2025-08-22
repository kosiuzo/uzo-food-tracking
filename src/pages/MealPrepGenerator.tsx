import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { GroupedMultiSelect, OptionGroup } from '@/components/ui/grouped-multi-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Clock, Users, Loader2, X, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { useFoodInventory } from '@/hooks/useFoodInventory';
import { useRecipes } from '@/hooks/useRecipes';
import { FoodItem, Recipe, RecipeIngredient } from '@/types';
import { calculateRecipeNutrition } from '@/lib/servingUnitUtils';

const dietTypes = [
  { value: 'paleo', label: 'Paleo' },
  { value: 'whole30', label: 'Whole30' },
  { value: 'standard', label: 'Original/Standard' },
  { value: 'keto', label: 'Keto' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

const cookingMethods = [
  { value: 'oven', label: 'Oven' },
  { value: 'air-fryer', label: 'Air Fryer' },
  { value: 'electric-grill', label: 'Char-Broil TRU-Infrared Electric Grill' },
  { value: 'stovetop', label: 'Stovetop Skillet' },
];

interface GeneratedRecipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  notes?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface MeatRecipeOptions {
  meat: FoodItem;
  recipes: GeneratedRecipe[];
  selectedRecipeId?: string;
}

interface ParsedRecipeResponse {
  'Recipe 1': {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    instructions: string[];
    ingredients: string[];
    notes?: string;
  };
  'Recipe 2': {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    instructions: string[];
    ingredients: string[];
    notes?: string;
  };
  'Recipe 3': {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    instructions: string[];
    ingredients: string[];
    notes?: string;
  };
}

const MealPrepGenerator = () => {
  const navigate = useNavigate();
  const { allItems } = useFoodInventory();
  const { addRecipe } = useRecipes();
  const { toast: toastHook } = useToast();
  const [selectedMeats, setSelectedMeats] = useState<FoodItem[]>([]);
  const [selectedMeatIds, setSelectedMeatIds] = useState<string[]>([]);
  const [selectedSeasonings, setSelectedSeasonings] = useState<FoodItem[]>([]);
  const [selectedSeasoningIds, setSelectedSeasoningIds] = useState<string[]>([]);
  const [selectedVegetables, setSelectedVegetables] = useState<FoodItem[]>([]);
  const [selectedVegetableIds, setSelectedVegetableIds] = useState<string[]>([]);
  const [selectedDairy, setSelectedDairy] = useState<FoodItem[]>([]);
  const [selectedDairyIds, setSelectedDairyIds] = useState<string[]>([]);
  const [selectedGrains, setSelectedGrains] = useState<FoodItem[]>([]);
  const [selectedGrainIds, setSelectedGrainIds] = useState<string[]>([]);
  const [dietType, setDietType] = useState('paleo');
  const [selectedCookingMethods, setSelectedCookingMethods] = useState<string[]>(['oven', 'air-fryer']);
  const [inspiration, setInspiration] = useState('');
  const [meatRecipeOptions, setMeatRecipeOptions] = useState<MeatRecipeOptions[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showDebugPrompt, setShowDebugPrompt] = useState(false);

  // Filter items by exact database categories (in-stock items only)
  const meats = allItems.filter(item => 
    item.in_stock && item.category === 'Proteins'
  );

  const seasoningsAndSauces = allItems.filter(item => 
    item.in_stock && (
      item.category === 'Seasonings & Spices' ||
      item.category === 'Condiments & Sauces' ||
      item.category === 'Oils & Fats'
    )
  );

  const vegetables = allItems.filter(item => 
    item.in_stock && (
      item.category.toLowerCase().includes('vegetable') ||
      item.category.toLowerCase().includes('produce') ||
      item.category.toLowerCase().includes('fresh')
    )
  );

  const dairy = allItems.filter(item => 
    item.in_stock && item.category === 'Dairy & Eggs'
  );

  const grains = allItems.filter(item => 
    item.in_stock && (
      item.category === 'Grains & Starches' ||
      item.category.toLowerCase().includes('grain') ||
      item.category.toLowerCase().includes('starch') ||
      item.category.toLowerCase().includes('rice') ||
      item.category.toLowerCase().includes('pasta') ||
      item.category.toLowerCase().includes('bread')
    )
  );

  // Convert to options for MultiSelect (only show product name, no brand)
  const meatOptions: Option[] = meats.map(item => ({
    label: item.name,
    value: item.id,
  }));

  // Group seasonings and sauces by category for GroupedMultiSelect
  const groupedSeasoningsAndSauces: OptionGroup = seasoningsAndSauces.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      label: item.name,
      value: item.id,
    });
    return acc;
  }, {} as OptionGroup);

  const vegetableOptions: Option[] = vegetables.map(item => ({
    label: item.name,
    value: item.id,
  }));

  const dairyOptions: Option[] = dairy.map(item => ({
    label: item.name,
    value: item.id,
  }));

  const grainOptions: Option[] = grains.map(item => ({
    label: item.name,
    value: item.id,
  }));

  // Handle selection changes from MultiSelect
  const handleMeatSelectionChange = (selectedIds: string[]) => {
    // Limit to 2 meats
    const limitedIds = selectedIds.slice(0, 2);
    setSelectedMeatIds(limitedIds);
    
    const newSelectedMeats = limitedIds.map(id => meats.find(m => m.id === id)!).filter(Boolean);
    setSelectedMeats(newSelectedMeats);
    
    // Remove recipe options for deselected meats
    setMeatRecipeOptions(prev => prev.filter(option => limitedIds.includes(option.meat.id)));
  };

  const handleSeasoningSelectionChange = (selectedIds: string[]) => {
    setSelectedSeasoningIds(selectedIds);
    const newSelectedSeasonings = selectedIds.map(id => seasoningsAndSauces.find(s => s.id === id)!).filter(Boolean);
    setSelectedSeasonings(newSelectedSeasonings);
  };

  const handleVegetableSelectionChange = (selectedIds: string[]) => {
    setSelectedVegetableIds(selectedIds);
    const newSelectedVegetables = selectedIds.map(id => vegetables.find(v => v.id === id)!).filter(Boolean);
    setSelectedVegetables(newSelectedVegetables);
  };

  const handleDairySelectionChange = (selectedIds: string[]) => {
    setSelectedDairyIds(selectedIds);
    const newSelectedDairy = selectedIds.map(id => dairy.find(d => d.id === id)!).filter(Boolean);
    setSelectedDairy(newSelectedDairy);
  };

  const handleGrainSelectionChange = (selectedIds: string[]) => {
    setSelectedGrainIds(selectedIds);
    const newSelectedGrains = selectedIds.map(id => grains.find(g => g.id === id)!).filter(Boolean);
    setSelectedGrains(newSelectedGrains);
  };

  const handleCookingMethodsChange = (selectedMethods: string[]) => {
    setSelectedCookingMethods(selectedMethods);
  };

  const generateThreeRecipes = async (meat: FoodItem): Promise<GeneratedRecipe[]> => {
    const allIngredients = [meat, ...selectedSeasonings, ...selectedVegetables, ...selectedDairy, ...selectedGrains];
    const ingredientNames = allIngredients.map(item => item.name);
    
    // Create user prompt with specific ingredients and batch cooking considerations
    const cookingMethodsText = selectedCookingMethods.map(method => 
      cookingMethods.find(cm => cm.value === method)?.label || method
    ).join(', ');
    
    const userPrompt = `Create 3 different ${dietType} MEAL PREP recipes using these ingredients:
${ingredientNames.map(name => `- ${name}`).join('\n')}

Main protein: ${meat.name} (2 lbs)
Diet preference: ${dietType}
Cooking methods available: ${cookingMethodsText}
Target: serves 4 (designed for meal prep - food will be cooked in batch for multiple days)
${inspiration ? `Additional notes: ${inspiration}` : ''}

IMPORTANT: These recipes are for MEAL PREP, so:
- Consider how ingredients will hold up as leftovers over 3-4 days
- Optimize cooking methods for batch preparation
- Include storage and reheating tips in the notes field
- Focus on flavors and textures that improve or maintain well when reheated

Return a single JSON object with exactly 3 recipes.`;

    try {
      // Debug: Log the user prompt being sent
      console.log(`🤖 AI User Prompt for ${meat.name} 3 recipes:`, userPrompt);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "FoodTracker Meal Prep Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "microsoft/mai-ds-r1:free",
          "temperature": 0.2,
          "top_p": 0.9,
          "max_tokens": 10000,
          "response_format": { "type": "json_object" },
          "messages": [
            {
              "role": "system",
              "content": `You are a meal prep recipe generator that returns VALID JSON only.
Schema:
{
  "Recipe 1": {
    "name": "string",
    "description": "string",
    "prepTime": "integer",
    "cookTime": "integer",
    "servings": 4,
    "instructions": ["step1", "step2"],
    "ingredients": ["ingredient1", "ingredient2"],
    "notes": "string with storage and reheating tips"
  },
  "Recipe 2": { /* same structure */ },
  "Recipe 3": { /* same structure */ }
}
Rules:
- Output JSON only. No prose, no markdown.
- Use exact ingredient names provided.
- Each recipe should be different in cooking method or flavor profile.
- Instructions as array of clear steps for BATCH COOKING.
- Include cooking times and prep times.
- REQUIRED: Include detailed notes with storage tips (refrigerator life) and reheating instructions.
- Consider meal prep: how ingredients hold up as leftovers, best reheating methods, texture preservation.
- Optimize for the available cooking methods provided by user.`
            },
            {
              "role": "user",
              "content": userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content;
      
      // Debug: Log the AI response
      console.log(`🤖 AI Response for ${meat.name} 3 recipes:`, generatedText);
      
      let parsedRecipes: ParsedRecipeResponse;
      try {
        // Try multiple JSON extraction methods
        let jsonText = '';
        
        // Method 1: Look for complete JSON block
        const completeJsonMatch = generatedText.match(/\{[\s\S]*?\}(?=\s*$)/);
        if (completeJsonMatch) {
          jsonText = completeJsonMatch[0];
        } else {
          // Method 2: Look for any JSON block and try to complete it
          const partialJsonMatch = generatedText.match(/\{[\s\S]*$/);
          if (partialJsonMatch) {
            jsonText = partialJsonMatch[0];
            // If it's incomplete, try to close it
            if (!jsonText.endsWith('}')) {
              const openBraces = (jsonText.match(/\{/g) || []).length;
              const closeBraces = (jsonText.match(/\}/g) || []).length;
              const missingBraces = openBraces - closeBraces;
              jsonText += '}'.repeat(missingBraces);
            }
          } else {
            throw new Error('No JSON structure found in response');
          }
        }
        
        parsedRecipes = JSON.parse(jsonText);
        console.log(`✅ Parsed recipes for ${meat.name}:`, parsedRecipes);
        
        // Validate that we have the expected structure
        if (!parsedRecipes['Recipe 1'] || !parsedRecipes['Recipe 2'] || !parsedRecipes['Recipe 3']) {
          throw new Error('Missing required recipe keys (Recipe 1, Recipe 2, Recipe 3)');
        }
        
      } catch (parseError) {
        console.error(`❌ Failed to parse AI response for ${meat.name}:`, parseError);
        console.error('Raw response:', generatedText);
        throw new Error('Failed to parse AI response');
      }

      // Convert the parsed recipes object to an array of GeneratedRecipe objects
      const recipes: GeneratedRecipe[] = [];
      
      // Calculate nutrition using actual ingredient mapping
      const recipeIngredients: RecipeIngredient[] = [];
      
      // Add the main meat
      recipeIngredients.push({
        item_id: meat.id,
        quantity: 2,
        unit: 'lbs'
      });
      
      // Add selected seasonings
      selectedSeasonings.slice(0, 3).forEach(seasoning => {
        recipeIngredients.push({
          item_id: seasoning.id,
          quantity: 1,
          unit: 'tsp'
        });
      });
      
      // Add selected vegetables
      selectedVegetables.slice(0, 3).forEach(vegetable => {
        recipeIngredients.push({
          item_id: vegetable.id,
          quantity: 1,
          unit: 'cup'
        });
      });
      
      // Add selected dairy
      selectedDairy.slice(0, 2).forEach(dairyItem => {
        recipeIngredients.push({
          item_id: dairyItem.id,
          quantity: 0.5,
          unit: 'cup'
        });
      });
      
      // Add selected grains
      selectedGrains.slice(0, 2).forEach(grainItem => {
        recipeIngredients.push({
          item_id: grainItem.id,
          quantity: 1,
          unit: 'cup'
        });
      });

      const nutrition = calculateRecipeNutrition(recipeIngredients, 4, allItems);

      // Process each recipe
      ['Recipe 1', 'Recipe 2', 'Recipe 3'].forEach((recipeKey, index) => {
        const parsedRecipe = parsedRecipes[recipeKey];
        if (parsedRecipe) {
          recipes.push({
            id: `${meat.id}-recipe-${index + 1}-${Date.now()}`,
            name: parsedRecipe.name || `${meat.name} Recipe ${index + 1}`,
            description: parsedRecipe.description || `Delicious ${meat.name.toLowerCase()} recipe`,
            prepTime: parsedRecipe.prepTime || 20,
            cookTime: parsedRecipe.cookTime || 25,
            servings: 4,
            instructions: Array.isArray(parsedRecipe.instructions) 
              ? parsedRecipe.instructions 
              : (parsedRecipe.instructions || '').split('\n').filter(Boolean),
            ingredients: parsedRecipe.ingredients || [
              `2 lbs ${meat.name.toLowerCase()}`,
              ...selectedSeasonings.slice(0, 3).map(s => `1 tsp ${s.name}`),
              ...selectedGrains.slice(0, 2).map(g => `1 cup ${g.name}`),
              ...selectedVegetables.slice(0, 3).map(v => `1 cup ${v.name}`),
              ...selectedDairy.slice(0, 2).map(d => `1/2 cup ${d.name}`),
              "2 tbsp cooking oil",
              "Salt and pepper to taste"
            ],
            notes: parsedRecipe.notes || `Storage: Refrigerate for up to 4 days. Reheat gently in microwave or oven at 350°F until heated through.`,
            nutrition: {
              calories: Math.round(nutrition.calories_per_serving),
              protein: Math.round(nutrition.protein_per_serving),
              carbs: Math.round(nutrition.carbs_per_serving),
              fat: Math.round(nutrition.fat_per_serving),
              fiber: 2 // Default fiber value since calculateRecipeNutrition doesn't calculate it
            }
          });
        }
      });

      return recipes;

    } catch (error) {
      console.warn(`AI generation failed for ${meat.name}:`, error);
      
      // Notify user about the API failure
      toastHook({
        title: 'AI Generation Failed',
        description: `Failed to generate AI recipes for ${meat.name}. Please try again or check your API configuration.`,
        variant: 'destructive',
      });
      
      // Don't return fallback recipes - let the calling function handle the empty result
      throw error;
    }
  };

  const generateRecipesForMeat = async (meat: FoodItem): Promise<GeneratedRecipe[]> => {
    try {
      return await generateThreeRecipes(meat);
    } catch (error) {
      console.error(`Failed to generate recipes for ${meat.name}:`, error);
      return [];
    }
  };

  const handleGenerate = async () => {
    if (selectedMeats.length !== 2) {
      toast.error('Please select exactly 2 meats');
      return;
    }
    
    if (!dietType) {
      toast.error('Please select a diet type');
      return;
    }

    if (selectedSeasonings.length === 0) {
      toast.error('Please select some seasonings or sauces');
      return;
    }

    setIsGenerating(true);
    
    try {
      toast.info('Generating personalized recipes with AI...', { duration: 2000 });
      
      // Generate recipes for both meats concurrently
      const recipeGenerationPromises = selectedMeats.map(async (meat) => {
        const recipes = await generateRecipesForMeat(meat);
        return { meat, recipes };
      });
      
      const newMeatRecipeOptions = await Promise.all(recipeGenerationPromises);
      
      // Filter out any failed generations
      const successfulOptions = newMeatRecipeOptions.filter(option => option.recipes.length > 0);
      
      if (successfulOptions.length === 0) {
        throw new Error('Failed to generate any recipes. Please check your API configuration and try again.');
      }
      
      if (successfulOptions.length < 2) {
        // Show partial success with warning
        setMeatRecipeOptions(successfulOptions);
        toastHook({
          title: 'Partial Generation Success',
          description: `Generated recipes for ${successfulOptions.length} out of ${selectedMeats.length} meats. Some failed due to API issues.`,
          variant: 'destructive',
        });
      } else {
        // Full success
        setMeatRecipeOptions(successfulOptions);
        toast.success(`Generated ${successfulOptions.reduce((total, option) => total + option.recipes.length, 0)} unique recipes!`);
      }
      
    } catch (error) {
      console.error('Recipe generation failed:', error);
      
      // More specific error handling
      if (error instanceof Error && error.message.includes('API request failed')) {
        toastHook({
          title: 'API Connection Failed',
          description: 'Unable to connect to AI service. Please check your internet connection and API configuration.',
          variant: 'destructive',
        });
      } else {
        toastHook({
          title: 'Recipe Generation Failed',
          description: 'Failed to generate recipes. Please try again with different ingredients.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecipeSelect = (meatId: string, recipeId: string) => {
    setMeatRecipeOptions(prev => 
      prev.map(option => 
        option.meat.id === meatId 
          ? { ...option, selectedRecipeId: recipeId }
          : option
      )
    );
  };

  const toggleRecipeExpansion = (recipeId: string) => {
    setExpandedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const convertToRecipeFormat = (generatedRecipe: GeneratedRecipe): Omit<Recipe, 'id' | 'is_favorite'> => {
    // Create recipe ingredients by mapping to actual items in inventory
    const recipeIngredients: RecipeIngredient[] = [];
    
    // Add the main meat
    const meatOption = meatRecipeOptions.find(option => 
      option.recipes.some(r => r.id === generatedRecipe.id)
    );
    if (meatOption) {
      recipeIngredients.push({
        item_id: meatOption.meat.id,
        quantity: 2,
        unit: 'lbs'
      });
    }
    
    // Add selected seasonings
    selectedSeasonings.slice(0, 3).forEach(seasoning => {
      recipeIngredients.push({
        item_id: seasoning.id,
        quantity: 1,
        unit: 'tsp'
      });
    });
    
    // Add selected vegetables
    selectedVegetables.slice(0, 3).forEach(vegetable => {
      recipeIngredients.push({
        item_id: vegetable.id,
        quantity: 1,
        unit: 'cup'
      });
    });
    
    // Add selected grains
    selectedGrains.slice(0, 2).forEach(grainItem => {
      recipeIngredients.push({
        item_id: grainItem.id,
        quantity: 1,
        unit: 'cup'
      });
    });
    
    // Add selected dairy
    selectedDairy.slice(0, 2).forEach(dairyItem => {
      recipeIngredients.push({
        item_id: dairyItem.id,
        quantity: 0.5,
        unit: 'cup'
      });
    });

    return {
      name: generatedRecipe.name,
      instructions: generatedRecipe.instructions.join('\n'),
      servings: generatedRecipe.servings,
      total_time_minutes: generatedRecipe.prepTime + generatedRecipe.cookTime,
      ingredients: recipeIngredients,
      notes: generatedRecipe.notes,
      nutrition: {
        calories_per_serving: generatedRecipe.nutrition.calories,
        protein_per_serving: generatedRecipe.nutrition.protein,
        carbs_per_serving: generatedRecipe.nutrition.carbs,
        fat_per_serving: generatedRecipe.nutrition.fat
      }
    };
  };

  const handleSaveSelectedRecipes = async () => {
    const selectedRecipes = meatRecipeOptions
      .filter(option => option.selectedRecipeId)
      .map(option => option.recipes.find(r => r.id === option.selectedRecipeId))
      .filter(recipe => recipe !== undefined) as GeneratedRecipe[];
    
    if (selectedRecipes.length < 2) {
      toast.error('Please select one recipe from each meat');
      return;
    }

    setIsSaving(true);
    
    try {
      // Save each selected recipe to Supabase
      for (const generatedRecipe of selectedRecipes) {
        const recipeData = convertToRecipeFormat(generatedRecipe);
        await addRecipe(recipeData);
      }
      
      toast.success(`Successfully saved ${selectedRecipes.length} recipes to your collection!`);
      
      // Reset the form
      setSelectedMeats([]);
      setSelectedMeatIds([]);
      setSelectedSeasonings([]);
      setSelectedSeasoningIds([]);
      setSelectedVegetables([]);
      setSelectedVegetableIds([]);
      setSelectedDairy([]);
      setSelectedDairyIds([]);
      setSelectedGrains([]);
      setSelectedGrainIds([]);
      setDietType('paleo');
      setSelectedCookingMethods(['oven', 'air-fryer']);
      setInspiration('');
      setMeatRecipeOptions([]);
      setExpandedRecipes(new Set());
      
      // Navigate back to recipes page
      navigate('/recipes');
      
    } catch (error) {
      console.error('Error saving recipes:', error);
      toast.error('Failed to save recipes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canSaveRecipes = meatRecipeOptions.length === 2 && 
    meatRecipeOptions.every(option => option.selectedRecipeId);

  const generateSamplePrompt = () => {
    if (selectedMeats.length === 0) {
      return "Please select meats and seasonings first to see a sample prompt.";
    }
    
    const meat = selectedMeats[0];
    const allIngredients = [meat, ...selectedSeasonings, ...selectedVegetables];
    const ingredientNames = allIngredients.map(item => item.name);
    
    return `SYSTEM PROMPT:
You are a meal prep recipe generator that returns VALID JSON only.
Schema:
{
  "Recipe 1": {
    "name": "string",
    "description": "string",
    "prepTime": "integer",
    "cookTime": "integer", 
    "servings": 4,
    "instructions": ["step1", "step2"],
    "ingredients": ["ingredient1", "ingredient2"]
  },
  "Recipe 2": { /* same structure */ },
  "Recipe 3": { /* same structure */ }
}
Rules:
- Output JSON only. No prose, no markdown.
- Use exact ingredient names provided.
- Each recipe should be different in cooking method or flavor profile.
- Instructions as array of clear steps.
- Include cooking times and prep times.

USER PROMPT:
Create 3 different ${dietType || 'paleo'} recipes using these ingredients:
${ingredientNames.map(name => `- ${name}`).join('\n')}

Main protein: ${meat.name} (2 lbs)
Diet preference: ${dietType || 'not specified'}
Target: serves 4
${inspiration ? `Additional notes: ${inspiration}` : ''}

Return a single JSON object with exactly 3 recipes.`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meal Prep Generator</h1>
          <p className="text-muted-foreground">
            Select 2 meats, cooking methods, and ingredients to get 3 batch-friendly recipe options with storage & reheating tips
          </p>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Meal Prep Setup
            </CardTitle>
            <CardDescription>
              Choose your proteins and available in-stock ingredients for personalized meal prep recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meat Selection */}
            <div className="space-y-3">
              <Label>Select 2 Meats* ({selectedMeats.length}/2) - in-stock only</Label>
              <MultiSelect
                options={meatOptions}
                onValueChange={handleMeatSelectionChange}
                defaultValue={selectedMeatIds}
                placeholder="Search and select up to 2 in-stock meats..."
                maxCount={2}
              />
            </div>

            {/* Seasonings & Sauces */}
            <div className="space-y-3">
              <Label>Seasonings & Sauces* (in-stock only)</Label>
              <GroupedMultiSelect
                optionGroups={groupedSeasoningsAndSauces}
                onValueChange={handleSeasoningSelectionChange}
                defaultValue={selectedSeasoningIds}
                placeholder="Search and select in-stock seasonings and sauces..."
                maxCount={3}
              />
            </div>

            {/* Grains & Starches */}
            <div className="space-y-3">
              <Label>Grains & Starches (Optional) - in-stock only</Label>
              <MultiSelect
                options={grainOptions}
                onValueChange={handleGrainSelectionChange}
                defaultValue={selectedGrainIds}
                placeholder="Search and select in-stock grains and starches..."
                maxCount={3}
              />
            </div>

            {/* Vegetables */}
            <div className="space-y-3">
              <Label>Vegetables (Optional) - in-stock only</Label>
              <MultiSelect
                options={vegetableOptions}
                onValueChange={handleVegetableSelectionChange}
                defaultValue={selectedVegetableIds}
                placeholder="Search and select in-stock vegetables..."
                maxCount={4}
              />
            </div>

            {/* Dairy & Eggs */}
            <div className="space-y-3">
              <Label>Dairy & Eggs (Optional) - in-stock only</Label>
              <MultiSelect
                options={dairyOptions}
                onValueChange={handleDairySelectionChange}
                defaultValue={selectedDairyIds}
                placeholder="Search and select in-stock dairy products and eggs..."
                maxCount={3}
              />
            </div>

            {/* Kitchen Tools Selection */}
            <div className="space-y-3">
              <Label>Preferred Cooking Methods* ({selectedCookingMethods.length} selected)</Label>
              <MultiSelect
                options={cookingMethods.map(method => ({ label: method.label, value: method.value }))}
                onValueChange={handleCookingMethodsChange}
                defaultValue={selectedCookingMethods}
                placeholder="Select your available cooking methods..."
                maxCount={4}
              />
              <p className="text-sm text-muted-foreground">
                Choose the cooking equipment you want to use for batch meal prep
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diet-type">Diet Type*</Label>
                <Select value={dietType} onValueChange={setDietType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietTypes.map((diet) => (
                      <SelectItem key={diet.value} value={diet.value}>
                        {diet.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspiration">Additional Notes (Optional)</Label>
                <Textarea
                  id="inspiration"
                  placeholder="Any cooking preferences, flavors, or styles..."
                  value={inspiration}
                  onChange={(e) => setInspiration(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    AI Generating 6 Recipe Options...
                  </>
                ) : (
                  <>
                    <ChefHat className="h-4 w-4 mr-2" />
                    Generate AI Recipe Options
                  </>
                )}
              </Button>
              
              {/* Debug Section */}
              <div className="border-t pt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDebugPrompt(!showDebugPrompt)}
                  className="w-full text-xs"
                >
                  {showDebugPrompt ? 'Hide' : 'Show'} Sample AI Prompt
                </Button>
                
                {showDebugPrompt && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <Label className="text-xs font-semibold mb-2 block">Sample AI Prompt (3 Recipes):</Label>
                    <pre className="text-xs bg-background p-3 rounded border overflow-auto max-h-64 whitespace-pre-wrap">
                      {generateSamplePrompt()}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Recipe Options */}
        {meatRecipeOptions.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Your Recipe Options</h2>
              {canSaveRecipes && (
                <Button 
                  onClick={handleSaveSelectedRecipes} 
                  disabled={isSaving}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Save Selected Recipes
                    </>
                  )}
                </Button>
              )}
            </div>

            {meatRecipeOptions.map((meatOption) => (
              <div key={meatOption.meat.id} className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">
                  {meatOption.meat.name} Recipes
                </h3>
                
                <div className="space-y-4">
                  {meatOption.recipes.map((recipe) => (
                    <Card 
                      key={recipe.id}
                      className={`transition-all ${
                        meatOption.selectedRecipeId === recipe.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{recipe.name}</CardTitle>
                            <CardDescription className="text-sm mt-1">
                              {recipe.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {meatOption.selectedRecipeId === recipe.id && (
                              <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRecipeExpansion(recipe.id)}
                              className="flex-shrink-0"
                            >
                              {expandedRecipes.has(recipe.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {recipe.prepTime + recipe.cookTime} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {recipe.servings} servings
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Nutrition Summary */}
                        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">{recipe.nutrition.calories}</div>
                            <div className="text-xs text-muted-foreground">Calories</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Protein</span>
                              <span>{recipe.nutrition.protein}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Carbs</span>
                              <span>{recipe.nutrition.carbs}g</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fat</span>
                              <span>{recipe.nutrition.fat}g</span>
                            </div>
                          </div>
                        </div>

                        {expandedRecipes.has(recipe.id) && (
                          <>
                            <Separator />
                            
                            {/* Ingredients */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Ingredients ({recipe.ingredients.length})
                              </h4>
                              <div className="space-y-2">
                                {recipe.ingredients.map((ingredient, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm bg-gray-50 rounded-lg p-3 border">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                      {idx + 1}
                                    </div>
                                    <span className="text-gray-700">{ingredient}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Instructions */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Instructions
                              </h4>
                              <div className="space-y-3">
                                {recipe.instructions.map((step, idx) => (
                                  <div key={idx} className="flex gap-3 text-sm bg-green-50 rounded-lg p-3 border border-green-100">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {idx + 1}
                                    </div>
                                    <div className="text-gray-700 leading-relaxed">{step}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Storage & Reheating Notes */}
                            {recipe.notes && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    Meal Prep Notes
                                  </h4>
                                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                                    <p className="text-sm text-gray-700 leading-relaxed">{recipe.notes}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* Select Button */}
                        <Button
                          onClick={() => handleRecipeSelect(meatOption.meat.id, recipe.id)}
                          variant={meatOption.selectedRecipeId === recipe.id ? "default" : "outline"}
                          className="w-full"
                        >
                          {meatOption.selectedRecipeId === recipe.id ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            'Select This Recipe'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {!canSaveRecipes && meatRecipeOptions.length === 2 && (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  Select one recipe from each meat to save them to your recipe collection
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MealPrepGenerator;