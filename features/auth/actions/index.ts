"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: { accounts: true },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });
    return account;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const currentUser = async () => {
  const user = await auth();
  return user?.user;
};

export const updateUserProfile = async (data: {
  name?: string;
  image?: string;
}) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    console.log("Updating user profile for:", session.user.email);
    console.log("Image size:", data.image?.length || 0, "bytes");

    const updateData: { name?: string; image?: string } = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.image) {
      updateData.image = data.image;
    }

    const user = await db.user.update({
      where: { email: session.user.email },
      data: updateData,
    });

    console.log("User profile updated successfully:", user.email);
    
    // Verify the update was persisted
    const verifyUser = await db.user.findUnique({
      where: { email: session.user.email },
    });
    
    console.log("Verification - Updated name:", verifyUser?.name);
    console.log("Verification - Updated image size:", verifyUser?.image?.length || 0, "bytes");
    
    if (verifyUser?.name !== data.name || verifyUser?.image !== data.image) {
      console.warn("Warning: Data mismatch after update. DB may not have persisted changes.");
    }

    // Revalidate paths to refresh caches
    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true, user };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
