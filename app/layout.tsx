import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { GameProvider } from "@/contexts/GameContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Game Tracker",
  description: "Track your game collection and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <GameProvider>
            <div className="flex min-h-screen bg-[#1C1C1C]">
              <Sidebar />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
