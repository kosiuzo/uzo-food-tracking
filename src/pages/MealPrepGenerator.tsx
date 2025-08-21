import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Clock, Users, Loader2, X, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
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

interface GeneratedRecipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
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
  };
  'Recipe 2': {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    instructions: string[];
    ingredients: string[];
  };
  'Recipe 3': {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    instructions: string[];
    ingredients: string[];
  };
}

const MealPrepGenerator = () => {
  const { allItems } = useFoodInventory();
  const { addRecipe } = useRecipes();
  const [selectedMeats, setSelectedMeats] = useState<FoodItem[]>([]);
  const [selectedSeasonings, setSelectedSeasonings] = useState<FoodItem[]>([]);
  const [selectedVegetables, setSelectedVegetables] = useState<FoodItem[]>([]);
  const [dietType, setDietType] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [meatRecipeOptions, setMeatRecipeOptions] = useState<MeatRecipeOptions[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showDebugPrompt, setShowDebugPrompt] = useState(false);

  // Filter items by category
  const meats = allItems.filter(item => 
    item.category.toLowerCase().includes('meat') || 
    item.category.toLowerCase().includes('protein') ||
    item.name.toLowerCase().includes('chicken') ||
    item.name.toLowerCase().includes('beef') ||
    item.name.toLowerCase().includes('pork') ||
    item.name.toLowerCase().includes('fish') ||
    item.name.toLowerCase().includes('turkey')
  );

  const seasoningsAndSauces = allItems.filter(item => 
    item.category.toLowerCase().includes('spice') ||
    item.category.toLowerCase().includes('seasoning') ||
    item.category.toLowerCase().includes('sauce') ||
    item.category.toLowerCase().includes('condiment') ||
    item.category.toLowerCase().includes('oil') ||
    item.category.toLowerCase().includes('vinegar')
  );

  const vegetables = allItems.filter(item => 
    item.category.toLowerCase().includes('vegetable') ||
    item.category.toLowerCase().includes('produce') ||
    item.category.toLowerCase().includes('fresh')
  );

  const handleMeatSelect = (meat: FoodItem) => {
    if (selectedMeats.length < 2 && !selectedMeats.find(m => m.id === meat.id)) {
      setSelectedMeats(prev => [...prev, meat]);
    }
  };

  const handleMeatRemove = (meatId: string) => {
    setSelectedMeats(prev => prev.filter(m => m.id !== meatId));
    setMeatRecipeOptions(prev => prev.filter(option => option.meat.id !== meatId));
  };

  const handleIngredientSelect = (item: FoodItem, type: 'seasoning' | 'vegetable') => {
    if (type === 'seasoning') {
      if (!selectedSeasonings.find(s => s.id === item.id)) {
        setSelectedSeasonings(prev => [...prev, item]);
      }
    } else {
      if (!selectedVegetables.find(v => v.id === item.id)) {
        setSelectedVegetables(prev => [...prev, item]);
      }
    }
  };

  const handleIngredientRemove = (itemId: string, type: 'seasoning' | 'vegetable') => {
    if (type === 'seasoning') {
      setSelectedSeasonings(prev => prev.filter(s => s.id !== itemId));
    } else {
      setSelectedVegetables(prev => prev.filter(v => v.id !== itemId));
    }
  };

  const generateThreeRecipes = async (meat: FoodItem): Promise<GeneratedRecipe[]> => {
    const allIngredients = [meat, ...selectedSeasonings, ...selectedVegetables];
    const ingredientNames = allIngredients.map(item => item.name);
    
    const systemPrompt = `Create 3 different ${dietType} recipes using the following ingredients: ${ingredientNames.join(', ')}.
Main protein: ${meat.name} (2 lbs).
Diet: ${dietType}.
Serves 4.

IMPORTANT: Return ONLY valid JSON, no extra text, no markdown, no code fences.
The JSON must be an object with 3 keys ("Recipe 1", "Recipe 2", "Recipe 3").
Each key should map to one recipe object in this exact schema:

{
  "Recipe 1": {
    "name": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "instructions": [
      "Step 1: instruction",
      "Step 2: instruction"
    ],
    "ingredients": [
      "2 lbs ${meat.name.toLowerCase()}",
      "1 tsp seasoning"
    ]
  },
  "Recipe 2": {
    "name": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "instructions": [
      "Step 1: instruction",
      "Step 2: instruction"
    ],
    "ingredients": [
      "2 lbs ${meat.name.toLowerCase()}",
      "1 tsp seasoning"
    ]
  },
  "Recipe 3": {
    "name": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "instructions": [
      "Step 1: instruction",
      "Step 2: instruction"
    ],
    "ingredients": [
      "2 lbs ${meat.name.toLowerCase()}",
      "1 tsp seasoning"
    ]
  }
}`;

    try {
      // Debug: Log the system prompt being sent
      console.log(`🤖 AI Prompt for ${meat.name} 3 recipes:`, systemPrompt);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUNTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "FoodTracker Meal Prep Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-oss-20b:free",
          "messages": [
            {
              "role": "user",
              "content": systemPrompt
            }
          ],
          "max_tokens": 2000,
          "temperature": 0.7
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
              ...selectedVegetables.slice(0, 3).map(v => `1 cup ${v.name}`),
              "2 tbsp cooking oil",
              "Salt and pepper to taste"
            ],
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
      console.warn(`AI generation failed for ${meat.name}, using fallback:`, error);
      
      // Fallback to 3 structured templates if AI fails
      const fallbackRecipeTemplates = [
        {
          name: `Grilled ${meat.name}`,
          description: `Smoky grilled ${meat.name.toLowerCase()} with bold flavors`,
          instructions: [
            "Preheat grill to medium-high heat",
            `Season ${meat.name.toLowerCase()} with your selected seasonings`,
            "Let marinate for 15 minutes",
            "Grill meat for 6-8 minutes per side until cooked through",
            "Grill vegetables alongside the meat",
            "Let rest for 5 minutes before serving"
          ]
        },
        {
          name: `Pan-Seared ${meat.name}`,
          description: `Golden-crusted ${meat.name.toLowerCase()} with aromatic seasonings`,
          instructions: [
            "Heat oil in a large skillet over medium-high heat",
            `Season ${meat.name.toLowerCase()} with your selected seasonings`,
            "Sear meat for 4-5 minutes per side until golden",
            "Add vegetables to the pan",
            "Cook until vegetables are tender and meat is cooked through",
            "Serve immediately"
          ]
        },
        {
          name: `Baked ${meat.name}`,
          description: `Tender oven-baked ${meat.name.toLowerCase()} with herbs`,
          instructions: [
            "Preheat oven to 375°F (190°C)",
            `Season ${meat.name.toLowerCase()} with your selected seasonings`,
            "Place in baking dish with vegetables",
            "Bake for 25-30 minutes until cooked through",
            "Rest for 5 minutes before serving"
          ]
        }
      ];
      
      return fallbackRecipeTemplates.map((template, index) => ({
        id: `${meat.id}-fallback-${index + 1}-${Date.now()}`,
        name: template.name,
        description: template.description,
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        instructions: template.instructions,
        ingredients: [
          `2 lbs ${meat.name.toLowerCase()}`,
          ...selectedSeasonings.slice(0, 3).map(s => `1 tsp ${s.name}`),
          ...selectedVegetables.slice(0, 3).map(v => `1 cup ${v.name}`),
          "2 tbsp cooking oil",
          "Salt and pepper to taste"
        ],
        nutrition: {
          calories: 350 + Math.floor(Math.random() * 100),
          protein: 35 + Math.floor(Math.random() * 15),
          carbs: 15 + Math.floor(Math.random() * 20),
          fat: 12 + Math.floor(Math.random() * 10),
          fiber: 3 + Math.floor(Math.random() * 5)
        }
      }));
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
      
      if (successfulOptions.length < 2) {
        throw new Error('Failed to generate enough recipe options');
      }
      
      setMeatRecipeOptions(successfulOptions);
      toast.success(`Generated ${successfulOptions.reduce((total, option) => total + option.recipes.length, 0)} unique recipes!`);
      
    } catch (error) {
      console.error('Recipe generation failed:', error);
      toast.error('Failed to generate recipes. Please try again or check your API configuration.');
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

    return {
      name: generatedRecipe.name,
      instructions: generatedRecipe.instructions.join('\n'),
      servings: generatedRecipe.servings,
      total_time_minutes: generatedRecipe.prepTime + generatedRecipe.cookTime,
      ingredients: recipeIngredients,
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
      setSelectedSeasonings([]);
      setSelectedVegetables([]);
      setDietType('');
      setInspiration('');
      setMeatRecipeOptions([]);
      setExpandedRecipes(new Set());
      
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
    
    return `Create 3 different ${dietType || 'paleo'} recipes using the following ingredients: ${ingredientNames.join(', ')}.
Main protein: ${meat.name} (2 lbs).
Diet: ${dietType || 'not specified'}.
Serves 4.

IMPORTANT: Return ONLY valid JSON, no extra text, no markdown, no code fences.
The JSON must be an object with 3 keys ("Recipe 1", "Recipe 2", "Recipe 3").
Each key should map to one recipe object in this exact schema:

{
  "Recipe 1": {
    "name": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "instructions": [
      "Step 1: instruction",
      "Step 2: instruction"
    ],
    "ingredients": [
      "2 lbs ${meat.name.toLowerCase()}",
      "1 tsp seasoning"
    ]
  },
  "Recipe 2": {
    "name": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "instructions": [
      "Step 1: instruction",
      "Step 2: instruction"
    ],
    "ingredients": [
      "2 lbs ${meat.name.toLowerCase()}",
      "1 tsp seasoning"
    ]
  },
  "Recipe 3": {
    "name": "Recipe Name",
    "description": "Brief description",
    "prepTime": 15,
    "cookTime": 25,
    "servings": 4,
    "instructions": [
      "Step 1: instruction",
      "Step 2: instruction"
    ],
    "ingredients": [
      "2 lbs ${meat.name.toLowerCase()}",
      "1 tsp seasoning"
    ]
  }
}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meal Prep Generator</h1>
          <p className="text-muted-foreground">
            Select 2 meats and your available ingredients to get 3 recipe options for each meat
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
              Choose your proteins and available ingredients for personalized meal prep recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meat Selection */}
            <div className="space-y-3">
              <Label>Select 2 Meats* ({selectedMeats.length}/2)</Label>
              
              {selectedMeats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMeats.map((meat) => (
                    <Badge 
                      key={meat.id} 
                      variant="default" 
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {meat.name}
                      <button
                        onClick={() => handleMeatRemove(meat.id)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {selectedMeats.length < 2 && (
                <Select onValueChange={(value) => {
                  const meat = meats.find(m => m.id === value);
                  if (meat) handleMeatSelect(meat);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your meats" />
                  </SelectTrigger>
                  <SelectContent>
                    {meats
                      .filter(meat => !selectedMeats.find(m => m.id === meat.id))
                      .map((meat) => (
                        <SelectItem key={meat.id} value={meat.id}>
                          {meat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Seasonings & Sauces */}
            <div className="space-y-3">
              <Label>Seasonings & Sauces*</Label>
              
              {selectedSeasonings.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSeasonings.map((seasoning) => (
                    <Badge 
                      key={seasoning.id} 
                      variant="secondary" 
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {seasoning.name}
                      <button
                        onClick={() => handleIngredientRemove(seasoning.id, 'seasoning')}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Select onValueChange={(value) => {
                const item = seasoningsAndSauces.find(s => s.id === value);
                if (item) handleIngredientSelect(item, 'seasoning');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Add seasonings and sauces" />
                </SelectTrigger>
                <SelectContent>
                  {seasoningsAndSauces
                    .filter(item => !selectedSeasonings.find(s => s.id === item.id))
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vegetables */}
            <div className="space-y-3">
              <Label>Vegetables (Optional)</Label>
              
              {selectedVegetables.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedVegetables.map((vegetable) => (
                    <Badge 
                      key={vegetable.id} 
                      variant="outline" 
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {vegetable.name}
                      <button
                        onClick={() => handleIngredientRemove(vegetable.id, 'vegetable')}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Select onValueChange={(value) => {
                const item = vegetables.find(v => v.id === value);
                if (item) handleIngredientSelect(item, 'vegetable');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Add vegetables" />
                </SelectTrigger>
                <SelectContent>
                  {vegetables
                    .filter(item => !selectedVegetables.find(v => v.id === item.id))
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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