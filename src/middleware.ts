import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if (isAuthRoute) {
    return NextResponse.next()
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.nextUrl))
  }

  // Double check admin role if logged in
  if (isAdminRoute && isLoggedIn && req.auth?.user.role !== "ADMIN") {
    // Should theoretically be handled by signIn callback, but for safety:
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
