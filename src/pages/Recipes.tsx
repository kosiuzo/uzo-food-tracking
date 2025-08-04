import { useState } from 'react';
import { Plus, Search, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '../components/Layout';
import { AddRecipeDialog } from '../components/AddRecipeDialog';
import { useRecipes } from '../hooks/useRecipes';

export default function Recipes() {
  const { recipes, searchQuery, setSearchQuery, addRecipe } = useRecipes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <p className="text-muted-foreground">Manage your favorite recipes</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Recipes List */}
        <div className="space-y-3">
          {recipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recipes found</p>
            </div>
          ) : (
            recipes.map(recipe => (
              <Card key={recipe.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{recipe.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {recipe.servings} servings
                        </div>
                        {recipe.prep_time_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {recipe.prep_time_minutes} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nutrition per serving */}
                  <div className="flex gap-4 text-xs">
                    <Badge variant="secondary">
                      {recipe.nutrition.calories_per_serving} cal
                    </Badge>
                    <span className="text-muted-foreground">
                      P: {recipe.nutrition.protein_per_serving}g
                    </span>
                    <span className="text-muted-foreground">
                      C: {recipe.nutrition.carbs_per_serving}g
                    </span>
                    <span className="text-muted-foreground">
                      F: {recipe.nutrition.fat_per_serving}g
                    </span>
                  </div>

                  {/* Ingredients count */}
                  <p className="text-sm text-muted-foreground">
                    {recipe.ingredients.length} ingredients
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Floating Add Button */}
        <Button
          className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Add Recipe Dialog */}
        <AddRecipeDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={(recipeData) => {
            addRecipe(recipeData);
            setIsAddDialogOpen(false);
          }}
        />
      </div>
    </Layout>
  );
}