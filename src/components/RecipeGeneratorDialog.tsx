import React, { useState } from 'react';
import { Bot, Plus, X, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GroupedMultiSelect, OptionGroup, GroupedOption } from '@/components/ui/grouped-multi-select';
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
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [servings, setServings] = useState(4);
  const [cuisineStyle, setCuisineStyle] = useState('none');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('paleo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Omit<Recipe, 'id' | 'is_favorite'> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { allItems } = useFoodInventory();

  // Group items by category for the GroupedMultiSelect
  const groupedIngredients: OptionGroup = React.useMemo(() => {
    const groups: OptionGroup = {};
    
    allItems.forEach(item => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({
        label: item.name, // Only show name, no brand
        value: item.id,
      });
    });
    
    // Sort items within each category by name
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.label.localeCompare(b.label));
    });
    
    return groups;
  }, [allItems]);

  // Handle ingredient selection from MultiSelect
  const handleIngredientSelectionChange = (selectedIds: string[]) => {
    setSelectedIngredientIds(selectedIds);
    
    // Update selectedIngredients array based on selection
    const newSelectedIngredients = selectedIds.map(itemId => {
      return allItems.find(item => item.id === itemId)!;
    }).filter(Boolean);
    
    setSelectedIngredients(newSelectedIngredients);
  };

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
      
      // Create user prompt with selected ingredients
      const userPrompt = `Create a ${dietaryRestrictions !== 'none' ? dietaryRestrictions : 'healthy'} recipe using ONLY these ingredients:
${ingredientNames.map(name => `- ${name}`).join('\n')}

Target: serves ${servings}${cuisineStyle && cuisineStyle !== 'none' ? `, ${cuisineStyle} style` : ''}, total time ≈ 30-45 minutes.

Return a single JSON object that matches the schema exactly.`;

      // Call OpenRouter API with streamlined approach
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "FoodTracker Recipe Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-oss-20b:free",
          "temperature": 0.3,
          "top_p": 0.9,
          "max_tokens": 1200,
          "seed": 42,
          // Prefer JSON mode if the route honors it
          "response_format": { "type": "json_object" },
          "messages": [
            {
              "role": "system",
              "content": `Return only valid JSON. Use this exact schema:
{
  "name": "Recipe Name",
  "instructions": "Step by step cooking instructions as one paragraph.",
  "servings": 4,
  "total_time_minutes": 30,
  "ingredients": [
    { "ingredient_name": "exact ingredient name", "quantity": 1, "unit": "pieces" }
  ]
}

Use only the provided ingredients. Make reasonable portions for the serving size.`
            },
            {
              "role": "user",
              "content": userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content;
      
      // Try to extract JSON from the response
      let parsedRecipe: {
        name: string;
        instructions: string;
        servings: number;
        total_time_minutes: number;
        ingredients: Array<{
          ingredient_name: string;
          quantity: number;
          unit: string;
        }>;
      };
      try {
        // Look for JSON in the response
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedRecipe = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON:', parseError);
        
        // Notify user about the failure
        toast({
          title: 'AI Generation Failed',
          description: 'Failed to generate recipe. Please try again or check your API configuration.',
          variant: 'destructive',
        });
        
        // Don't create fallback recipe - just throw the error
        throw new Error('Failed to parse AI response');
      }

      // Map the AI response ingredients to our expected format
      const recipeIngredients = parsedRecipe.ingredients.map((aiIngredient: { ingredient_name: string; quantity: number; unit: string }) => {
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

      // Parse and format instructions properly
      const formatInstructions = (instructions: string) => {
        // First handle any escaped newlines
        let formatted = instructions.replace(/\\n/g, '\n');
        
        // If instructions are in a single paragraph with "Step X:" format, split them
        if (formatted.includes('Step ') && !formatted.includes('\n')) {
          // Split by "Step X:" pattern and rejoin with newlines
          formatted = formatted
            .split(/Step \d+:\s*/)
            .filter(step => step.trim().length > 0)
            .map((step, index) => `${index + 1}. ${step.trim()}`)
            .join('\n');
        } 
        // If instructions are in a single paragraph with sentences, split by periods
        else if (!formatted.includes('\n') && formatted.includes('.')) {
          // Split by sentences and create numbered steps
          const sentences = formatted
            .split('.')
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0);
          
          if (sentences.length > 1) {
            formatted = sentences
              .map((sentence, index) => `${index + 1}. ${sentence}.`)
              .join('\n');
          }
        }
        
        return formatted;
      };

      const finalRecipe = {
        name: parsedRecipe.name,
        instructions: formatInstructions(parsedRecipe.instructions),
        servings: parsedRecipe.servings || servings,
        total_time_minutes: parsedRecipe.total_time_minutes || 30,
        ingredients: recipeIngredients,
        nutrition: calculateRecipeNutrition(recipeIngredients, servings, allItems)
      };

      setGeneratedRecipe(finalRecipe);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Recipe generation failed:', error);
      
      // More specific error handling
      if (error instanceof Error && error.message.includes('API request failed')) {
        toast({
          title: 'API Connection Failed',
          description: 'Unable to connect to AI service. Please check your internet connection and API configuration.',
          variant: 'destructive',
        });
      } else if (error instanceof Error && error.message.includes('Failed to parse')) {
        // Parsing error notification already shown above
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Unable to generate recipe. Please try again with different ingredients.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedIngredients([]);
    setSelectedIngredientIds([]);
    setServings(4);
    setCuisineStyle('none');
    setDietaryRestrictions('paleo');
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
            <GroupedMultiSelect
              optionGroups={groupedIngredients}
              onValueChange={handleIngredientSelectionChange}
              defaultValue={selectedIngredientIds}
              placeholder="Search and select ingredients from your inventory..."
              maxCount={3}
            />
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