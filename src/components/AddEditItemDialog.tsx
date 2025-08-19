import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '../types';
import { StarRating } from './StarRating';
import { getServingUnitType, UNIT_TO_TYPE } from '../lib/servingUnitUtils';

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: FoodItem;
  onSave: (item: Omit<FoodItem, 'id' | 'last_edited'>) => void;
}

const categories = ['Fruits', 'Vegetables', 'Proteins', 'Dairy & Eggs', 'Grains & Starches', 'Snacks', 'Beverages', 'Oils & Fats', 'Seasonings & Spices', 'Condiments & Sauces', 'Baking Supplies'];

export function AddEditItemDialog({ open, onOpenChange, item, onSave }: AddEditItemDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    in_stock: true,
    price: 0,
    serving_size: 100,
    serving_quantity: 0,
    serving_unit: '',
    serving_unit_type: '' as 'volume' | 'weight' | 'package' | '',
    image_url: '',
    ingredients: '',
    rating: 0,
    nutrition: {
      calories_per_serving: 0,
      protein_per_serving: 0,
      carbs_per_serving: 0,
      fat_per_serving: 0,
      fiber_per_serving: 0,
    },
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        brand: item.brand || '',
        category: item.category,
        in_stock: item.in_stock,
        price: item.price || 0,
        serving_size: item.serving_size || 100,
        serving_quantity: item.serving_quantity || 0,
        serving_unit: item.serving_unit || '',
        serving_unit_type: item.serving_unit_type || '',
        image_url: item.image_url || '',
        ingredients: item.ingredients || '',
        rating: item.rating || 0,
        nutrition: { ...item.nutrition },
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        category: '',
        in_stock: true,
        price: 0,
        serving_size: 100,
        serving_quantity: 0,
        serving_unit: '',
        serving_unit_type: '',
        image_url: '',
        ingredients: '',
        rating: 0,
        nutrition: {
          calories_per_serving: 0,
          protein_per_serving: 0,
          carbs_per_serving: 0,
          fat_per_serving: 0,
          fiber_per_serving: 0,
        },
      });
    }
  }, [item, open]);

  // Auto-set serving unit type when serving unit changes
  const handleServingUnitChange = (unit: string) => {
    const unitType = getServingUnitType(unit);
    setFormData(prev => ({
      ...prev,
      serving_unit: unit,
      serving_unit_type: unitType || '',
    }));
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Name and category are required
    if (!formData.name.trim() || !formData.category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name and category.",
        variant: "destructive",
      });
      return;
    }

    // Prepare the data to save, converting empty strings to null for optional fields
    const dataToSave = {
      ...formData,
      image_url: formData.image_url.trim() || null,
      brand: formData.brand.trim() || null,
      ingredients: formData.ingredients.trim() || null,
    };

    onSave(dataToSave);
    toast({
      title: item ? "Item updated" : "Item added",
      description: `${formData.name} has been ${item ? 'updated' : 'added to your inventory'}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details of your food item.' : 'Add a new food item to your inventory with nutritional information.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Organic Bananas"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Whole Foods"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                size="md"
              />
            </div>
          </div>

          {/* Serving Size */}
          <div className="space-y-2">
            <Label htmlFor="serving_size">Serving Size (grams)</Label>
            <Input
              id="serving_size"
              type="number"
              value={formData.serving_size || 100}
              onChange={(e) => setFormData(prev => ({ ...prev, serving_size: parseFloat(e.target.value) || 100 }))}
              min="1"
              step="1"
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              The weight of one serving in grams. Used for accurate macro calculations.
            </p>
          </div>

          {/* Serving Unit Information */}
          <div className="space-y-3">
            <Label>Serving Unit Information (Optional)</Label>
            <p className="text-xs text-muted-foreground">
              For volume-based measurements in recipes (e.g., 1 cup of rice = 45g)
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serving_quantity">Serving Quantity</Label>
                <Input
                  id="serving_quantity"
                  type="number"
                  value={formData.serving_quantity || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, serving_quantity: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.25"
                  placeholder="e.g., 0.25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serving_unit">Serving Unit</Label>
                <Select 
                  value={formData.serving_unit} 
                  onValueChange={handleServingUnitChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tsp">teaspoons (tsp)</SelectItem>
                    <SelectItem value="tbsp">tablespoons (tbsp)</SelectItem>
                    <SelectItem value="cup">cups</SelectItem>
                    <SelectItem value="fl_oz">fluid ounces (fl oz)</SelectItem>
                    <SelectItem value="ml">milliliters (ml)</SelectItem>
                    <SelectItem value="l">liters (l)</SelectItem>
                    <SelectItem value="g">grams (g)</SelectItem>
                    <SelectItem value="kg">kilograms (kg)</SelectItem>
                    <SelectItem value="oz">ounces (oz)</SelectItem>
                    <SelectItem value="lb">pounds (lb)</SelectItem>
                    <SelectItem value="piece">pieces</SelectItem>
                    <SelectItem value="slice">slices</SelectItem>
                    <SelectItem value="can">cans</SelectItem>
                    <SelectItem value="bottle">bottles</SelectItem>
                    <SelectItem value="pouch">pouches</SelectItem>
                    <SelectItem value="scoop">scoops</SelectItem>
                    <SelectItem value="serving">servings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {formData.serving_unit_type && (
              <div className="text-xs text-muted-foreground">
                Unit type: <span className="font-medium">{formData.serving_unit_type}</span>
                {formData.serving_quantity && formData.serving_unit && formData.serving_size && (
                  <span className="ml-2">
                    • {formData.serving_quantity} {formData.serving_unit} = {formData.serving_size}g
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="in_stock">Currently in stock</Label>
            <Switch
              id="in_stock"
              checked={formData.in_stock}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="e.g., https://example.com/product-image.jpg"
                className="flex-1"
              />
              {formData.image_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  title="Clear image URL"
                >
                  Clear
                </Button>
              )}
            </div>
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Product preview" 
                  className="w-20 h-20 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            {!formData.image_url && (
              <div className="mt-2 text-sm text-muted-foreground">
                No image URL set. Will use default category image.
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              placeholder="e.g., Organic chicken breast, water, salt, natural flavoring"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
          </div>

          {/* Nutrition Info */}
          <div className="space-y-3">
            <Label>Nutrition (per serving)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="calories" className="text-xs">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.nutrition.calories_per_serving ?? ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition: { ...prev.nutrition, calories_per_serving: parseFloat(e.target.value) || 0 }
                  }))}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={formData.nutrition.protein_per_serving ?? ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition: { ...prev.nutrition, protein_per_serving: parseFloat(e.target.value) || 0 }
                  }))}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={formData.nutrition.carbs_per_serving ?? ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition: { ...prev.nutrition, carbs_per_serving: parseFloat(e.target.value) || 0 }
                  }))}
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={formData.nutrition.fat_per_serving ?? ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nutrition: { ...prev.nutrition, fat_per_serving: parseFloat(e.target.value) || 0 }
                  }))}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Fetching...' : (item ? 'Update Item' : 'Add Item')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}