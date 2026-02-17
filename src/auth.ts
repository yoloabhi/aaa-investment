import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      from: "no-reply@resend.dev", // You can change this to your domain later
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
