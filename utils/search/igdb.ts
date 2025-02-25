/**
 * Handles game search operations through the IGDB API.
 * Fetches game data with specified fields and transforms it to the unified format.
 */

import { GameSearchResult } from "../redis";
import { getIGDBToken } from "../igdb/token";

// Define interfaces for IGDB API response types
interface IGDBWebsite {
  id: number;
  type: string | { id: number; type: string };
  url: string;
  trusted: boolean;
}

interface IGDBGameResponse {
  id: number;
  name: string;
  slug: string;
  created_at?: number;
  first_release_date?: number;
  total_rating?: number;
  summary?: string;
  storyline?: string;
  url?: string;
  cover?: {
    id: number;
    url: string;
    width?: number;
    height?: number;
  };
  screenshots?: Array<{
    id: number;
    url: string;
    width?: number;
    height?: number;
  }>;
  genres?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  game_modes?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  websites?: IGDBWebsite[];
  involved_companies?: Array<{
    id: number;
    company: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  game_type?: {
    id: number;
    type: string;
  };
  similar_games?: number[];
  keywords?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export const searchIGDB = async (
  query: string
): Promise<GameSearchResult[]> => {
  try {
    console.log("Searching IGDB for:", query);

    // Get the token from our server-side utility
    const accessToken = await getIGDBToken();

    const url = "https://api.igdb.com/v4/games";
    const headers = {
      "Client-ID": process.env.TWITCH_CLIENT_ID ?? "",
      Authorization: accessToken,
      "Content-Type": "text/plain",
    };

    const body = `
      search "${query}";
      fields id, name, slug, created_at, genres.name, genres.slug, 
             platforms.name, platforms.slug, first_release_date, keywords.name,
             cover.url, cover.width, cover.height, screenshots.url, screenshots.width, screenshots.height,
             websites.type.id, websites.type.type, websites.url, websites.trusted, 
             game_modes.name, game_modes.slug, total_rating, similar_games, storyline, summary,
             url, involved_companies.company.name, involved_companies.company.slug,
             game_type.id, game_type.type;
      limit 10;
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as IGDBGameResponse[];
    console.log("IGDB response:", data);

    // Transform the data to match the GameSearchResult type
    return data.map((game: IGDBGameResponse) => {
      // Process websites to ensure they match the expected format
      const websites = game.websites?.map((website: IGDBWebsite) => ({
        id: website.id,
        type:
          typeof website.type === "object" ? website.type.type : website.type,
        url: website.url,
        trusted: website.trusted,
      }));

      return {
        ...game,
        websites,
        game_types: game.game_type
          ? [
              {
                id: game.game_type.id,
                type: game.game_type.type,
              },
            ]
          : undefined,
      };
    });
  } catch (error) {
    console.error("IGDB search error:", error);
    return [];
  }
};
