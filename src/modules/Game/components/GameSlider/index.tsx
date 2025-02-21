"use client";

import React, { useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/ui/carousel"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Gamepad2 } from "lucide-react";
import GameCard from "../GameCard";

interface GameSliderProps {
  autoScroll?: boolean;
  direction?: 'left' | 'right';
  scrollInterval?: number;
  games: any[];
  title?: string;
  icon?: React.ReactNode;
  visibleCount?: number;
}

const getBasisClass = (visibleCount: number) => {
  switch (visibleCount) {
    case 3:
      return 'lg:basis-1/3';
    case 4:
      return 'lg:basis-1/4';
    default:
      return 'lg:basis-1/4';
  }
};

const GameSlider: React.FC<GameSliderProps> = ({
  games = [],
  autoScroll = true,
  direction = 'right',
  scrollInterval = 6000,
  title = "Featured Games",
  icon = <Gamepad2 className="w-6 h-6" />,
  visibleCount = 4,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api || !autoScroll) return;

    const interval = setInterval(() => {
      if (direction === 'right') {
        api.scrollNext();
      } else {
        api.scrollPrev();
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [api, autoScroll, direction, scrollInterval]);

  if (!games) return null;

  return (
    <div className="w-full bg-gray-950 p-8">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="relative group px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-4">
            {games.filter(({ cover }) => !!cover).map((game, index) => (
              <CarouselItem key={index} className={`pl-4 basis-full md:basis-1/2 ${getBasisClass(visibleCount)}`}>
                <GameCard game={game} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white border-white hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity left-0" />
          <CarouselNext className="text-white border-white hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity right-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default GameSlider;