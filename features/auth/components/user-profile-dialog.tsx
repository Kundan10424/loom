"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Mail } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";
import { updateUserProfile } from "../actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const UserProfileDialog = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(user?.name || "");
  const [formImage, setFormImage] = useState(user?.image || "");
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [displayImage, setDisplayImage] = useState(user?.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize display values from session on mount
  useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user.name || "");
      setDisplayImage(session.user.image || "");
    }
  }, [session]);

  // Update display when session changes (after save)
  useEffect(() => {
    if (session?.user && !isEditing) {
      setDisplayName(session.user.name || "");
      setDisplayImage(session.user.image || "");
    }
  }, [session, isEditing]);

  // Reset form values when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setFormName(displayName || "");
      setFormImage(displayImage || "");
      setImagePreview(displayImage || "");
    }
  }, [isEditing, displayName, displayImage]);

  const handleSaveProfile = async () => {
    if (!formName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Saving profile with:", {
        name: formName,
        imageSize: formImage.length,
      });

      const result = await updateUserProfile({
        name: formName,
        image: formImage,
      });

      console.log("Update result:", result);

      if (result.success) {
        // Update display states immediately
        setDisplayName(formName);
        setDisplayImage(formImage);

        // Update the session immediately
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: formName,
            image: formImage,
          },
        });

        setSuccess("Profile updated successfully!");
        setIsEditing(false);

        // Refresh the page after a delay to ensure session is updated
        setTimeout(() => {
          console.log("Refreshing page...");
          router.refresh();
          setSuccess("");
        }, 500);
      } else {
        console.error("Update failed:", result.error);
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error in handleSaveProfile:", err);
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormName(displayName || "");
    setFormImage(displayImage || "");
    setImagePreview(displayImage || "");
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPG, PNG, GIF, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(
          "Image size must be less than 5 MB. Please choose a smaller image.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Compress image aggressively
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Much smaller dimensions for better compression
          let width = img.width;
          let height = img.height;
          const maxWidth = 200;
          const maxHeight = 200;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Very aggressive compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5);

          // Check if compressed image is still too large
          if (compressedBase64.length > 80 * 1024) {
            setError(
              "Image is still too large after compression. Please use a simpler image.",
            );
            return;
          }

          console.log(
            "Compressed image size:",
            compressedBase64.length,
            "bytes",
          );

          setFormImage(compressedBase64);
          setImagePreview(compressedBase64);
          setError("");
        };
        img.src = base64String;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-10 w-10 hover:ring-2 hover:ring-blue-500 transition-all">
            <AvatarImage
              src={displayImage || " "}
              alt={displayName || "User"}
            />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md border border-gray-200 dark:border-zinc-700 backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 shadow-2xl [&_.absolute.right-4.top-4]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pr-8">
          <DialogTitle className="text-2xl font-bold">Profile</DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-4 border-blue-500">
                <AvatarImage
                  src={imagePreview || " "}
                  alt={formName || "User"}
                />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {formName?.[0]?.toUpperCase() || <User />}
                </AvatarFallback>
              </Avatar>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="mt-2"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {/* User Info Section */}
          <div className="space-y-3">
            {isEditing ? (
              <>
                {/* Edit Mode */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter your name"
                    className="border border-gray-300 dark:border-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-sm font-semibold">
                    Profile Picture
                  </Label>
                  <div className="flex flex-col gap-3">
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Use an image less than 5 MB for best results
                    </p>
                    {imagePreview && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800/50 rounded">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Preview
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={imagePreview} alt="Preview" />
                          <AvatarFallback>IMG</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="space-y-2">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 If the error persists, please check the browser console
                      (F12) for detailed logs
                    </p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
                    {success}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Name
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user?.name || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator className="my-4" />

          {/* Logout Button */}
          <LogoutButton>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </LogoutButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
