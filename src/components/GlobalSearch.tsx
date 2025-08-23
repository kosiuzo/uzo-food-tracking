import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useGlobalSearch, useRecentSearches, useSearchSuggestions } from '../hooks/useEnhancedSearch';
import { useIsMobile } from '../hooks/use-mobile';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

export function GlobalSearch({ isOpen, onClose, placeholder = "Search items, recipes, tags..." }: GlobalSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { 
    query, 
    setQuery, 
    results, 
    isLoading 
  } = useGlobalSearch();

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  const {
    suggestions,
    isLoading: isLoadingSuggestions,
  } = useSearchSuggestions(inputValue);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setQuery(trimmedQuery);
    addRecentSearch(trimmedQuery);
    setInputValue(trimmedQuery);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.trim().length >= 2) {
      setQuery(value.trim());
    } else if (value.trim().length === 0) {
      setQuery('');
    }
  };

  // Handle navigation to specific result
  const handleNavigateToItem = (id: number) => {
    navigate('/');
    onClose();
  };

  const handleNavigateToRecipe = (id: number) => {
    navigate('/recipes');
    onClose();
  };

  const handleNavigateToMealLog = (id: number) => {
    navigate('/meals');
    onClose();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const showRecentSearches = !inputValue && recentSearches.length > 0;
  const showSuggestions = inputValue.length >= 2 && suggestions.length > 0 && !query;
  const showResults = query && results.total > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className={`mx-auto mt-16 ${isMobile ? 'mx-4' : 'max-w-2xl'}`}>
        <Card className="shadow-2xl">
          <CardContent className="p-0">
            {/* Search Input */}
            <div className="flex items-center p-4 border-b">
              <Search className="mr-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(inputValue);
                  }
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={placeholder}
                className="border-0 shadow-none focus-visible:ring-0 text-base"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-2 p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className={`${isMobile ? 'h-96' : 'h-[500px]'}`}>
              <div className="p-4">
                {/* Recent Searches */}
                {showRecentSearches && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Recent Searches
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(search);
                            }}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {showSuggestions && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className="flex items-center justify-between w-full p-2 text-left hover:bg-muted rounded-md transition-colors"
                        >
                          <span className="text-sm">{suggestion}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading */}
                {isLoading && (
                  <div className="flex justify-center py-8">
                    <div className="text-sm text-muted-foreground">Searching...</div>
                  </div>
                )}

                {/* Search Results */}
                {showResults && (
                  <div className="space-y-6">
                    {/* Food Items */}
                    {results.items.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Food Items ({results.items.length})
                        </h3>
                        <div className="space-y-2">
                          {results.items.slice(0, 5).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleNavigateToItem(item.id)}
                              className="flex items-center justify-between w-full p-3 text-left hover:bg-muted rounded-md transition-colors"
                            >
                              <div>
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.brand && `${item.brand} • `}
                                  {item.category}
                                  {!item.in_stock && ' • Out of Stock'}
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recipes */}
                    {results.recipes.length > 0 && (
                      <div>
                        <Separator className="my-4" />
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Recipes ({results.recipes.length})
                        </h3>
                        <div className="space-y-2">
                          {results.recipes.slice(0, 5).map((recipe) => (
                            <button
                              key={recipe.id}
                              onClick={() => handleNavigateToRecipe(recipe.id)}
                              className="flex items-center justify-between w-full p-3 text-left hover:bg-muted rounded-md transition-colors"
                            >
                              <div>
                                <div className="font-medium text-sm">{recipe.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {recipe.servings} servings
                                  {recipe.total_time_minutes && ` • ${recipe.total_time_minutes} min`}
                                  {recipe.is_favorite && ' • ⭐ Favorite'}
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {results.tags.length > 0 && (
                      <div>
                        <Separator className="my-4" />
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Tags ({results.tags.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {results.tags.slice(0, 10).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              style={{ borderColor: tag.color, color: tag.color }}
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => {
                                // Navigate to recipes filtered by this tag
                                navigate('/recipes');
                                onClose();
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meal Logs */}
                    {results.mealLogs.length > 0 && (
                      <div>
                        <Separator className="my-4" />
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Meal Logs ({results.mealLogs.length})
                        </h3>
                        <div className="space-y-2">
                          {results.mealLogs.slice(0, 3).map((mealLog) => (
                            <button
                              key={mealLog.id}
                              onClick={() => handleNavigateToMealLog(mealLog.id)}
                              className="flex items-center justify-between w-full p-3 text-left hover:bg-muted rounded-md transition-colors"
                            >
                              <div>
                                <div className="font-medium text-sm">{mealLog.meal_name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {mealLog.date} • ${mealLog.estimated_cost.toFixed(2)}
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total Results Footer */}
                    {results.total > 10 && (
                      <div className="pt-4 border-t text-center">
                        <div className="text-sm text-muted-foreground">
                          Showing top results from {results.total} total matches
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No Results */}
                {query && results.total === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <div className="text-sm text-muted-foreground">
                      No results found for "{query}"
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}