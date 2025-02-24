"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "../ui/logo"
import SearchModal from "../search/search-modal"
import { useAuth } from "@/hooks/use-auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const { user, signOut, loading } = useAuth();

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > 1000) {
                    if (window.scrollY > lastScrollY) {
                        setIsVisible(false)
                    } else {
                        setIsVisible(true)
                    }
                } else {
                    setIsVisible(true)
                }

                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar)

            return () => {
                window.removeEventListener("scroll", controlNavbar)
            }
        }
    }, [lastScrollY])

    console.log(user)

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full bg-background/60 backdrop-blur-3xl z-50 transition-all duration-300 ${isVisible ? "translate-y-0 shadow-md" : "-translate-y-full"}`}
            >
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        <div className="w-12 h-12 rounded-full bg-quokka-cyan flex items-center justify-center">
                            <Logo size={50} />
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

                        {loading ? (
                            <Button disabled>
                                <User className="h-5 w-5 mr-2" />
                                Loading...
                            </Button>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <Link href={`/${user.username}`} className="flex items-center gap-3 hover:opacity-80">
                                    <span className="text-sm font-medium">
                                        {user.username || user.fullName}
                                    </span>
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.username || user.fullName}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                            {(user.username || user.fullName || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <Button asChild>
                                <Link href="/auth">
                                    <User className="h-5 w-5 mr-2" />
                                    Login
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

