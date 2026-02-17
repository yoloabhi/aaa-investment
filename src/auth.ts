import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      
      const allowedEmails = process.env.ADMIN_EMAIL_ALLOWLIST?.split(',') || []
      const isAllowed = allowedEmails.includes(user.email)
      
      return isAllowed
    },
    async session({ session, user }: any) {
      if (session.user) {
        session.user.role = "ADMIN"
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
})
