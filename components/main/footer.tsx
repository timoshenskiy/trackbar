import Link from "next/link"
import { Instagram, Twitter, MessageCircle } from "lucide-react"

const socialLinks = [
    { name: "Discord", icon: MessageCircle, href: "https://discord.gg/quokka" },
    { name: "X (Twitter)", icon: Twitter, href: "https://twitter.com/quokka" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/quokka" },
]

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <Link href="/" className="text-2xl font-bold">
                            QUOKKA
                        </Link>
                        <p className="text-sm text-gray-300 mt-2">© {new Date().getFullYear()} Quokka. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        {socialLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                <link.icon className="w-6 h-6" />
                                <span className="sr-only">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

