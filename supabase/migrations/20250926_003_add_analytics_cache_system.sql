-- Migration: Add analytics cache system
-- Created: 2025-09-26
-- Description: Create analytics cache tables, trigger logic, and RPC function for optimized analytics

-- 1. Create daily analytics cache table
CREATE TABLE daily_analytics_cache (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calories NUMERIC DEFAULT 0,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fat NUMERIC DEFAULT 0,
  meals_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, date)
);

-- 2. Create weekly analytics cache table
CREATE TABLE weekly_analytics_cache (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL, -- Monday of the week
  avg_calories NUMERIC DEFAULT 0,
  avg_protein NUMERIC DEFAULT 0,
  avg_carbs NUMERIC DEFAULT 0,
  avg_fat NUMERIC DEFAULT 0,
  days_with_data INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, week_start)
);

-- 3. Create monthly analytics cache table
CREATE TABLE monthly_analytics_cache (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month_start DATE NOT NULL, -- First day of month
  avg_calories NUMERIC DEFAULT 0,
  avg_protein NUMERIC DEFAULT 0,
  avg_carbs NUMERIC DEFAULT 0,
  avg_fat NUMERIC DEFAULT 0,
  days_with_data INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, month_start)
);

-- 4. Create indexes for better query performance
CREATE INDEX idx_daily_analytics_date ON daily_analytics_cache(date);
CREATE INDEX idx_weekly_analytics_week ON weekly_analytics_cache(week_start);
CREATE INDEX idx_monthly_analytics_month ON monthly_analytics_cache(month_start);

-- 5. Enable RLS (Row Level Security) for multi-user support
ALTER TABLE daily_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_analytics_cache ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies to ensure users only see their own data
CREATE POLICY "Users can view their own daily analytics" ON daily_analytics_cache
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly analytics" ON weekly_analytics_cache
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly analytics" ON monthly_analytics_cache
  FOR ALL USING (auth.uid() = user_id);

-- 7. Create trigger function to update analytics cache
CREATE OR REPLACE FUNCTION update_analytics_cache()
RETURNS TRIGGER AS $$
DECLARE
  affected_date DATE;
  affected_week DATE;
  affected_month DATE;
  target_user_id UUID;
BEGIN
  -- Determine which date/user was affected
  IF TG_OP = 'DELETE' THEN
    affected_date := OLD.eaten_on;
    target_user_id := OLD.user_id;
  ELSE
    affected_date := NEW.eaten_on;
    target_user_id := NEW.user_id;
  END IF;

  -- Calculate week start (Monday) and month start
  affected_week := DATE_TRUNC('week', affected_date)::DATE;
  affected_month := DATE_TRUNC('month', affected_date)::DATE;

  -- 1. Update DAILY cache for the affected date
  INSERT INTO daily_analytics_cache (user_id, date, calories, protein, carbs, fat, meals_count)
  SELECT
    target_user_id,
    affected_date,
    COALESCE(SUM((macros->>'calories')::numeric), 0),
    COALESCE(SUM((macros->>'protein')::numeric), 0),
    COALESCE(SUM((macros->>'carbs')::numeric), 0),
    COALESCE(SUM((macros->>'fat')::numeric), 0),
    COUNT(*)
  FROM meal_logs
  WHERE user_id = target_user_id AND eaten_on = affected_date
  ON CONFLICT (user_id, date) DO UPDATE SET
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    meals_count = EXCLUDED.meals_count,
    updated_at = NOW();

  -- If no meals left for this date, remove the daily cache entry
  IF NOT EXISTS (SELECT 1 FROM meal_logs WHERE user_id = target_user_id AND eaten_on = affected_date) THEN
    DELETE FROM daily_analytics_cache WHERE user_id = target_user_id AND date = affected_date;
  END IF;

  -- 2. Update WEEKLY cache for the affected week
  INSERT INTO weekly_analytics_cache (user_id, week_start, avg_calories, avg_protein, avg_carbs, avg_fat, days_with_data)
  SELECT
    target_user_id,
    affected_week,
    COALESCE(AVG(calories), 0),
    COALESCE(AVG(protein), 0),
    COALESCE(AVG(carbs), 0),
    COALESCE(AVG(fat), 0),
    COUNT(*)
  FROM daily_analytics_cache
  WHERE user_id = target_user_id
    AND date >= affected_week
    AND date < affected_week + INTERVAL '7 days'
  ON CONFLICT (user_id, week_start) DO UPDATE SET
    avg_calories = EXCLUDED.avg_calories,
    avg_protein = EXCLUDED.avg_protein,
    avg_carbs = EXCLUDED.avg_carbs,
    avg_fat = EXCLUDED.avg_fat,
    days_with_data = EXCLUDED.days_with_data,
    updated_at = NOW();

  -- Remove weekly cache if no daily data exists for this week
  IF NOT EXISTS (
    SELECT 1 FROM daily_analytics_cache
    WHERE user_id = target_user_id
      AND date >= affected_week
      AND date < affected_week + INTERVAL '7 days'
  ) THEN
    DELETE FROM weekly_analytics_cache WHERE user_id = target_user_id AND week_start = affected_week;
  END IF;

  -- 3. Update MONTHLY cache for the affected month
  INSERT INTO monthly_analytics_cache (user_id, month_start, avg_calories, avg_protein, avg_carbs, avg_fat, days_with_data)
  SELECT
    target_user_id,
    affected_month,
    COALESCE(AVG(calories), 0),
    COALESCE(AVG(protein), 0),
    COALESCE(AVG(carbs), 0),
    COALESCE(AVG(fat), 0),
    COUNT(*)
  FROM daily_analytics_cache
  WHERE user_id = target_user_id
    AND date >= affected_month
    AND date < affected_month + INTERVAL '1 month'
  ON CONFLICT (user_id, month_start) DO UPDATE SET
    avg_calories = EXCLUDED.avg_calories,
    avg_protein = EXCLUDED.avg_protein,
    avg_carbs = EXCLUDED.avg_carbs,
    avg_fat = EXCLUDED.avg_fat,
    days_with_data = EXCLUDED.days_with_data,
    updated_at = NOW();

  -- Remove monthly cache if no daily data exists for this month
  IF NOT EXISTS (
    SELECT 1 FROM daily_analytics_cache
    WHERE user_id = target_user_id
      AND date >= affected_month
      AND date < affected_month + INTERVAL '1 month'
  ) THEN
    DELETE FROM monthly_analytics_cache WHERE user_id = target_user_id AND month_start = affected_month;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create the trigger on meal_logs table
CREATE TRIGGER trigger_update_analytics_cache
  AFTER INSERT OR UPDATE OR DELETE ON meal_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_cache();

-- 9. Create RPC function to get analytics data (simplified - recent periods queried directly)
CREATE OR REPLACE FUNCTION get_analytics_data(p_days_back INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Build simplified analytics JSON with only aggregated data
  -- Note: recent_days, recent_weeks, recent_months are queried directly from frontend
  SELECT jsonb_build_object(
    'daily_averages', (
      SELECT jsonb_build_object(
        'calories', COALESCE(ROUND(AVG(calories), 0), 0),
        'protein', COALESCE(ROUND(AVG(protein), 0), 0),
        'carbs', COALESCE(ROUND(AVG(carbs), 0), 0),
        'fat', COALESCE(ROUND(AVG(fat), 0), 0),
        'days_count', COUNT(*)
      )
      FROM daily_analytics_cache
      WHERE user_id = current_user_id
        AND date >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    ),

    'weekly_averages', (
      SELECT jsonb_build_object(
        'calories', COALESCE(ROUND(AVG(avg_calories), 0), 0),
        'protein', COALESCE(ROUND(AVG(avg_protein), 0), 0),
        'carbs', COALESCE(ROUND(AVG(avg_carbs), 0), 0),
        'fat', COALESCE(ROUND(AVG(avg_fat), 0), 0),
        'weeks_count', COUNT(*)
      )
      FROM weekly_analytics_cache
      WHERE user_id = current_user_id
        AND week_start >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '1 day' * p_days_back)
    ),

    'monthly_averages', (
      SELECT jsonb_build_object(
        'calories', COALESCE(ROUND(AVG(avg_calories), 0), 0),
        'protein', COALESCE(ROUND(AVG(avg_protein), 0), 0),
        'carbs', COALESCE(ROUND(AVG(avg_carbs), 0), 0),
        'fat', COALESCE(ROUND(AVG(avg_fat), 0), 0),
        'months_count', COUNT(*)
      )
      FROM monthly_analytics_cache
      WHERE user_id = current_user_id
        AND month_start >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 day' * p_days_back)
    ),

    'calorie_extremes', (
      SELECT jsonb_build_object(
        'highest', (
          SELECT jsonb_build_object(
            'date', date,
            'calories', ROUND(calories, 0)
          )
          FROM daily_analytics_cache
          WHERE user_id = current_user_id
          ORDER BY calories DESC
          LIMIT 1
        ),
        'lowest', (
          SELECT jsonb_build_object(
            'date', date,
            'calories', ROUND(calories, 0)
          )
          FROM daily_analytics_cache
          WHERE user_id = current_user_id
          ORDER BY calories ASC
          LIMIT 1
        )
      )
    ),

    'summary', (
      SELECT jsonb_build_object(
        'total_meals', (
          SELECT COALESCE(SUM(meals_count), 0)
          FROM daily_analytics_cache
          WHERE user_id = current_user_id
        ),
        'days_with_data', (
          SELECT COUNT(*)
          FROM daily_analytics_cache
          WHERE user_id = current_user_id
        )
      )
    )

  ) INTO result;

  RETURN result;
END;
$$;