import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { GameSearchResult } from "@/utils/redis";

// Helper function to get games that need updating
const getOutdatedGames = async () => {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: games, error } = await supabase
    .from("games")
    .select("id")
    .lt("updated_at", thirtyDaysAgo.toISOString())
    .limit(100); // Process in batches

  if (error) {
    console.error("Error fetching outdated games:", error);
    return [];
  }

  return games;
};

// Helper function to fetch updated game data from IGDB
const fetchGameUpdates = async (gameIds: number[], accessToken: string) => {
  try {
    const response = await axios.post("/api/igdb/games", {
      endpoint: "games",
      accessToken,
      data: `
        fields name, cover.url, first_release_date, rating, total_rating, summary,
               genres.name, platforms.name, screenshots.url, videos.video_id,
               involved_companies.company.name;
        where id = (${gameIds.join(",")});
      `,
    });

    return response.data as GameSearchResult[];
  } catch (error) {
    console.error("Error fetching game updates from IGDB:", error);
    return [];
  }
};

// Helper function to update games in PostgreSQL
const updateGamesInDatabase = async (games: GameSearchResult[]) => {
  const supabase = await createClient();

  for (const game of games) {
    const { error } = await supabase.from("games").upsert(
      {
        id: game.id,
        name: game.name,
        cover_url: game.cover?.url,
        first_release_date: game.first_release_date
          ? new Date(game.first_release_date * 1000)
          : null,
        total_rating: game.total_rating,
        summary: game.summary,
        updated_at: new Date(),
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error(`Error updating game ${game.id}:`, error);
    }
  }
};

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // Get games that need updating
    const outdatedGames = await getOutdatedGames();
    if (outdatedGames.length === 0) {
      return NextResponse.json({ message: "No games need updating" });
    }

    // Fetch updates from IGDB
    const gameIds = outdatedGames.map((game) => game.id);
    const updatedGames = await fetchGameUpdates(gameIds, accessToken);
    if (updatedGames.length === 0) {
      return NextResponse.json({ message: "No updates available from IGDB" });
    }

    // Update games in database
    await updateGamesInDatabase(updatedGames);

    return NextResponse.json({
      message: `Updated ${updatedGames.length} games`,
      updatedGames: updatedGames.map((g) => g.id),
    });
  } catch (error) {
    console.error("Game update error:", error);
    return NextResponse.json(
      { error: "Failed to update games" },
      { status: 500 }
    );
  }
}
