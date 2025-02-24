import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Video } from "@/components/game/video"
import { Badge } from "@/components/ui/badge"
import { Screenshots } from "@/components/game/screenshots"
import { Star, Users, MessageSquare } from "lucide-react"
import Header from "@/components/main/header"
import Footer from "@/components/main/footer"
import { getGameById } from "@/lib/adapters/gameAdapter"

export default async function GamePage({ params }: { params: { id: string } }) {
    const game = await getGameById(params.id)

    return (
        <div className="min-h-screen bg-quokka-darker text-quokka-light">
            <Header />
            <div className="container mx-auto px-4 py-64 -mt-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-start gap-6 mb-8">
                            {game.cover ? (
                                <Image
                                    src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
                                    alt={`${game.name} cover`}
                                    width={180}
                                    height={240}
                                    className="rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="w-[180px] h-[240px] bg-quokka-dark rounded-lg" />
                            )}
                            <div>
                                <h1 className="text-4xl font-bold mb-4 text-quokka-purple">{game.name}</h1>
                                <div className="flex items-center gap-6 mb-4">
                                    {game.rating !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <Star className="text-quokka-cyan" />
                                            <span className="text-2xl font-bold">{game.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Users className="text-quokka-purple" />
                                        <span>{game.lists} lists</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="text-quokka-purple" />
                                        <span>{game.reviews} reviews</span>
                                    </div>
                                </div>
                                {game.genres && game.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {game.genres.map((genre) => (
                                            <Badge key={genre.id} variant="outline" className="border-quokka-cyan text-quokka-cyan">
                                                {genre.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {game.summary && (
                            <div className="bg-quokka-dark rounded-lg p-6 mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-quokka-cyan">About</h2>
                                <p className="text-lg mb-4">{game.summary}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {Array.isArray(game.involved_companies) && game.involved_companies.length > 0 && (
                                        game.involved_companies.map((company) => (
                                            <div key={company?.company?.id || Math.random()}>
                                                <h3 className="text-quokka-purple font-semibold mb-2">
                                                    {company?.developer ? 'Developer' : company?.publisher ? 'Publisher' : 'Company'}
                                                </h3>
                                                <p>{company?.company?.name}</p>
                                            </div>
                                        ))
                                    )}
                                    {typeof game.first_release_date === 'number' && (
                                        <div>
                                            <h3 className="text-quokka-purple font-semibold mb-2">Release Date</h3>
                                            <p>{formatDistanceToNow(new Date(game.first_release_date * 1000), { addSuffix: true })}</p>
                                        </div>
                                    )}
                                    {Array.isArray(game.platforms) && game.platforms.length > 0 && (
                                        <div>
                                            <h3 className="text-quokka-purple font-semibold mb-2">Platforms</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {game.platforms.map((platform) => (
                                                    <Badge
                                                        key={platform?.id || Math.random()}
                                                        variant="secondary"
                                                        className="bg-quokka-purple/20 text-quokka-purple"
                                                    >
                                                        {platform?.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {game.videos && game.videos.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-quokka-cyan">Trailer</h2>
                                <div className="aspect-video">
                                    <Video videoId={game.videos[0].video_id} />
                                </div>
                            </div>
                        )}

                        {game.screenshots && game.screenshots.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 text-quokka-cyan">Screenshots</h2>
                                <Screenshots screenshots={game.screenshots} />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <div className="sticky top-4 bg-quokka-dark rounded-lg p-6">
                            <button className="w-full bg-quokka-purple text-quokka-light hover:bg-quokka-purple/90 py-3 px-4 rounded-md transition-colors mb-4 font-semibold">
                                Add to Collection
                            </button>
                            <button className="w-full border border-quokka-purple text-quokka-purple hover:bg-quokka-purple/10 py-3 px-4 rounded-md transition-colors font-semibold">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

