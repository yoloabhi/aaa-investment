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
      if (!user?.email) {
        console.error("SignIn attempt without email")
        return false
      }
      
      const allowlistString = process.env.ADMIN_EMAIL_ALLOWLIST || ""
      const allowedEmails = allowlistString.split(',').map(e => e.trim().toLowerCase())
      const userEmail = user.email.toLowerCase()
      
      const isAllowed = allowedEmails.includes(userEmail)
      
      if (!isAllowed) {
        console.warn(`Denied access to: ${userEmail}. Allowed: ${allowlistString}`)
      }
      
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
