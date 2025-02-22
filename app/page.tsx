import GameCarousel from "@/components/GameCarousel";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Welcome to Game Tracker</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
        <GameCarousel type="new-releases" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <GameCarousel type="coming-soon" />
      </div>
    </div>
  );
}
