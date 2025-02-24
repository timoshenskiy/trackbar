import { Game } from '@/types/game';

export async function getGameById(id: string): Promise<Game> {
  const response = await fetch(`http://localhost:3000/api/game?id=${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch game: ${response.statusText}`);
  }

  const game = await response.json();

  if (!game) {
    throw new Error(`Game with id ${id} not found`);
  }

  return {
    ...game,
    rating: game.rating || 0,
    lists: game.lists || 0,
    reviews: game.reviews || 0,
    involved_companies: game.involved_companies || [],
    platforms: game.platforms || [],
    genres: game.genres || [],
    videos: game.videos || [],
    screenshots: game.screenshots || [],
  };
}
