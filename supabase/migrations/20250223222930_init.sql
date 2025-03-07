-- Reference tables from IGDB
CREATE TABLE platforms (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE genres (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE game_modes (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

CREATE TABLE types (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    type TEXT NOT NULL
);

CREATE TABLE website_types (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    type TEXT NOT NULL
);

-- Main game table
CREATE TABLE games (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    summary TEXT,
    storyline TEXT,
    first_release_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    total_rating DECIMAL(5,2),
    involved_companies TEXT,
    keywords TEXT,
    similar_games BIGINT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_popular BOOLEAN DEFAULT false
);

-- Covers table (one-to-one with games)
CREATE TABLE covers (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE UNIQUE,
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER
);

-- Screenshots table (many-to-one with games)
CREATE TABLE screenshots (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    game_id BIGINT REFERENCES games(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER
);

-- Websites table (many-to-one with games)
CREATE TABLE websites (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
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
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
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
CREATE INDEX idx_game_to_genres_genre_id ON public.game_to_genres(genre_id);
CREATE INDEX idx_game_to_modes_game_id ON public.game_to_modes(game_id);
CREATE INDEX idx_game_to_modes_mode_id ON public.game_to_modes(mode_id);
CREATE INDEX idx_game_to_platforms_platform_id ON public.game_to_platforms(platform_id);
CREATE INDEX idx_game_to_types_game_id ON public.game_to_types(game_id);
CREATE INDEX idx_game_to_types_type_id ON public.game_to_types(type_id);
CREATE INDEX idx_ignored_platform_games_user_id ON public.ignored_platform_games(user_id);
CREATE INDEX idx_user_games_platform_id ON public.user_games(platform_id);
CREATE INDEX idx_user_platform_connections_user_id ON public.user_platform_connections(user_id);
CREATE INDEX idx_websites_type_id ON public.websites(type_id);
CREATE INDEX idx_game_to_genres_game_id ON public.game_to_genres(game_id);
CREATE INDEX idx_game_to_platforms_game_id ON public.game_to_platforms(game_id);
CREATE INDEX idx_screenshots_game_id ON public.screenshots(game_id);
CREATE INDEX idx_user_games_game_id ON public.user_games(game_id);
CREATE INDEX idx_user_games_user_id ON public.user_games(user_id);
CREATE INDEX idx_websites_game_id ON public.websites(game_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ignored_platform_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_to_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_to_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_to_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_to_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_types ENABLE ROW LEVEL SECURITY;

-- Update the RLS policy for user_games to allow public read access
DROP POLICY IF EXISTS "Users can manage their own games" ON user_games;

-- Allow anyone to read user games
CREATE POLICY "Anyone can read user games" ON user_games
    FOR SELECT USING (true);

-- Allow users to manage only their own games for write operations
CREATE POLICY "Users can insert their own games" ON user_games
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own games" ON user_games
    FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own games" ON user_games
    FOR DELETE USING ((select auth.uid()) = user_id);

-- Users can only manage their own platform connections
CREATE POLICY "Users can manage their own platform connections" ON user_platform_connections
    FOR ALL USING ((select auth.uid()) = user_id);

-- Users can only manage their ignored games
CREATE POLICY "Users can manage their ignored games" ON ignored_platform_games
    FOR ALL USING ((select auth.uid()) = user_id);

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
