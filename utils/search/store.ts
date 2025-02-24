/**
 * Handles storing IGDB search results into PostgreSQL database.
 * Manages data persistence for games and their related entities (genres, platforms, screenshots, etc.).
 */

import { createClient } from "@/utils/supabase/server";
import { GameSearchResult } from "../types/game";

export const storeIGDBResults = async (games: GameSearchResult[]) => {
  const supabase = await createClient();

  for (const game of games) {
    // Store main game data
    const { error } = await supabase.from("games").upsert(
      {
        id: game.id,
        name: game.name,
        slug: game.slug,
        cover_url: game.cover?.url,
        cover_width: game.cover?.width || null,
        cover_height: game.cover?.height || null,
        first_release_date: game.first_release_date
          ? new Date(game.first_release_date * 1000)
          : null,
        total_rating: game.total_rating || null,
        summary: game.summary || null,
        storyline: game.storyline || null,
        url: game.url || null,
        updated_at: new Date(),
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error(`Error storing game ${game.id} in PostgreSQL:`, error);
    } else {
      // If game was stored successfully, store its relationships
      if (game.genres && game.genres.length > 0) {
        const { error: genresError } = await supabase
          .from("game_to_genres")
          .upsert(
            game.genres.map((genre) => ({
              game_id: game.id,
              genre_id: genre.id,
            }))
          );
        if (genresError) {
          console.error(
            `Error storing genres for game ${game.id}:`,
            genresError
          );
        }
      }

      if (game.platforms && game.platforms.length > 0) {
        const { error: platformsError } = await supabase
          .from("game_to_platforms")
          .upsert(
            game.platforms.map((platform) => ({
              game_id: game.id,
              platform_id: platform.id,
            }))
          );
        if (platformsError) {
          console.error(
            `Error storing platforms for game ${game.id}:`,
            platformsError
          );
        }
      }

      if (game.screenshots && game.screenshots.length > 0) {
        // First, get the current max id for screenshots
        const { data: maxIdResult } = await supabase
          .from("game_screenshots")
          .select("id")
          .order("id", { ascending: false })
          .limit(1);

        const startId = (maxIdResult?.[0]?.id || 0) + 1;

        const { error: screenshotsError } = await supabase
          .from("game_screenshots")
          .upsert(
            game.screenshots.map((screenshot, index) => ({
              id: startId + index, // Generate unique IDs
              game_id: game.id,
              url: screenshot.url,
              width: screenshot.width || null,
              height: screenshot.height || null,
            }))
          );
        if (screenshotsError) {
          console.error(
            `Error storing screenshots for game ${game.id}:`,
            screenshotsError
          );
        }
      }

      if (game.websites && game.websites.length > 0) {
        // First, get the current max id for websites
        const { data: maxIdResult } = await supabase
          .from("game_websites")
          .select("id")
          .order("id", { ascending: false })
          .limit(1);

        const startId = (maxIdResult?.[0]?.id || 0) + 1;

        const { error: websitesError } = await supabase
          .from("game_websites")
          .upsert(
            game.websites.map((website, index) => ({
              id: startId + index, // Generate unique IDs
              game_id: game.id,
              website_type_id: website.type.id,
              url: website.url,
              trusted: website.trusted,
            }))
          );
        if (websitesError) {
          console.error(
            `Error storing websites for game ${game.id}:`,
            websitesError
          );
        }
      }
    }
  }
};
