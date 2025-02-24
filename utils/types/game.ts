import { Database } from "@/types_db";

type Tables = Database["public"]["Tables"];

export interface GameGenre {
  id: number;
  name: string;
  slug: string;
}

export interface GamePlatform {
  id: number;
  name: string;
  slug: string;
}

export interface GameScreenshot {
  url: string;
  width: number;
  height: number;
}

export interface GameWebsite {
  type: {
    id: number | null;
    type: string;
  };
  url: string;
  trusted: boolean | null;
}

export interface GameCompany {
  company: {
    name: string;
    slug: string;
  };
}

// Extended database type for games table with its relationships
export type DBGame = Tables["games"]["Row"] & {
  game_to_genres?: Array<{ genres: Tables["genres"]["Row"] }> | null;
  game_to_platforms?: Array<{ platforms: Tables["platforms"]["Row"] }> | null;
  game_screenshots?: Tables["game_screenshots"]["Row"][] | null;
  game_websites?: Tables["game_websites"]["Row"][] | null;
  game_modes?: Tables["game_modes"]["Row"][] | null;
  game_companies?: Tables["game_companies"]["Row"][] | null;
  keywords?: Array<{ name: string }> | null;
  similar_games?: number[] | null;
};

export interface GameSearchResult {
  id: number;
  name: string;
  slug: string;
  created_at: string | null;
  genres?: GameGenre[];
  platforms?: GamePlatform[];
  first_release_date?: number;
  keywords?: Array<{ name: string }>;
  cover?: {
    url: string;
    width: number;
    height: number;
  };
  screenshots?: GameScreenshot[];
  websites?: GameWebsite[];
  game_modes?: Array<{ name: string; slug: string }>;
  total_rating?: number;
  similar_games?: number[];
  storyline?: string;
  summary?: string;
  url?: string;
  involved_companies?: GameCompany[];
}
