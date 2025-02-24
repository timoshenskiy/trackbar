/**
 * Handles game search operations in PostgreSQL database.
 * Includes data transformation from database schema to unified search result format.
 */

import { createClient } from "@/utils/supabase/server";
import { DBGame, GameSearchResult } from "../types/game";

export const searchPostgres = async (
  query: string
): Promise<GameSearchResult[]> => {
  const supabase = await createClient();
  console.log("Searching PostgreSQL for:", query);
  const { data: games, error } = await supabase
    .from("games")
    .select(
      `
      *,
      game_to_genres (
        genres (*)
      ),
      game_to_platforms (
        platforms (*)
      ),
      game_screenshots (*),
      game_websites (*),
      game_modes (*),
      game_companies (*)
    `
    )
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("PostgreSQL search error:", error);
    return [];
  }

  console.log("PostgreSQL results:", games);

  // Transform the data to match GameSearchResult interface
  return (games as unknown as DBGame[])
    .map((game): GameSearchResult | undefined => {
      try {
        return {
          id: game.id,
          name: game.name,
          slug: game.slug,
          created_at: game.created_at,
          genres:
            game.game_to_genres?.map((g) => ({
              id: g.genres.id,
              name: g.genres.name,
              slug: g.genres.slug,
            })) || undefined,
          platforms:
            game.game_to_platforms?.map((p) => ({
              id: p.platforms.id,
              name: p.platforms.name,
              slug: p.platforms.slug,
            })) || undefined,
          first_release_date: game.first_release_date
            ? Math.floor(new Date(game.first_release_date).getTime() / 1000)
            : undefined,
          keywords: game.keywords?.map((k) => ({ name: k.name })) || undefined,
          cover: game.cover_url
            ? {
                url: game.cover_url,
                width: game.cover_width || 0,
                height: game.cover_height || 0,
              }
            : undefined,
          screenshots:
            game.game_screenshots?.map((s) => ({
              url: s.url,
              width: s.width || 0,
              height: s.height || 0,
            })) || undefined,
          websites:
            game.game_websites?.map((w) => ({
              type: { id: w.website_type_id, type: "website" },
              url: w.url,
              trusted: w.trusted,
            })) || undefined,
          game_modes:
            game.game_modes?.map((m) => ({
              name: m.name,
              slug: m.slug,
            })) || undefined,
          total_rating: game.total_rating || undefined,
          similar_games: game.similar_games || undefined,
          storyline: game.storyline || undefined,
          summary: game.summary || undefined,
          url: game.url || undefined,
          involved_companies:
            game.game_companies?.map((c) => ({
              company: {
                name: c.company_name,
                slug: c.company_slug,
              },
            })) || undefined,
        };
      } catch (error) {
        console.error(`Error transforming game ${game.id}:`, error);
        return undefined;
      }
    })
    .filter((game): game is GameSearchResult => game !== undefined);
};
