-- Add is_popular column to games table
ALTER TABLE games ADD COLUMN is_popular BOOLEAN DEFAULT false;

-- Create index for faster queries on popular games
CREATE INDEX idx_games_is_popular ON games(is_popular) WHERE is_popular = true; 