"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "../ui/logo"
import SearchModal from "../search/search-modal"

export default function Header() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > 1000) {
                    // Only hide when scrolled more than 500px
                    if (window.scrollY > lastScrollY) {
                        // if scroll down hide the navbar
                        setIsVisible(false)
                    } else {
                        // if scroll up show the navbar
                        setIsVisible(true)
                    }
                } else {
                    setIsVisible(true) // Always show when scrolled less than 500px
                }

                // remember current page location to use in the next move
                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar)

            // cleanup function
            return () => {
                window.removeEventListener("scroll", controlNavbar)
            }
        }
    }, [lastScrollY])

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full bg-background/60 backdrop-blur-xl z-50 transition-all duration-300 ${isVisible ? "translate-y-0 shadow-md" : "-translate-y-full"}`}
            >
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        <div className="w-12 h-12 rounded-full bg-quokka-cyan flex items-center justify-center">
                            <Logo size={200} />
                        </div>
                    </Link>
                    <nav className="hidden md:flex space-x-4">
                        <Link href="/" className="text-foreground hover:text-primary">
                            Home
                        </Link>
                        <Link href="/about" className="text-foreground hover:text-primary">
                            About
                        </Link>
                        <Link href="/services" className="text-foreground hover:text-primary">
                            Services
                        </Link>
                        <Link href="/contact" className="text-foreground hover:text-primary">
                            Contact
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                        <Button>
                            <User className="h-5 w-5 mr-2" />
                            Login
                        </Button>
                    </div>
                </div>
            </header>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

