import { Button } from "@/ui/button"
import { ComputerIcon as SteamIcon, ChevronDown } from "lucide-react"

export default function MainBanner() {
    const handleScrollClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const target = document.getElementById('features');
        target?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative h-screen w-full bg-gray-950 flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-0 top-0 h-96 w-96 bg-blue-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute right-0 bottom-0 h-96 w-96 bg-purple-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute left-1/2 top-1/2 h-96 w-96 bg-pink-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            {/* Blurred panel */}
            <div className="absolute inset-0 bg-gray-950 bg-opacity-70 backdrop-blur-sm"></div>
            {/* Content */}
            <div className="relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">Trackbar</h1>
                <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-300">
                    Your ultimate gaming companion. Track your progress, compete with friends, and level up your gaming
                    experience.
                </p>
                <div id="steam-login">
                    <Button className="bg-[#171a21] hover:bg-[#2a475e] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                        <SteamIcon className="w-6 h-6 mr-2" />
                        Login with Steam
                    </Button>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Button
                        variant="ghost"
                        onClick={handleScrollClick}
                        className="text-white opacity-75 hover:opacity-100"
                    >
                        <ChevronDown className="w-8 h-8" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

