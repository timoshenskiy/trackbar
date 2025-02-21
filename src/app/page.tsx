"use client";

import GameSlider from "@/modules/Game/components/GameSlider";
import { gameInfoSelector } from "@/modules/Game/services/info";
import { getAccessToken, getLastReleasedGames, getUpcomingGames } from "@/modules/Game/services/info/actions";
import { useAppDispatch, useAppSelector } from "@/services/hooks";
import React, { useEffect } from "react";
import { Gamepad2, Clock } from "lucide-react";
import MainBanner from "@/components/MainBanner";
import Footer from "@/components/Footer";
import ProductBenefits from "@/components/ProductBenefits";

const Home = () => {

  const {
    lastReleasedGames: { data: lastReleasedGames },
    upcomingGames: { data: upcomingGames },
    accessToken: { data: token },
  } = useAppSelector(gameInfoSelector);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(getLastReleasedGames(token));
      dispatch(getUpcomingGames(token));
    }
  }, [token, dispatch]);

  return (
    <main>
      <MainBanner />
      <ProductBenefits />
      <GameSlider 
        games={lastReleasedGames}
        title="Last Released Games"
        icon={<Gamepad2 className="w-6 h-6 text-white" />}
        visibleCount={3}  // Changed from 2 to 3
      />
      <GameSlider 
        games={upcomingGames} 
        direction="left"
        title="Upcoming Games"
        icon={<Clock className="w-6 h-6 text-white" />}
        visibleCount={4}  // Changed from 3 to 4
      />
      <Footer/>
    </main>
  )
};

export default Home;
