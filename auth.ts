import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "@/features/auth/actions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    /**
     * Handle user creation and account linking after a successful sign-in
     */
    async signIn({ user, account, profile }) {
      if (!user || !account) return false;

      // Get the correct image based on the provider
      const getProviderImage = () => {
        if (account.provider === "github") {
          return profile?.avatar_url || user.image;
        } else if (account.provider === "google") {
          return profile?.picture || user.image;
        }
        return user.image;
      };

      const providerImage = getProviderImage();

      // Check if the user already exists
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      // If user does not exist, create a new one
      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            // Only set the provider image for brand-new users
            image: providerImage,

            accounts: {
              // @ts-expect-error - NextAuth provider account typing is incompatible with Prisma adapter here
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            },
          },
        });

        if (!newUser) return false; // Return false if user creation fails
      } else {
        // Link the account if user exists
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        // If the account does not exist, create it
        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              // @ts-expect-error - session_state comes from provider account typing
              session_state: account.session_state,
            },
          });
        }

        // IMPORTANT: do NOT overwrite user's edited avatar.
        // Only set provider image if the DB does not have one yet.
        if (!existingUser.image && providerImage) {
          await db.user.update({
            where: { id: existingUser.id },
            data: { image: providerImage },
          });
        }
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Handle client-side session updates (useSession().update)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.image = session.user.image;
        token.role = session.user.role;
        return token;
      }

      if (!token.sub) return token;


      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const exisitingAccount = await getAccountByUserId(existingUser.id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image; // <-- ensure image is carried into JWT

      return token;
    },

    async session({ session, token }) {
      // Attach the user ID from the token to the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image; // <-- ensure image is exposed on session
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
