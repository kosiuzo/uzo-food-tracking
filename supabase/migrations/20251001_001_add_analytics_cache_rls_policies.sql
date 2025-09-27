-- Add user-based RLS policies for analytics cache tables allowing ANON key access and user ownership
-- Following the same pattern as the main tables in 20250922_001_add_user_rls_policies.sql

-- Enable RLS on analytics cache tables
ALTER TABLE daily_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_analytics_cache ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anon and owner access to daily_analytics_cache" ON daily_analytics_cache;
DROP POLICY IF EXISTS "Allow anon and owner access to weekly_analytics_cache" ON weekly_analytics_cache;
DROP POLICY IF EXISTS "Allow anon and owner access to monthly_analytics_cache" ON monthly_analytics_cache;

-- Create RLS policies allowing ANON key access and user ownership for analytics cache tables
CREATE POLICY "Allow anon and owner access to daily_analytics_cache" ON daily_analytics_cache
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner access to weekly_analytics_cache" ON weekly_analytics_cache
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner access to monthly_analytics_cache" ON monthly_analytics_cache
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

-- Add indexes for user_id columns for better performance
CREATE INDEX IF NOT EXISTS idx_daily_analytics_cache_user_id ON daily_analytics_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_analytics_cache_user_id ON weekly_analytics_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_cache_user_id ON monthly_analytics_cache(user_id);