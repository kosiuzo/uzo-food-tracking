import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Target, Save } from 'lucide-react';

// Storage key for settings
const SETTINGS_STORAGE_KEY = 'uzo-food-tracking-settings';

// Default settings
const DEFAULT_SETTINGS = {
  calorieTarget: 2000,
};

// Types
interface AppSettings {
  calorieTarget: number;
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [calorieInput, setCalorieInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        setCalorieInput(parsed.calorieTarget?.toString() || DEFAULT_SETTINGS.calorieTarget.toString());
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use defaults if parsing fails
        setCalorieInput(DEFAULT_SETTINGS.calorieTarget.toString());
      }
    } else {
      setCalorieInput(DEFAULT_SETTINGS.calorieTarget.toString());
    }
  }, []);

  // Handle calorie target input change
  const handleCalorieInputChange = (value: string) => {
    setCalorieInput(value);
    setIsDirty(true);
  };

  // Save settings
  const handleSave = () => {
    const calorieValue = parseInt(calorieInput);

    // Validate input
    if (isNaN(calorieValue) || calorieValue < 500 || calorieValue > 10000) {
      toast({
        title: 'Invalid calorie target',
        description: 'Please enter a number between 500 and 10,000 calories.',
        variant: 'destructive',
      });
      return;
    }

    const newSettings = {
      ...settings,
      calorieTarget: calorieValue,
    };

    // Save to localStorage
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    setIsDirty(false);

    toast({
      title: 'Settings saved',
      description: `Daily calorie target updated to ${calorieValue.toLocaleString()} calories.`,
    });
  };

  // Reset to defaults
  const handleReset = () => {
    setCalorieInput(DEFAULT_SETTINGS.calorieTarget.toString());
    setIsDirty(true);
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calorie-target" className="text-sm font-medium">
                    Daily Calorie Target
                  </Label>
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

                {/* Current vs New Preview */}
                {isDirty && (
                  <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                    <p className="text-xs text-muted-foreground">Preview:</p>
                    <div className="flex justify-between text-sm">
                      <span>Current: {settings.calorieTarget.toLocaleString()} calories</span>
                      <span className="font-medium">
                        New: {parseInt(calorieInput) || 0} calories
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    className="gap-2"
                    disabled={!isDirty || !calorieInput}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={calorieInput === DEFAULT_SETTINGS.calorieTarget.toString()}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Future Settings Sections */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-muted-foreground">Coming Soon</h2>
            <Card className="p-6">
              <div className="text-center text-muted-foreground space-y-2">
                <p className="text-sm">More settings will be available here:</p>
                <ul className="text-xs space-y-1">
                  <li>• Macro targets (protein, carbs, fat)</li>
                  <li>• Meal timing preferences</li>
                  <li>• Data export options</li>
                  <li>• Theme preferences</li>
                </ul>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </Layout>
  );
}

// Export utility function to get current calorie target
export const getCalorieTarget = (): number => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return parsed.calorieTarget || DEFAULT_SETTINGS.calorieTarget;
    }
  } catch (error) {
    console.error('Error loading calorie target:', error);
  }
  return DEFAULT_SETTINGS.calorieTarget;
};