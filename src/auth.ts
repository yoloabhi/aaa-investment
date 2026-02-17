import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      
      const allowedEmails = process.env.ADMIN_EMAIL_ALLOWLIST?.split(',') || []
      const isAllowed = allowedEmails.includes(user.email)
      
      if (isAllowed) {
        return true
      }
      
      // If not in allowlist, return false to deny access
      // Alternatively, we could allow them to sign in but assign USER role, 
      // and protect admin routes based on role.
      // But prompt says "Only allow admin access for emails in ADMIN_EMAIL_ALLOWLIST".
      // So we block login entirely for non-admins to keep it simple and secure.
      return false
    },
    async session({ session, user }) {
      // Add role to session
      // Since we only allow admins to login, everyone logged in is effectively an ADMIN 
      // based on the allowlist check above. 
      // But let's be explicit and fetch role from DB if needed, or just set it.
      // For this app, we can trust the allowlist.
      session.user.role = "ADMIN"
      return session
    }
  },
  pages: {
    signIn: '/auth/signin', // We'll create a custom signin page
    error: '/auth/error',
  }
})
