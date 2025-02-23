"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddGameModal({ isOpen, onClose }: AddGameModalProps) {
  const [status, setStatus] = useState<string>("");
  const [rating, setRating] = useState<number>(4.4);
  const [review, setReview] = useState("");

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

  const handleSubmit = () => {
    // Handle submission
    onClose();
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CleanShot%202025-02-22%20at%2002.38.38@2x-8ID5LGhxOgNtH8b3fOfB123pvhML1s.png"
              alt="Game cover"
              className="w-24 h-24 rounded-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
                <span className="text-4xl transition-all duration-200">
                  {getRatingEmoji}
                </span>
              </div>
              <h2 className="text-2xl font-bold">Cyberline Racing</h2>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {["Finished", "Playing", "Dropped", "Want"].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setStatus(statusOption)}
                className={cn(
                  "py-2 px-4 rounded-full border border-quokka-purple/20 text-center",
                  status === statusOption ? "bg-quokka-purple/10" : "hover:bg-quokka-purple/5"
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

          {/* Add Game Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-quokka-cyan text-quokka-dark rounded-full font-semibold hover:bg-quokka-cyan/80 transition-colors"
          >
            Add game
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
