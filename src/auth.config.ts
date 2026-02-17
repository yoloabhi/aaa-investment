import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

// This configuration is "Edge-safe" because it doesn't import Prisma
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false
      
      const allowlistString = process.env.ADMIN_EMAIL_ALLOWLIST || ""
      const allowedEmails = allowlistString.split(',').map(e => e.trim().toLowerCase())
      const userEmail = user.email.toLowerCase()
      
      return allowedEmails.includes(userEmail)
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = "ADMIN"
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "ADMIN"
      }
      return token
    }
  },
} satisfies NextAuthConfig
