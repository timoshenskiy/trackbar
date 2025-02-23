/**
 * API route handler for game search functionality.
 * Orchestrates search operations across IGDB API and local PostgreSQL database with Redis caching.
 */

import { NextResponse } from "next/server";
import { getGameSearchCache, setGameSearchCache } from "@/utils/redis";
import { searchPostgres } from "@/utils/search/postgres";
import { searchIGDB } from "@/utils/search/igdb";
import { storeIGDBResults } from "@/utils/search/store";
import { deduplicateGames } from "@/utils/search/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const accessToken = searchParams.get("token");

  console.log("Received search request:", {
    query,
    accessToken: accessToken?.substring(0, 10) + "...",
  });

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Check Redis cache
    console.log("Checking Redis cache...");
    const cachedResults = await getGameSearchCache(query);
    if (cachedResults) {
      console.log("Cache hit! Returning cached results");
      return NextResponse.json(cachedResults);
    }
    console.log("Cache miss, proceeding with search");

    // Step 2: Parallel search in PostgreSQL and IGDB
    console.log("Starting parallel search...");
    const [postgresResults, igdbResults] = await Promise.all([
      searchPostgres(query),
      searchIGDB(query, accessToken),
    ]);

    console.log("Search results:", {
      postgresResultsCount: postgresResults.length,
      igdbResultsCount: igdbResults.length,
    });

    // Step 3: Merge and deduplicate results
    const allResults = deduplicateGames([...postgresResults, ...igdbResults]);
    console.log("Total deduplicated results:", allResults.length);

    // Step 4: Cache the results
    await setGameSearchCache(query, allResults);

    // Step 5: Store IGDB results in PostgreSQL (background task)
    if (igdbResults.length > 0) {
      // This should be moved to a background job in production
      // Ideally it should be a queue system
      // TODO: Implement background job
      storeIGDBResults(igdbResults).catch((error) => {
        console.error("Error storing IGDB results:", error);
      });
    }

    return NextResponse.json(allResults);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching for games" },
      { status: 500 }
    );
  }
}
