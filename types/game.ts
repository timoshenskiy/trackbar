export interface Game {
  id: number;
  title: string;
  status: "Playing" | "Completed" | "Backlog" | "Dropped";
  rating: number | null;
  platform: string;
  playtime: number;
}
