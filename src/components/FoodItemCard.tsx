import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FoodItem } from '../types';
import { StarRating } from './StarRating';
import { format, parseISO } from 'date-fns';
import { getFoodItemImage, getDefaultImageByCategory } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface FoodItemCardProps {
  item: FoodItem;
  onToggleStock: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRatingChange?: (rating: number) => void;
}

export function FoodItemCard({ item, onToggleStock, onEdit, onDelete, onRatingChange }: FoodItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  // Reset error state when item.image_url changes
  useEffect(() => {
    setImageError(false);
    setHasTriedFallback(false);
  }, [item.image_url, item.id]);

  const currentImageUrl = getFoodItemImage(item.image_url, item.category);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={currentImageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Only fallback if we haven't tried yet and it's not already the default
              const target = e.target as HTMLImageElement;
              if (!hasTriedFallback && item.image_url && item.image_url.trim() !== '') {
                setHasTriedFallback(true);
                setImageError(true);
                target.src = getDefaultImageByCategory(item.category);
              }
            }}
            onLoad={() => {
              // Reset error states when image loads successfully
              setImageError(false);
              setHasTriedFallback(false);
            }}
            key={item.image_url || 'default'} // Force re-render when image URL changes
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate leading-tight">{item.name}</h3>
              {item.brand && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">{item.brand}</p>
              )}
            </div>
            
            {/* Stock Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {item.in_stock ? 'In Stock' : 'Out'}
              </span>
              <Switch
                checked={item.in_stock}
                onCheckedChange={onToggleStock}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {item.category}
            </Badge>
            {item.price && (
              <span className="text-sm font-semibold text-green-600">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Purchase Date - Separate from other info */}
          {item.last_purchased && (
            <div className="mb-3">
              <span className="text-xs text-muted-foreground">
                Purchased: {format(parseISO(item.last_purchased), 'MMM d')}
              </span>
            </div>
          )}

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating
                rating={item.rating}
                onRatingChange={onRatingChange}
                size="sm"
              />
              {item.rating > 0 && (
                <span className="text-xs text-muted-foreground">
                  {item.rating}/5
                </span>
              )}
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Nutrition Info - Only show if significant data exists */}
          {(item.nutrition.calories_per_serving || item.nutrition.protein_per_serving) && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs">
                <span className="font-medium text-muted-foreground mb-1 block">Nutrition (per serving):</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  {item.nutrition.calories_per_serving > 0 && (
                    <span className="font-medium">{item.nutrition.calories_per_serving.toFixed(1)} cal</span>
                  )}
                  {item.nutrition.protein_per_serving > 0 && (
                    <span>Protein: {item.nutrition.protein_per_serving.toFixed(1)}g</span>
                  )}
                  {item.nutrition.carbs_per_serving > 0 && (
                    <span>Carbs: {item.nutrition.carbs_per_serving.toFixed(1)}g</span>
                  )}
                  {item.nutrition.fat_per_serving > 0 && (
                    <span>Fat: {item.nutrition.fat_per_serving.toFixed(1)}g</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Serving Information */}
          {(item.serving_size || item.serving_quantity) && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs">
                <span className="font-medium text-muted-foreground mb-1 block">Serving Information:</span>
                <div className="space-y-1 text-muted-foreground">
                  {item.serving_size && (
                    <div>Serving size: {item.serving_size}g</div>
                  )}
                  {item.serving_quantity && item.serving_unit && (
                    <div>
                      Unit: {item.serving_quantity} {item.serving_unit} = {item.serving_size || 100}g
                      {item.serving_unit_type && (
                        <span className="ml-1 text-xs opacity-75">({item.serving_unit_type})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ingredients - Show if available */}
          {item.ingredients && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs">
                <span className="font-medium text-muted-foreground mb-1 block">Ingredients:</span>
                <p className="text-muted-foreground leading-relaxed">{item.ingredients}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}