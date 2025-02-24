import Link from "next/link"
import { Instagram, Twitter, MessageCircle, Gamepad2, Mail, Globe, ChevronRight } from "lucide-react"
import Image from "next/image"

const mainLinks = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/games" },
  { name: "Collections", href: "/collections" },
  { name: "Community", href: "/community" },
  { name: "About", href: "/about" },
]

const resourceLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Contact Us", href: "/contact" },
]

const socialLinks = [
  { name: "Discord", icon: MessageCircle, href: "https://discord.gg/quokka", color: "#5865F2" },
  { name: "X (Twitter)", icon: Twitter, href: "https://twitter.com/quokka", color: "#1DA1F2" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/quokka", color: "#E1306C" },
]

export default function Footer() {
  return (
    <footer className="relative bg-quokka-darker pt-16 pb-8 overflow-hidden">
      {/* Decorative Gaming Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-quokka-purple via-quokka-cyan to-quokka-purple"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-quokka-purple/5 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-quokka-cyan/5 rounded-full blur-3xl translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Gamepad2 className="w-8 h-8 text-quokka-purple mr-2" />
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-quokka-purple to-quokka-cyan bg-clip-text text-transparent">
                QUOKKA
              </Link>
            </div>
            <p className="text-quokka-light/70 leading-relaxed">
              Your ultimate gaming companion. Discover, collect, and share your gaming experiences with friends around the world.
            </p>
            <div className="pt-4">
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-quokka-dark flex items-center justify-center hover:bg-quokka-purple/20 transition-all duration-300 group"
                    aria-label={link.name}
                  >
                    <link.icon className="w-5 h-5 text-quokka-light group-hover:text-quokka-cyan" style={{ color: link.color }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-quokka-cyan font-bold text-lg mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-quokka-purple rounded-full mr-2.5"></span>
              Navigation
            </h3>
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-quokka-light/70 hover:text-quokka-cyan flex items-center group transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-quokka-purple" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-quokka-cyan font-bold text-lg mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-quokka-purple rounded-full mr-2.5"></span>
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-quokka-light/70 hover:text-quokka-cyan flex items-center group transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-quokka-purple" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-quokka-cyan font-bold text-lg mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-quokka-purple rounded-full mr-2.5"></span>
              Stay Connected
            </h3>
            <p className="text-quokka-light/70 mb-4">
              Subscribe to our newsletter for the latest gaming news and updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-quokka-dark border-none rounded-l-lg py-2 px-4 text-quokka-light/90 focus:outline-none focus:ring-1 focus:ring-quokka-purple w-full"
              />
              <button className="bg-quokka-purple hover:bg-quokka-purple/90 text-white rounded-r-lg px-4 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-quokka-dark/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-quokka-light/50 mb-4 md:mb-0">
            © {new Date().getFullYear()} Quokka Gaming. All rights reserved.
          </p>
          <div className="flex items-center text-quokka-light/50 text-sm">
            <Globe className="w-4 h-4 mr-2" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
      
      {/* Gaming-inspired decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-quokka-purple/30 to-transparent"></div>
      <div className="hidden md:block absolute -bottom-6 right-12 w-12 h-12 rotate-45 border-2 border-quokka-purple/20 rounded-sm"></div>
      <div className="hidden md:block absolute -bottom-3 right-24 w-6 h-6 rotate-12 border-2 border-quokka-cyan/20 rounded-sm"></div>
    </footer>
  )
}

