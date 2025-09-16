import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Fetches a user by email, including the password hash.
 * This function is intended for authentication purposes only.
 * It opts out of Next.js Data Cache to ensure fresh data is always fetched.
 * @param email The user's email address.
 * @returns The user object or null if not found.
 */
export async function getUser(email: string) {
  noStore();
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}
