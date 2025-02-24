"use client";

import { useQuery } from '@tanstack/react-query';
import { Gamepad2, Clock } from "lucide-react";
import { igdbAdapter } from '@/adapters/igdb';
import Banner from "@/components/main/banner";
import ProductFeatures from "@/components/main/product-features";
import GameSlider from '@/components/main/game-slider';
import Footer from "@/components/main/footer";
import Header from '@/components/main/header';

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

  console.log(lastReleasedGames)

  return (
    <div className="space-y-8">
      <Header />
      <Banner />
      <ProductFeatures />
      <GameSlider
        games={lastReleasedGames || []}
        title="Last Released Games"
        icon={<Gamepad2 className="w-6 h-6 text-white" />}
        visibleCount={2}
      />
      <GameSlider 
        games={upcomingGames || []} 
        direction="left"
        title="Upcoming Games"
        icon={<Clock className="w-6 h-6 text-white" />}
        visibleCount={3}
      />
      <Footer />
    </div>
  );
}
