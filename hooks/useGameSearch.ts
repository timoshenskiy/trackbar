import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GameSearchResult } from "@/utils/types/game";

interface UseGameSearchProps {
  query: string;
  token: string;
  enabled?: boolean;
}

export const useGameSearch = ({
  query,
  token,
  enabled = true,
}: UseGameSearchProps) => {
  return useQuery<GameSearchResult[]>({
    queryKey: ["gameSearch", query],
    queryFn: async () => {
      if (!query || !token) {
        return [];
      }

      const response = await axios.get("/api/search", {
        params: {
          q: query,
          token,
        },
      });

      return response.data;
    },
    enabled: enabled && !!query && !!token,
    staleTime: 1000 * 60 * 5, // Consider results stale after 5 minutes
    gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
  });
};
