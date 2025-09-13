import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FoodItem } from '../types';
import { StarRating } from './StarRating';
import { getFoodItemImage, getDefaultImageByCategory } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface FoodItemCardProps {
  item: FoodItem;
  onEdit: () => void;
  onDelete: () => void;
  onRatingChange?: (rating: number) => void;
}

export function FoodItemCard({ item, onEdit, onDelete, onRatingChange }: FoodItemCardProps) {
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  // Reset error state when item.image_url changes
  useEffect(() => {
    setHasTriedFallback(false);
  }, [item.image_url, item.id]);

  const currentImageUrl = getFoodItemImage(item.image_url, item.category);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Image */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={currentImageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Only fallback if we haven't tried yet and it's not already the default
              const target = e.target as HTMLImageElement;
              if (!hasTriedFallback && item.image_url && item.image_url.trim() !== '') {
                setHasTriedFallback(true);
                target.src = getDefaultImageByCategory(item.category);
              }
            }}
            onLoad={() => {
              // Reset error states when image loads successfully
              setHasTriedFallback(false);
            }}
            key={item.image_url || 'default'} // Force re-render when image URL changes
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg break-words leading-tight">{item.name}</h3>
              {item.brand && (
                <p className="text-sm text-muted-foreground mt-0.5">{item.brand}</p>
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

          {/* Category and Rating */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            
            <div className="flex items-center gap-2">
              <StarRating
                rating={item.rating}
                onRatingChange={onRatingChange}
                size="md"
              />
              {item.rating > 0 && (
                <span className="text-sm font-medium text-muted-foreground">
                  {item.rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Ingredients */}
          {item.ingredients && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium">Ingredients:</span> {item.ingredients}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}