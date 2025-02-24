"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { GameSearchResult } from "@/utils/types/game";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  game: GameSearchResult & {
    userStatus?: string;
    userRating?: number;
    userReview?: string;
    userGameId?: number;
  };
  isEditing?: boolean;
}

export default function AddGameModal({
  isOpen,
  onClose,
  onSuccess,
  game,
  isEditing = false,
}: AddGameModalProps) {
  const [status, setStatus] = useState<
    "Finished" | "Playing" | "Dropped" | "Want"
  >("Want");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Initialize with existing data if editing
  useEffect(() => {
    if (isEditing && game) {
      // Try to extract status from game data if available
      if (game.userStatus) {
        const statusMap: Record<string, "Finished" | "Playing" | "Dropped" | "Want"> = {
          finished: "Finished",
          playing: "Playing",
          dropped: "Dropped",
          want_to_play: "Want"
        };
        setStatus(statusMap[game.userStatus] || "Want");
      }
      
      // Set rating if available
      if (game.userRating !== undefined) {
        setRating(game.userRating);
      } else if (game.total_rating) {
        // Use game's total rating as a fallback
        setRating(game.total_rating / 10); // Convert from 0-100 to 0-10
      }
      
      // Set review if available
      if (game.userReview) {
        setReview(game.userReview);
      }
    }
  }, [game, isEditing]);

  const getRatingEmoji = useMemo(() => {
    if (rating === 0) return "🤔";
    if (rating <= 2) return "😤";
    if (rating <= 4) return "😐";
    if (rating <= 6) return "🙂";
    if (rating <= 8) return "😊";
    return "🤩";
  }, [rating]);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setRating(value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Convert status to database enum format
      const dbStatus = status.toLowerCase() as
        | "finished"
        | "playing"
        | "dropped"
        | "want_to_play";

      if (isEditing && game.userGameId) {
        // Update existing game
        const { error } = await supabase
          .from("user_games")
          .update({
            status: dbStatus,
            rating: Math.round(rating * 10), // Convert to 0-100 range for storage
            review: review,
            updated_at: new Date().toISOString(),
          })
          .eq("id", game.userGameId);

        if (error) throw error;
      } else {
        // Add new game
        const { error } = await supabase.from("user_games").insert({
          user_id: user.id,
          game_id: game.id,
          status: dbStatus,
          rating: Math.round(rating * 10), // Convert to 0-100 range for storage
          review: review,
          source: "manual",
          platform_id: game.platforms?.[0]?.id, // Use first platform as default
        });

        if (error) throw error;
      }

      // Invalidate the userGames query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["userGames"] });

      onSuccess();
    } catch (error) {
      console.error("Error saving game:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-quokka-dark border-0 text-quokka-light max-w-2xl p-0">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Game Header */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={game.cover?.url || "/placeholder.svg"}
              alt={game.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
                <span className="text-4xl transition-all duration-200">
                  {getRatingEmoji}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{game.name}</h2>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {["Finished", "Playing", "Dropped", "Want"].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setStatus(statusOption as typeof status)}
                className={cn(
                  "py-2 px-4 rounded-full border border-quokka-purple/20 text-center",
                  status === statusOption
                    ? "bg-quokka-purple/10"
                    : "hover:bg-quokka-purple/5"
                )}
              >
                {statusOption}
              </button>
            ))}
          </div>

          {/* Rating Slider */}
          <div className="mb-8">
            <div className="flex justify-between text-gray-400 mb-2">
              <span>NS</span>
              <span>10</span>
            </div>
            <div className="relative">
              <div className="h-[2px] bg-gray-600 w-full"></div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={handleRatingChange}
                className="absolute top-0 w-full h-[2px] opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-quokka-cyan rounded-full transition-all duration-200"
                style={{ left: `${(rating / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Review Textarea */}
          <Textarea
            placeholder="Write your review in less than 5000 characters..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[200px] bg-[#2C2C2C] border-0 text-white placeholder:text-gray-400 mb-8"
          />

          {/* Add/Update Game Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 bg-quokka-cyan text-quokka-dark rounded-full font-semibold transition-colors",
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-quokka-cyan/80"
            )}
          >
            {isSubmitting 
              ? (isEditing ? "Updating game..." : "Adding game...") 
              : (isEditing ? "Update game" : "Add game")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
