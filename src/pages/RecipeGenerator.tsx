import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Clock, Users, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useFoodInventory } from '@/hooks/useFoodInventory';
import { FoodItem } from '@/types';

const dietTypes = [
  { value: 'paleo', label: 'Paleo' },
  { value: 'whole30', label: 'Whole30' },
  { value: 'standard', label: 'Original/Standard' },
  { value: 'keto', label: 'Keto' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

// Mock recipe data that simulates AI response
const mockGeneratedRecipe = {
  name: "Mediterranean Chicken & Vegetable Skillet",
  description: "A healthy one-pan meal with tender chicken, fresh vegetables, and aromatic herbs",
  prepTime: 15,
  cookTime: 25,
  servings: 4,
  ingredients: [
    "2 lbs chicken breast, cut into chunks",
    "2 cups broccoli florets", 
    "1 cup brown rice, cooked",
    "3 tbsp olive oil",
    "2 cloves garlic, minced",
    "1 lemon, juiced",
    "1 tsp dried oregano",
    "1/2 tsp dried thyme",
    "Salt and pepper to taste",
    "1/4 cup fresh parsley, chopped"
  ],
  instructions: [
    "Heat 2 tablespoons of olive oil in a large skillet over medium-high heat.",
    "Season chicken chunks with salt, pepper, oregano, and thyme.",
    "Add chicken to the skillet and cook for 6-8 minutes until golden brown and cooked through.",
    "Remove chicken and set aside.",
    "In the same skillet, add remaining olive oil and minced garlic. Cook for 30 seconds.",
    "Add broccoli florets and cook for 4-5 minutes until tender-crisp.",
    "Return chicken to the skillet and add cooked brown rice.",
    "Drizzle with lemon juice and toss everything together.",
    "Cook for 2-3 minutes to heat through.",
    "Garnish with fresh parsley and serve immediately."
  ],
  nutrition: {
    calories: 380,
    protein: 42,
    carbs: 28,
    fat: 12,
    fiber: 4
  }
};

const RecipeGenerator = () => {
  const { allItems } = useFoodInventory();
  const [selectedIngredients, setSelectedIngredients] = useState<FoodItem[]>([]);
  const [dietType, setDietType] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<typeof mockGeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) {
      toast.error('Please select some ingredients');
      return;
    }
    
    if (!dietType) {
      toast.error('Please select a diet type');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      // Customize the mock recipe based on inputs
      const customizedRecipe = {
        ...mockGeneratedRecipe,
        name: `${dietTypes.find(d => d.value === dietType)?.label} ${mockGeneratedRecipe.name}`,
        description: `A delicious ${dietType} recipe using ${selectedIngredients.slice(0, 3).map(i => i.name).join(', ')}`
      };
      
      setGeneratedRecipe(customizedRecipe);
      setIsGenerating(false);
      toast.success('Recipe generated successfully!');
    }, 2000);
  };

  const handleClearRecipe = () => {
    setGeneratedRecipe(null);
  };

  const handleIngredientSelect = (item: FoodItem) => {
    if (!selectedIngredients.find(ingredient => ingredient.id === item.id)) {
      setSelectedIngredients(prev => [...prev, item]);
    }
    setShowIngredientDropdown(false);
  };

  const handleIngredientRemove = (itemId: string) => {
    setSelectedIngredients(prev => prev.filter(ingredient => ingredient.id !== itemId));
  };

  const availableIngredients = allItems.filter(item => 
    !selectedIngredients.find(selected => selected.id === item.id)
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recipe Generator</h1>
          <p className="text-muted-foreground">
            Create custom recipes based on your ingredients and dietary preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Generate Recipe
              </CardTitle>
              <CardDescription>
                Enter your ingredients and preferences to create a custom recipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients*</Label>
                <div className="space-y-3">
                  {/* Selected Ingredients */}
                  {selectedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredients.map((ingredient) => (
                        <Badge 
                          key={ingredient.id} 
                          variant="secondary" 
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {ingredient.name}
                          <button
                            onClick={() => handleIngredientRemove(ingredient.id)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Ingredient Selector */}
                  <div className="relative">
                    <Select onValueChange={(value) => {
                      const item = allItems.find(item => item.id === value);
                      if (item) handleIngredientSelect(item);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ingredients from your inventory" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIngredients.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{item.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select ingredients from your inventory to create a recipe
                </p>
              </div>

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
                <Label htmlFor="inspiration">Recipe Inspiration (Optional)</Label>
                <Textarea
                  id="inspiration"
                  placeholder="Describe any specific style, flavors, or existing recipes for inspiration..."
                  value={inspiration}
                  onChange={(e) => setInspiration(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    'Generate Recipe'
                  )}
                </Button>
                {generatedRecipe && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearRecipe}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generated Recipe */}
          {generatedRecipe && (
            <Card>
              <CardHeader>
                <CardTitle>{generatedRecipe.name}</CardTitle>
                <CardDescription>{generatedRecipe.description}</CardDescription>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {generatedRecipe.prepTime + generatedRecipe.cookTime} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {generatedRecipe.servings} servings
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nutrition Facts */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{generatedRecipe.nutrition.calories}</div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span>{generatedRecipe.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs</span>
                      <span>{generatedRecipe.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat</span>
                      <span>{generatedRecipe.nutrition.fat}g</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Ingredients */}
                <div>
                  <h3 className="font-semibold mb-3">Ingredients</h3>
                  <ul className="space-y-1">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Instructions */}
                <div>
                  <h3 className="font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions.map((step, index) => (
                      <li key={index} className="text-sm flex gap-3">
                        <Badge variant="outline" className="shrink-0 w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecipeGenerator;