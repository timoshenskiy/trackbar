import { axiosInstance } from "@/services/store";

export const apiGetAccessToken = async () => {
  const response = await axiosInstance.post("/api/igdb/token");
  return response.data.access_token;
};

export const apiGetLatestGames = async (accessToken: string) => {
  if (!accessToken?.startsWith('Bearer ')) {
    throw new Error('Invalid token format');
  }
  const response = await axiosInstance.post("/api/igdb/games", {
    endpoint: 'games',
    accessToken,
    data: `fields name, cover.url, first_release_date, rating, total_rating, summary, 
                  genres.name, platforms.name, screenshots.url, videos.video_id, 
                  involved_companies.company.name;
           sort first_release_date desc;
           where first_release_date < ${Math.floor(Date.now() / 1000)};
           limit 30;`
  });

  return response.data;
};

export const apiGetUpcomingGames = async (accessToken: string) => {
  if (!accessToken?.startsWith('Bearer ')) {
    throw new Error('Invalid token format');
  }
  const response = await axiosInstance.post("/api/igdb/games", {
    endpoint: 'games',
    accessToken,
    data: `fields name, cover.url, first_release_date, summary, 
                  genres.name, platforms.name, screenshots.url, videos.video_id, 
                  involved_companies.company.name;
           sort first_release_date asc;
           where first_release_date > ${Math.floor(Date.now() / 1000)};
           limit 30;`
  });

  return response.data;
};
