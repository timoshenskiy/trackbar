/**
 * Handles game search operations through the IGDB API.
 * Fetches game data with specified fields and transforms it to the unified format.
 */

import { GameSearchResult } from "../types/game";

export const searchIGDB = async (
  query: string,
  accessToken: string
): Promise<GameSearchResult[]> => {
  try {
    console.log("Searching IGDB for:", query);

    const url = "https://api.igdb.com/v4/games";
    const headers = {
      "Client-ID": process.env.TWITCH_CLIENT_ID ?? "",
      Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
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

    const data = await response.json();
    console.log("IGDB response:", data);
    return data.map((game: any) => ({
      ...game,
      game_types: game.game_type
        ? [
            {
              id: game.game_type.id,
              type: game.game_type.type,
            },
          ]
        : undefined,
    }));
  } catch (error) {
    console.error("IGDB search error:", error);
    return [];
  }
};
