"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

interface UserSettingsFormProps {
  initialData: {
    fullName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
  };
}

export function UserSettingsForm({ initialData }: UserSettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    username: initialData.username || "",
    bio: initialData.bio || "",
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload the file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      // Delete old avatar if it exists
      if (avatarUrl) {
        const oldFileName = avatarUrl.split("/").pop();
        if (oldFileName) {
          await supabase.storage
            .from("avatars")
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update user metadata with the new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...formData,
          avatar_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      router.refresh();
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio,
          avatar_url: avatarUrl,
        },
      });

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar Upload */}
      <div className="flex items-center gap-4">
        <div
          onClick={handleAvatarClick}
          className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer group overflow-hidden border border-gray-600"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <span className="text-3xl text-white">
              {formData.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
            <Camera className="w-6 h-6 text-white transform scale-90 group-hover:scale-100 transition-transform duration-200" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div className="flex-1">
          <h3 className="font-medium mb-1">Profile Picture</h3>
          <p className="text-sm text-gray-400">
            Click to upload a new profile picture
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fullName: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="@johndoe"
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
        />
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
