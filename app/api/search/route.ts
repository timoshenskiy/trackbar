import { NextResponse, NextRequest } from "next/server";

interface GameData {
  name: string;
  summary?: string;
  storyline?: string;
  cover?: { url: string };
  genres?: { name: string }[];
  platforms?: { name: string }[];
  release_dates?: { human: string }[];
  age_ratings?: { rating: number; category: number }[];
  involved_companies?: {
    company: { name: string };
    developer: boolean;
    publisher: boolean;
  }[];
}

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "'name' parameter is required" },
      { status: 400 }
    );
  }

  if (!clientId || !accessToken) {
    return NextResponse.json(
      { error: "TWITCH credentials are not set" },
      { status: 500 }
    );
  }

  const url = "https://api.igdb.com/v4/games";
  const headers = {
    "Client-ID": process.env.TWITCH_CLIENT_ID ?? "",
    Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
  };
  //   const body = `
  //     search "${gameName}";
  //     fields name, summary, storyline, cover.url, genres.name, platforms.name,
  //            release_dates.human, age_ratings.rating, age_ratings.category,
  //            involved_companies.company.name, involved_companies.developer,
  //            involved_companies.publisher;
  //     expand cover, genres, platforms, release_dates, age_ratings,
  //            involved_companies.company;
  //     limit 1;
  //   `;
  const body = `
    search "${name}";
    fields *, name, slug, genres.name, platforms.name, first_release_date, release_dates.*, cover.*, screenshots.url, screenshots.width, screenshots.height,
              artworks.*, involved_companies.company.name,
              involved_companies.company.slug;
    limit 10;
  `;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as GameData[];

    if (data && data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "An error occurred while fetching game data" },
      { status: 500 }
    );
  }
}
