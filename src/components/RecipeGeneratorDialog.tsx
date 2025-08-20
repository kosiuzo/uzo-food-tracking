import { useState } from 'react';
import { Bot, Plus, X, Loader2, Search } from 'lucide-react';
import { HfInference } from '@huggingface/inference';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Recipe, FoodItem, RecipeIngredient } from '../types';
import { useFoodInventory } from '../hooks/useFoodInventory';
import { RecipePreviewDialog } from './RecipePreviewDialog';
import { calculateRecipeNutrition } from '../lib/servingUnitUtils';

interface RecipeGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeGenerated: (recipe: Omit<Recipe, 'id' | 'is_favorite'>) => void;
}

const CUISINE_STYLES = [
  'Italian',
  'Chinese',
  'Mexican',
  'Indian',
  'Japanese',
  'French',
  'Thai',
  'Mediterranean',
  'American',
  'Korean',
  'Vietnamese',
  'Greek',
  'Spanish',
  'Middle Eastern',
  'Fusion'
];

const DIETARY_RESTRICTIONS = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'low-sodium', label: 'Low-Sodium' },
  { value: 'diabetic-friendly', label: 'Diabetic-Friendly' }
];

export function RecipeGeneratorDialog({ open, onOpenChange, onRecipeGenerated }: RecipeGeneratorDialogProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<FoodItem[]>([]);
  const [servings, setServings] = useState(4);
  const [cuisineStyle, setCuisineStyle] = useState('none');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredientSelectorOpen, setIngredientSelectorOpen] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Omit<Recipe, 'id' | 'is_favorite'> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { allItems } = useFoodInventory();

  const addIngredient = (ingredient: FoodItem) => {
    if (!selectedIngredients.some(item => item.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setIngredientSelectorOpen(false);
    }
  };

  const removeIngredient = (ingredientId: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredientId));
  };

  // Filter out already selected ingredients
  const availableIngredients = allItems.filter(
    item => !selectedIngredients.some(selected => selected.id === item.id)
  );

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: 'No ingredients',
        description: 'Please select at least one ingredient to generate a recipe.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const ingredientNames = selectedIngredients.map(item => item.name);
      
      // Initialize Hugging Face client
      const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_ACCESS_TOKEN);
      
      // Create system prompt for the LLM (nutrition will be calculated by the app)
      const systemPrompt = `You are a professional chef and recipe developer. Create a detailed recipe using the provided ingredients as the main components. 

Requirements:
- Use the ingredients: ${ingredientNames.join(', ')}
- Serve ${servings} people
${cuisineStyle && cuisineStyle !== 'none' ? `- Cuisine style: ${cuisineStyle}` : ''}
${dietaryRestrictions && dietaryRestrictions !== 'none' ? `- Dietary restrictions: ${dietaryRestrictions}` : ''}
- Include clear, step-by-step cooking instructions
- Suggest reasonable prep time and cooking time
- Return response in valid JSON format only

Return the recipe in this exact JSON format:
{
  "name": "Recipe Name",
  "instructions": "Step 1: ... Step 2: ... Step 3: ...",
  "servings": ${servings},
  "total_time_minutes": 30,
  "ingredients": [
    {
      "ingredient_name": "chicken breast",
      "quantity": 2,
      "unit": "pieces"
    }
  ]
}

Important: Use the exact ingredient names provided: ${ingredientNames.join(', ')}`;

      // Call Hugging Face GPT-OSS-20B model
      const response = await hf.textGeneration({
        model: 'openai/gpt-oss-20b',
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      });

      let generatedText = response.generated_text;
      
      // Try to extract JSON from the response
      let parsedRecipe;
      try {
        // Look for JSON in the response
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedRecipe = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON, using fallback');
        // Fallback to mock response if parsing fails
        const recipeName = `${ingredientNames.slice(0, 2).join(' & ')} ${cuisineStyle || 'Fusion'} Delight`;
        parsedRecipe = {
          name: recipeName,
          instructions: `1. Prep all ingredients by washing and chopping as needed.\n2. Heat oil in a large pan over medium heat.\n3. Add ${ingredientNames[0]} and cook for 3-4 minutes until tender.\n4. Add ${ingredientNames.slice(1).join(', ')} and season with salt and pepper.\n5. Cook for 8-10 minutes, stirring occasionally.\n6. Taste and adjust seasoning as needed.\n7. Serve hot and enjoy!`,
          servings: servings,
          total_time_minutes: Math.floor(Math.random() * 30) + 20,
          ingredients: selectedIngredients.map((ingredient) => ({
            ingredient_name: ingredient.name,
            quantity: Math.floor(Math.random() * 3) + 1,
            unit: ['cups', 'tbsp', 'tsp', 'pieces', 'cloves'][Math.floor(Math.random() * 5)]
          }))
        };
      }

      // Map the AI response ingredients to our expected format
      const recipeIngredients = parsedRecipe.ingredients.map((aiIngredient: any) => {
        // Find matching ingredient from selected ingredients
        const matchingIngredient = selectedIngredients.find(
          item => item.name.toLowerCase().includes(aiIngredient.ingredient_name.toLowerCase()) ||
                 aiIngredient.ingredient_name.toLowerCase().includes(item.name.toLowerCase())
        );
        
        return {
          item_id: matchingIngredient?.id || selectedIngredients[0]?.id,
          quantity: aiIngredient.quantity || 1,
          unit: aiIngredient.unit || 'pieces'
        };
      });

      const finalRecipe = {
        name: parsedRecipe.name,
        instructions: parsedRecipe.instructions,
        servings: parsedRecipe.servings || servings,
        total_time_minutes: parsedRecipe.total_time_minutes || 30,
        ingredients: recipeIngredients,
        nutrition: calculateRecipeNutrition(recipeIngredients, servings, allItems)
      };

      setGeneratedRecipe(finalRecipe);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Recipe generation failed:', error);
      toast({
        title: 'Generation failed',
        description: 'Unable to generate recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedIngredients([]);
    setServings(4);
    setCuisineStyle('none');
    setDietaryRestrictions('none');
    setIngredientSelectorOpen(false);
    setGeneratedRecipe(null);
    setShowPreview(false);
  };

  const handleAcceptRecipe = () => {
    if (generatedRecipe) {
      onRecipeGenerated(generatedRecipe);
      resetForm();
      onOpenChange(false);
      
      toast({
        title: 'Recipe saved!',
        description: 'Your AI-generated recipe has been saved successfully.',
      });
    }
  };

  const handleDeclineRecipe = () => {
    setShowPreview(false);
    setGeneratedRecipe(null);
    
    toast({
      title: 'Recipe declined',
      description: 'You can generate a new recipe with different parameters.',
    });
  };

  const handleClose = () => {
    if (!isGenerating) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showPreview} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Generate Recipe with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Ingredients Selector */}
          <div className="space-y-3">
            <Label>Ingredients from Your Inventory</Label>
            
            {/* Ingredient Selector */}
            <Popover open={ingredientSelectorOpen} onOpenChange={setIngredientSelectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isGenerating}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {selectedIngredients.length > 0 
                    ? `${selectedIngredients.length} ingredient${selectedIngredients.length > 1 ? 's' : ''} selected`
                    : "Select ingredients from your inventory..."
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search your food inventory..." />
                  <CommandList>
                    <CommandEmpty>No ingredients found in your inventory.</CommandEmpty>
                    <CommandGroup>
                      {availableIngredients.map((ingredient) => (
                        <CommandItem
                          key={ingredient.id}
                          value={ingredient.name}
                          onSelect={() => addIngredient(ingredient)}
                          className="flex items-center gap-2"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{ingredient.name}</div>
                            {ingredient.brand && (
                              <div className="text-sm text-muted-foreground">{ingredient.brand}</div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {ingredient.category}
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedIngredients.map((ingredient) => (
                  <Badge 
                    key={ingredient.id} 
                    variant="secondary" 
                    className="flex items-center gap-1 pr-1"
                  >
                    {ingredient.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeIngredient(ingredient.id)}
                      disabled={isGenerating}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              max="20"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 4)}
              disabled={isGenerating}
            />
          </div>

          {/* Cuisine Style */}
          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Style (optional)</Label>
            <Select value={cuisineStyle} onValueChange={setCuisineStyle} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cuisine style..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No preference</SelectItem>
                {CUISINE_STYLES.map((style) => (
                  <SelectItem key={style} value={style.toLowerCase()}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Restrictions (optional)</Label>
            <Select value={dietaryRestrictions} onValueChange={setDietaryRestrictions} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select dietary restriction..." />
              </SelectTrigger>
              <SelectContent>
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <SelectItem key={restriction.value} value={restriction.value}>
                    {restriction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={generateRecipe}
              disabled={selectedIngredients.length === 0 || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Recipe
                </>
              )}
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      <RecipePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        recipe={generatedRecipe}
        onAccept={handleAcceptRecipe}
        onDecline={handleDeclineRecipe}
        ingredients={selectedIngredients}
      />
    </>
  );
}