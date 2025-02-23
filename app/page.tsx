"use client";

import { useQuery } from '@tanstack/react-query';
import { Gamepad2, Clock } from "lucide-react";
import { igdbAdapter } from '@/adapters/igdb';
// import MainBanner from "@/components/MainBanner";
import ProductFeatures from "@/components/ProductFeatures";
import GameSlider from '@/components/main/game-slider';
// import GameSlider from "@/modules/Game/components/GameSlider";
// import Footer from "@/components/Footer";

export default function Home() {
  const { data: token, error: tokenError } = useQuery({
    queryKey: ['accessToken'],
    queryFn: igdbAdapter.getAccessToken,
    retry: 2,
  });

  const { 
    data: lastReleasedGames, 
    error: lastReleasedError,
    isLoading: isLoadingLastReleased 
  } = useQuery({
    queryKey: ['lastReleasedGames', token],
    queryFn: () => igdbAdapter.getLatestGames(token!),
    enabled: !!token,
    retry: 1,
  });

  const { 
    data: upcomingGames, 
    error: upcomingError,
    isLoading: isLoadingUpcoming 
  } = useQuery({
    queryKey: ['upcomingGames', token],
    queryFn: () => igdbAdapter.getUpcomingGames(token!),
    enabled: !!token,
    retry: 1,
  });

  if (tokenError) {
    console.error('Token error:', tokenError);
    // Handle token error UI
  }

  console.log(upcomingGames, lastReleasedGames);

  return (
    <div className="space-y-8">
      {/* <MainBanner /> */}
      <ProductFeatures />
      <GameSlider
        games={lastReleasedGames || []}
        title="Last Released Games"
        icon={<Gamepad2 className="w-6 h-6 text-white" />}
        visibleCount={3}
      />
      <GameSlider 
        games={upcomingGames || []} 
        direction="left"
        title="Upcoming Games"
        icon={<Clock className="w-6 h-6 text-white" />}
        visibleCount={4}
      />
      {/* <Footer /> */}
    </div>
  );
}
