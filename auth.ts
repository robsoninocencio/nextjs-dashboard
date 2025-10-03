import bcrypt from 'bcryptjs';
import { z } from 'zod';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

import { getUser } from '@/lib/data/users';

const PASSWORD_MIN_LENGTH = 6;

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(PASSWORD_MIN_LENGTH),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email); // Fetches the full user object
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword; // IMPORTANT: Never return the password hash
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
