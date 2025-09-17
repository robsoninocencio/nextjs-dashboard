import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

/**
 * Fetches a user by email, including the password hash.
 * This function is intended for authentication purposes only.
 * It uses React's `cache` to deduplicate database requests within a single request-response cycle.
 * @param email The user's email address.
 * @returns The user object or null if not found.
 */
export const getUser = cache(async (email: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
});
