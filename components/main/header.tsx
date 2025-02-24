"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User, LogOut, Menu, X, Gamepad2, Flame, Trophy, Users, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "../ui/logo"
import SearchModal from "../search/search-modal"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Games", href: "/games", icon: Gamepad2 },
  { name: "Trending", href: "/trending", icon: Flame },
  { name: "Leaderboards", href: "/leaderboards", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
]

export default function Header() {
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeLink, setActiveLink] = useState("/")

    const { user, signOut, loading } = useAuth();

    useEffect(() => {
        // Set active link based on current path
        if (typeof window !== "undefined") {
            setActiveLink(window.location.pathname)
        }
        
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > 200) {
                    if (window.scrollY > lastScrollY && !isMobileMenuOpen) {
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
    }, [lastScrollY, isMobileMenuOpen])

    // Force header to be visible when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsVisible(true)
        }
    }, [isMobileMenuOpen])

    // Skeleton pulse animation
    const pulseAnimation = "animate-pulse";

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
            >
                {/* Top accent line */}
                <div className="h-1 w-full bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple"></div>
                
                {/* Main header content */}
                <div className={`bg-quokka-darker/90 backdrop-blur-xl transition-all duration-300 ${lastScrollY > 50 ? "shadow-lg shadow-quokka-purple/5" : ""}`}>
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="relative z-10 flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-quokka-purple to-quokka-cyan p-0.5 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                                    <div className="w-full h-full bg-quokka-darker rounded-md flex items-center justify-center">
                                        <Logo size={30} />
                                    </div>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-quokka-purple to-quokka-cyan bg-clip-text text-transparent">QUOKKA</span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name} 
                                        href={link.href}
                                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group
                                            ${activeLink === link.href 
                                                ? "text-quokka-cyan bg-quokka-purple/10" 
                                                : "text-quokka-light/70 hover:text-quokka-cyan hover:bg-quokka-purple/5"}`}
                                    >
                                        <link.icon className={`w-4 h-4 ${activeLink === link.href ? "text-quokka-cyan" : "text-quokka-light/50 group-hover:text-quokka-cyan"}`} />
                                        {link.name}
                                        {activeLink === link.href && (
                                            <motion.span 
                                                layoutId="activeIndicator"
                                                className="absolute bottom-0 left-0 right-0 mx-auto w-12 h-0.5 bg-quokka-cyan rounded-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right side actions */}
                            <div className="flex items-center gap-2 md:gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsSearchOpen(true)}
                                    className="rounded-lg bg-quokka-dark/50 text-quokka-light hover:bg-quokka-purple/20 hover:text-quokka-cyan"
                                >
                                    <Search className="h-5 w-5" />
                                    <span className="sr-only">Search</span>
                                </Button>

                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        {/* Avatar skeleton */}
                                        <div className="flex items-center gap-3 bg-quokka-dark/50 px-3 py-1.5 rounded-lg">
                                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br from-quokka-purple/20 to-quokka-cyan/20 ${pulseAnimation}`}>
                                                <div className="w-full h-full rounded-lg bg-quokka-dark/70"></div>
                                            </div>
                                            <div className="hidden sm:block">
                                                <div className={`h-2.5 w-16 bg-quokka-purple/20 rounded-full ${pulseAnimation}`}></div>
                                            </div>
                                        </div>
                                        {/* Logout button skeleton */}
                                        <div className={`h-9 w-9 rounded-lg bg-quokka-dark/50 ${pulseAnimation}`}></div>
                                    </div>
                                ) : user ? (
                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href={`/${user.username}`} 
                                            className="flex items-center gap-3 hover:opacity-90 transition-opacity bg-quokka-dark/50 hover:bg-quokka-purple/20 px-3 py-1.5 rounded-lg"
                                        >
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.username || user.fullName}
                                                    className="h-8 w-8 rounded-lg object-cover border border-quokka-purple/30"
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-quokka-purple/20 text-quokka-cyan font-bold">
                                                    {(user.username || user.fullName || 'U')[0].toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-sm font-medium hidden sm:block text-quokka-light">
                                                {user.username || user.fullName}
                                            </span>
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => signOut()}
                                            className="rounded-lg bg-quokka-dark/50 text-quokka-light hover:bg-red-500/20 hover:text-red-400"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        asChild
                                        className="rounded-lg bg-gradient-to-r from-quokka-purple to-quokka-cyan hover:opacity-90 transition-opacity text-white"
                                    >
                                        <Link href="/auth">
                                            <User className="h-5 w-5 mr-2" />
                                            Login
                                        </Link>
                                    </Button>
                                )}

                                {/* Mobile menu button */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="md:hidden rounded-lg bg-quokka-dark/50 text-quokka-light hover:bg-quokka-purple/20 hover:text-quokka-cyan"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            className="md:hidden bg-quokka-darker/95 backdrop-blur-xl"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="container mx-auto px-4 py-4">
                                <nav className="flex flex-col space-y-2">
                                    {navLinks.map((link) => (
                                        <Link 
                                            key={link.name} 
                                            href={link.href}
                                            className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3
                                                ${activeLink === link.href 
                                                    ? "text-quokka-cyan bg-quokka-purple/10 border-l-2 border-quokka-cyan" 
                                                    : "text-quokka-light/70 hover:text-quokka-cyan hover:bg-quokka-purple/5"}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <link.icon className={`w-5 h-5 ${activeLink === link.href ? "text-quokka-cyan" : "text-quokka-light/50"}`} />
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Spacer to prevent content from hiding under the fixed header */}
            <div className="h-16"></div>
            
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

