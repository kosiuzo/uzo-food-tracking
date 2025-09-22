import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Layout } from '../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Target, Save, Tags, Plus, Trash2, Edit2 } from 'lucide-react';
import { SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS, type AppSettings } from '@/lib/settings-constants';
import { useTags } from '@/hooks/useTags';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [calorieInput, setCalorieInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Tag management state
  const { allTags, addTag, updateTag, deleteTag, isAdding, isUpdating, isDeleting } = useTags();
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<{id: number; name: string; color: string; description?: string} | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');
  const [tagDescription, setTagDescription] = useState('');

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(mergedSettings);
        setCalorieInput(mergedSettings.calorieTarget.toString());
        setProteinInput(mergedSettings.proteinTarget.toString());
        setCarbsInput(mergedSettings.carbsTarget.toString());
        setFatInput(mergedSettings.fatTarget.toString());
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use defaults if parsing fails
        setCalorieInput(DEFAULT_SETTINGS.calorieTarget.toString());
        setProteinInput(DEFAULT_SETTINGS.proteinTarget.toString());
        setCarbsInput(DEFAULT_SETTINGS.carbsTarget.toString());
        setFatInput(DEFAULT_SETTINGS.fatTarget.toString());
      }
    } else {
      setCalorieInput(DEFAULT_SETTINGS.calorieTarget.toString());
      setProteinInput(DEFAULT_SETTINGS.proteinTarget.toString());
      setCarbsInput(DEFAULT_SETTINGS.carbsTarget.toString());
      setFatInput(DEFAULT_SETTINGS.fatTarget.toString());
    }
  }, []);

  // Handle input changes
  const handleCalorieInputChange = (value: string) => {
    setCalorieInput(value);
    setIsDirty(true);
  };

  const handleProteinInputChange = (value: string) => {
    setProteinInput(value);
    setIsDirty(true);
  };

  const handleCarbsInputChange = (value: string) => {
    setCarbsInput(value);
    setIsDirty(true);
  };

  const handleFatInputChange = (value: string) => {
    setFatInput(value);
    setIsDirty(true);
  };

  const handleToggleChange = (field: keyof AppSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // Save settings
  const handleSave = () => {
    const calorieValue = parseInt(calorieInput);
    const proteinValue = parseInt(proteinInput);
    const carbsValue = parseInt(carbsInput);
    const fatValue = parseInt(fatInput);

    // Validate inputs
    if (settings.calorieTargetEnabled && (isNaN(calorieValue) || calorieValue < 500 || calorieValue > 10000)) {
      toast({
        title: 'Invalid calorie target',
        description: 'Please enter a number between 500 and 10,000 calories.',
        variant: 'destructive',
      });
      return;
    }

    if (settings.proteinTargetEnabled && (isNaN(proteinValue) || proteinValue < 10 || proteinValue > 1000)) {
      toast({
        title: 'Invalid protein target',
        description: 'Please enter a number between 10 and 1,000 grams.',
        variant: 'destructive',
      });
      return;
    }

    if (settings.carbsTargetEnabled && (isNaN(carbsValue) || carbsValue < 10 || carbsValue > 1000)) {
      toast({
        title: 'Invalid carbs target',
        description: 'Please enter a number between 10 and 1,000 grams.',
        variant: 'destructive',
      });
      return;
    }

    if (settings.fatTargetEnabled && (isNaN(fatValue) || fatValue < 10 || fatValue > 500)) {
      toast({
        title: 'Invalid fat target',
        description: 'Please enter a number between 10 and 500 grams.',
        variant: 'destructive',
      });
      return;
    }

    const newSettings = {
      ...settings,
      calorieTarget: calorieValue,
      proteinTarget: proteinValue,
      carbsTarget: carbsValue,
      fatTarget: fatValue,
    };

    // Save to localStorage
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    setIsDirty(false);

    const enabledTargets = [];
    if (newSettings.calorieTargetEnabled) enabledTargets.push(`${calorieValue.toLocaleString()} calories`);
    if (newSettings.proteinTargetEnabled) enabledTargets.push(`${proteinValue}g protein`);
    if (newSettings.carbsTargetEnabled) enabledTargets.push(`${carbsValue}g carbs`);
    if (newSettings.fatTargetEnabled) enabledTargets.push(`${fatValue}g fat`);

    toast({
      title: 'Settings saved',
      description: enabledTargets.length > 0
        ? `Targets updated: ${enabledTargets.join(', ')}`
        : 'All targets disabled',
    });
  };

  // Reset to defaults
  const handleReset = () => {
    setCalorieInput(DEFAULT_SETTINGS.calorieTarget.toString());
    setProteinInput(DEFAULT_SETTINGS.proteinTarget.toString());
    setCarbsInput(DEFAULT_SETTINGS.carbsTarget.toString());
    setFatInput(DEFAULT_SETTINGS.fatTarget.toString());
    setSettings(DEFAULT_SETTINGS);
    setIsDirty(true);
  };

  // Tag management functions
  const openTagDialog = (tag?: {id: number; name: string; color: string; description?: string}) => {
    if (tag) {
      setEditingTag(tag);
      setTagName(tag.name);
      setTagColor(tag.color);
      setTagDescription(tag.description || '');
    } else {
      setEditingTag(null);
      setTagName('');
      setTagColor('#3b82f6');
      setTagDescription('');
    }
    setTagDialogOpen(true);
  };

  const closeTagDialog = () => {
    setTagDialogOpen(false);
    setEditingTag(null);
    setTagName('');
    setTagColor('#3b82f6');
    setTagDescription('');
  };

  const handleSaveTag = () => {
    if (!tagName.trim()) {
      toast({
        title: 'Invalid tag name',
        description: 'Please enter a tag name.',
        variant: 'destructive',
      });
      return;
    }

    const tagData = {
      name: tagName.trim(),
      color: tagColor,
      description: tagDescription.trim() || undefined,
    };

    if (editingTag) {
      updateTag({ id: editingTag.id, updates: tagData }, {
        onSuccess: () => {
          toast({
            title: 'Tag updated',
            description: `"${tagName}" has been updated successfully.`,
          });
          closeTagDialog();
        },
        onError: (error) => {
          toast({
            title: 'Error updating tag',
            description: error.message || 'Failed to update tag. Please try again.',
            variant: 'destructive',
          });
        },
      });
    } else {
      addTag(tagData, {
        onSuccess: () => {
          toast({
            title: 'Tag created',
            description: `"${tagName}" has been created successfully.`,
          });
          closeTagDialog();
        },
        onError: (error) => {
          toast({
            title: 'Error creating tag',
            description: error.message || 'Failed to create tag. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleDeleteTag = (tag: {id: number; name: string}) => {
    if (window.confirm(`Are you sure you want to delete the tag "${tag.name}"? This will remove it from all recipes.`)) {
      deleteTag(tag.id, {
        onSuccess: () => {
          toast({
            title: 'Tag deleted',
            description: `"${tag.name}" has been deleted successfully.`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Error deleting tag',
            description: error.message || 'Failed to delete tag. Please try again.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-1.5">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-4 space-y-6">

          {/* Nutrition Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Nutrition Goals</h2>
            </div>

            <Card className="p-6">
              <div className="space-y-6">

                {/* Calorie Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="calorie-target" className="text-sm font-medium">
                      Daily Calorie Target
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="calorie-enabled" className="text-xs text-muted-foreground">
                        Enable
                      </Label>
                      <Switch
                        id="calorie-enabled"
                        checked={settings.calorieTargetEnabled}
                        onCheckedChange={(checked) => handleToggleChange('calorieTargetEnabled', checked)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="calorie-target"
                        type="number"
                        min="500"
                        max="10000"
                        value={calorieInput}
                        onChange={(e) => handleCalorieInputChange(e.target.value)}
                        placeholder="2000"
                        className="text-right"
                        disabled={!settings.calorieTargetEnabled}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended range: 1,200 - 4,000 calories per day
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground min-w-[60px]">
                      calories
                    </div>
                  </div>
                </div>

                {/* Protein Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="protein-target" className="text-sm font-medium">
                      Daily Protein Target
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="protein-enabled" className="text-xs text-muted-foreground">
                        Enable
                      </Label>
                      <Switch
                        id="protein-enabled"
                        checked={settings.proteinTargetEnabled}
                        onCheckedChange={(checked) => handleToggleChange('proteinTargetEnabled', checked)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="protein-target"
                        type="number"
                        min="10"
                        max="1000"
                        value={proteinInput}
                        onChange={(e) => handleProteinInputChange(e.target.value)}
                        placeholder="200"
                        className="text-right"
                        disabled={!settings.proteinTargetEnabled}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended range: 50 - 300 grams per day
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground min-w-[60px]">
                      grams
                    </div>
                  </div>
                </div>

                {/* Carbs Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="carbs-target" className="text-sm font-medium">
                      Daily Carbs Target
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="carbs-enabled" className="text-xs text-muted-foreground">
                        Enable
                      </Label>
                      <Switch
                        id="carbs-enabled"
                        checked={settings.carbsTargetEnabled}
                        onCheckedChange={(checked) => handleToggleChange('carbsTargetEnabled', checked)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="carbs-target"
                        type="number"
                        min="10"
                        max="1000"
                        value={carbsInput}
                        onChange={(e) => handleCarbsInputChange(e.target.value)}
                        placeholder="100"
                        className="text-right"
                        disabled={!settings.carbsTargetEnabled}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended range: 50 - 400 grams per day
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground min-w-[60px]">
                      grams
                    </div>
                  </div>
                </div>

                {/* Fat Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fat-target" className="text-sm font-medium">
                      Daily Fat Target
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="fat-enabled" className="text-xs text-muted-foreground">
                        Enable
                      </Label>
                      <Switch
                        id="fat-enabled"
                        checked={settings.fatTargetEnabled}
                        onCheckedChange={(checked) => handleToggleChange('fatTargetEnabled', checked)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="fat-target"
                        type="number"
                        min="10"
                        max="500"
                        value={fatInput}
                        onChange={(e) => handleFatInputChange(e.target.value)}
                        placeholder="100"
                        className="text-right"
                        disabled={!settings.fatTargetEnabled}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended range: 30 - 200 grams per day
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground min-w-[60px]">
                      grams
                    </div>
                  </div>
                </div>

                {/* Current vs New Preview */}
                {isDirty && (
                  <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                    <p className="text-xs text-muted-foreground">Preview:</p>
                    <div className="space-y-1 text-sm">
                      {settings.calorieTargetEnabled && (
                        <div className="flex justify-between">
                          <span>Calories: {settings.calorieTarget.toLocaleString()}</span>
                          <span className="font-medium">→ {parseInt(calorieInput) || 0}</span>
                        </div>
                      )}
                      {settings.proteinTargetEnabled && (
                        <div className="flex justify-between">
                          <span>Protein: {settings.proteinTarget}g</span>
                          <span className="font-medium">→ {parseInt(proteinInput) || 0}g</span>
                        </div>
                      )}
                      {settings.carbsTargetEnabled && (
                        <div className="flex justify-between">
                          <span>Carbs: {settings.carbsTarget}g</span>
                          <span className="font-medium">→ {parseInt(carbsInput) || 0}g</span>
                        </div>
                      )}
                      {settings.fatTargetEnabled && (
                        <div className="flex justify-between">
                          <span>Fat: {settings.fatTarget}g</span>
                          <span className="font-medium">→ {parseInt(fatInput) || 0}g</span>
                        </div>
                      )}
                      {!settings.calorieTargetEnabled && !settings.proteinTargetEnabled && !settings.carbsTargetEnabled && !settings.fatTargetEnabled && (
                        <span className="text-muted-foreground text-xs">All targets disabled</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    className="gap-2"
                    disabled={!isDirty}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Tag Management Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Tag Management</h2>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Manage tags used to categorize your recipes
                  </p>
                  <Button onClick={() => openTagDialog()} className="gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    Add Tag
                  </Button>
                </div>

                {/* Tags Grid */}
                <div className="space-y-3">
                  {allTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No tags created yet. Add your first tag to get started.
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {allTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              style={{ backgroundColor: tag.color, color: 'white' }}
                              className="text-xs"
                            >
                              {tag.name}
                            </Badge>
                            {tag.description && (
                              <span className="text-xs text-muted-foreground">
                                {tag.description}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openTagDialog(tag)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTag(tag)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </DialogTitle>
            <DialogDescription>
              {editingTag
                ? 'Update the tag name, color, and description.'
                : 'Create a new tag to categorize your recipes.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g., vegetarian, quick-meal"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-color">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  id="tag-color"
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                />
                <Input
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
                {tagName && (
                  <Badge
                    style={{ backgroundColor: tagColor, color: 'white' }}
                    className="text-xs whitespace-nowrap"
                  >
                    {tagName}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-description">Description (Optional)</Label>
              <Textarea
                id="tag-description"
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
                placeholder="Describe what this tag represents..."
                className="w-full"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeTagDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTag}
              disabled={isAdding || isUpdating || !tagName.trim()}
            >
              {isAdding || isUpdating ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

