-- Migration: Backfill analytics caches from existing meal_logs
-- Description: Populate daily, weekly, and monthly analytics caches using historical data

-- 0) Optional performance index for backfill and trigger lookups
-- If dataset is large, this helps queries like WHERE user_id = ? AND eaten_on = ?
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_eaten_on ON meal_logs(user_id, eaten_on);

-- 1) Backfill DAILY cache from meal_logs (idempotent)
INSERT INTO daily_analytics_cache (
  user_id, date, calories, protein, carbs, fat, meals_count, updated_at
)
SELECT
  ml.user_id,
  ml.eaten_on AS date,
  COALESCE(SUM((ml.macros->>'calories')::numeric), 0) AS calories,
  COALESCE(SUM((ml.macros->>'protein')::numeric), 0)  AS protein,
  COALESCE(SUM((ml.macros->>'carbs')::numeric), 0)    AS carbs,
  COALESCE(SUM((ml.macros->>'fat')::numeric), 0)      AS fat,
  COUNT(*)                                            AS meals_count,
  NOW()                                               AS updated_at
FROM meal_logs ml
GROUP BY ml.user_id, ml.eaten_on
ON CONFLICT (user_id, date) DO UPDATE SET
  calories    = EXCLUDED.calories,
  protein     = EXCLUDED.protein,
  carbs       = EXCLUDED.carbs,
  fat         = EXCLUDED.fat,
  meals_count = EXCLUDED.meals_count,
  updated_at  = NOW();

-- 2) Backfill WEEKLY cache from daily cache (idempotent)
INSERT INTO weekly_analytics_cache (
  user_id, week_start, avg_calories, avg_protein, avg_carbs, avg_fat, days_with_data, updated_at
)
SELECT
  d.user_id,
  DATE_TRUNC('week', d.date)::date AS week_start,
  COALESCE(AVG(d.calories), 0) AS avg_calories,
  COALESCE(AVG(d.protein),  0) AS avg_protein,
  COALESCE(AVG(d.carbs),    0) AS avg_carbs,
  COALESCE(AVG(d.fat),      0) AS avg_fat,
  COUNT(*)::int               AS days_with_data,
  NOW()                       AS updated_at
FROM daily_analytics_cache d
GROUP BY d.user_id, DATE_TRUNC('week', d.date)
ON CONFLICT (user_id, week_start) DO UPDATE SET
  avg_calories   = EXCLUDED.avg_calories,
  avg_protein    = EXCLUDED.avg_protein,
  avg_carbs      = EXCLUDED.avg_carbs,
  avg_fat        = EXCLUDED.avg_fat,
  days_with_data = EXCLUDED.days_with_data,
  updated_at     = NOW();

-- 3) Backfill MONTHLY cache from daily cache (idempotent)
INSERT INTO monthly_analytics_cache (
  user_id, month_start, avg_calories, avg_protein, avg_carbs, avg_fat, days_with_data, updated_at
)
SELECT
  d.user_id,
  DATE_TRUNC('month', d.date)::date AS month_start,
  COALESCE(AVG(d.calories), 0) AS avg_calories,
  COALESCE(AVG(d.protein),  0) AS avg_protein,
  COALESCE(AVG(d.carbs),    0) AS avg_carbs,
  COALESCE(AVG(d.fat),      0) AS avg_fat,
  COUNT(*)::int               AS days_with_data,
  NOW()                       AS updated_at
FROM daily_analytics_cache d
GROUP BY d.user_id, DATE_TRUNC('month', d.date)
ON CONFLICT (user_id, month_start) DO UPDATE SET
  avg_calories   = EXCLUDED.avg_calories,
  avg_protein    = EXCLUDED.avg_protein,
  avg_carbs      = EXCLUDED.avg_carbs,
  avg_fat        = EXCLUDED.avg_fat,
  days_with_data = EXCLUDED.days_with_data,
  updated_at     = NOW();
