-- Reference tables from IGDB
CREATE TABLE platforms (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE genres (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE game_modes (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE types (
    id BIGINT PRIMARY KEY,
    type TEXT NOT NULL
);

CREATE TABLE website_types (
    id BIGINT PRIMARY KEY,
    type TEXT NOT NULL
);

-- Main game table
CREATE TABLE games (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    summary TEXT,
    storyline TEXT,
    first_release_date BIGINT,
    created_at BIGINT,
    total_rating DECIMAL(5,2),
    involved_companies TEXT,
    keywords TEXT,
    similar_games BIGINT[],
    updated_at TIMESTAMP DEFAULT now()
);

-- Covers table (one-to-one with games)
CREATE TABLE covers (
    id BIGINT PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE UNIQUE,
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER
);

-- Screenshots table (many-to-one with games)
CREATE TABLE screenshots (
    id BIGINT PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER
);

-- Websites table (many-to-one with games)
CREATE TABLE websites (
    id BIGINT PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    trusted BOOLEAN,
    type_id BIGINT REFERENCES website_types(id)
);

-- Game to platforms table (many-to-many with games and platforms)
CREATE TABLE game_to_platforms (
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    platform_id BIGINT REFERENCES platforms(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, platform_id)
);

-- Game to genres table (many-to-many with games and genres)
CREATE TABLE game_to_genres (
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    genre_id BIGINT REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, genre_id)
);

-- Game to modes table (many-to-many with games and modes)
CREATE TABLE game_to_modes (
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    mode_id BIGINT REFERENCES game_modes(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, mode_id)
);

-- Game to types table (many-to-many with games and types)
CREATE TABLE game_to_types (
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    type_id BIGINT REFERENCES types(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, type_id)
);

-- Custom tables based on diagram-flow.md
CREATE TYPE game_status AS ENUM (
    'finished',
    'playing',
    'dropped',
    'online',
    'want_to_play',
    'backlog'
);

CREATE TYPE game_source AS ENUM (
    'steam',
    'gog',
    'manual'
);

CREATE TABLE user_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    game_id BIGINT REFERENCES games(id),
    status game_status NOT NULL,
    rating INTEGER CHECK (rating >= 0 AND rating <= 10),
    review TEXT,
    platform_id BIGINT REFERENCES platforms(id),
    source game_source NOT NULL,
    playtime_minutes INTEGER DEFAULT 0,
    achievements_total INTEGER DEFAULT 0,
    achievements_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, game_id)
);

-- Platform connections
CREATE TABLE user_platform_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    platform_name TEXT NOT NULL,
    platform_user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, platform_name)
);

CREATE TABLE ignored_platform_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    platform_name TEXT NOT NULL,
    platform_game_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, platform_name, platform_game_id)
);

-- Indexes for better query performance
CREATE INDEX idx_games_name ON games(name);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_websites_game_id ON websites(game_id);
CREATE INDEX idx_user_games_user_id ON user_games(user_id);
CREATE INDEX idx_user_games_status ON user_games(status);
CREATE INDEX idx_user_games_game_id ON user_games(game_id);
CREATE INDEX idx_game_to_platforms_game_id ON game_to_platforms(game_id);
CREATE INDEX idx_game_to_genres_game_id ON game_to_genres(game_id);
CREATE INDEX idx_screenshots_game_id ON screenshots(game_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ignored_platform_games ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can manage their own games" ON user_games
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own platform connections" ON user_platform_connections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their ignored games" ON ignored_platform_games
    FOR ALL USING (auth.uid() = user_id);

-- Reference tables are publicly readable
CREATE POLICY "Reference tables are publicly readable" ON platforms
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON genres
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON game_modes
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON types
    FOR SELECT USING (true);

CREATE POLICY "Reference tables are publicly readable" ON website_types
    FOR SELECT USING (true);

-- Games and related tables are publicly readable
CREATE POLICY "Games are publicly readable" ON games
    FOR SELECT USING (true);

CREATE POLICY "Games can be inserted from IGDB" ON games
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Games can be updated from IGDB" ON games
    FOR UPDATE USING (true);

CREATE POLICY "Game platforms are publicly readable" ON game_to_platforms
    FOR SELECT USING (true);

CREATE POLICY "Game platforms can be inserted" ON game_to_platforms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Game genres are publicly readable" ON game_to_genres
    FOR SELECT USING (true);

CREATE POLICY "Game genres can be inserted" ON game_to_genres
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Game modes are publicly readable" ON game_to_modes
    FOR SELECT USING (true);

CREATE POLICY "Game modes can be inserted" ON game_to_modes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Game types are publicly readable" ON game_to_types
    FOR SELECT USING (true);

CREATE POLICY "Game types can be inserted" ON game_to_types
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Game websites are publicly readable" ON websites
    FOR SELECT USING (true);

CREATE POLICY "Game websites can be inserted" ON websites
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Game websites can be updated" ON websites
    FOR UPDATE USING (true);

CREATE POLICY "Screenshots are publicly readable" ON screenshots
    FOR SELECT USING (true);

CREATE POLICY "Screenshots can be inserted" ON screenshots
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Screenshots can be updated" ON screenshots
    FOR UPDATE USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-images', 'game-images', true);

-- Set up storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() = owner AND
  (LOWER(storage.extension(name)) = 'png' OR
   LOWER(storage.extension(name)) = 'jpg' OR
   LOWER(storage.extension(name)) = 'jpeg' OR
   LOWER(storage.extension(name)) = 'gif' OR
   LOWER(storage.extension(name)) = 'webp')
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Set up storage policies for game-images
CREATE POLICY "Game images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'game-images');

CREATE POLICY "Authenticated users can upload game images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL AND
  (LOWER(storage.extension(name)) = 'png' OR
   LOWER(storage.extension(name)) = 'jpg' OR
   LOWER(storage.extension(name)) = 'jpeg' OR
   LOWER(storage.extension(name)) = 'gif' OR
   LOWER(storage.extension(name)) = 'webp')
);

CREATE POLICY "Authenticated users can update game images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete game images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'game-images' AND
  auth.uid() IS NOT NULL
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshots ENABLE ROW LEVEL SECURITY;

-- Create the function
create or replace function public.get_user_by_username(p_username text)
returns json
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_result json;
begin
  -- Get the user metadata
  select json_build_object(
    'id', au.id,
    'full_name', au.raw_user_meta_data->>'full_name',
    'avatar_url', au.raw_user_meta_data->>'avatar_url',
    'username', au.raw_user_meta_data->>'username'
  )
  into v_result
  from auth.users au
  where (au.raw_user_meta_data->>'username')::text = p_username;

  -- Return the result (will be null if no user found)
  return v_result;
end;
$$;