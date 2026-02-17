import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { CursorGlow } from "@/components/animations/CursorGlow";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AAA Investment & Insurance | Wealth & Protection",
  description: "Premium investment and insurance consulting since 1993. Mutual funds, health insurance, and wealth management services.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%232563eb%22/><text y=%22.9em%22 x=%2250%%22 font-size=%2270%22 font-weight=%22900%22 fill=%22white%22 text-anchor=%22middle%22 font-family=%22system-ui%22>A</text></svg>',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased min-h-screen"
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <CursorGlow />
            </Suspense>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
