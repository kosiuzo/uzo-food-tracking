-- Migration: Add eaten_on date column to meal_logs table
-- This allows users to specify which date they actually consumed the meal
-- Separate from created_at which tracks when the log entry was created

-- Add the eaten_on column (nullable initially for safe migration)
ALTER TABLE meal_logs
ADD COLUMN eaten_on DATE;

-- Backfill existing records: set eaten_on to the date portion of created_at
UPDATE meal_logs
SET eaten_on = created_at::DATE
WHERE eaten_on IS NULL;

-- Now make the column NOT NULL since all records have values
ALTER TABLE meal_logs
ALTER COLUMN eaten_on SET NOT NULL;

-- Add index for efficient date filtering (this will be heavily queried)
CREATE INDEX idx_meal_logs_eaten_on ON meal_logs(eaten_on);

-- Add a check constraint to ensure eaten_on is not in the future beyond reasonable limits
-- Allow up to 1 day in the future to handle timezone edge cases
ALTER TABLE meal_logs
ADD CONSTRAINT meal_logs_eaten_on_reasonable
CHECK (eaten_on <= CURRENT_DATE + INTERVAL '1 day');