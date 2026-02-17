'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          "relative h-12 w-24 rounded-full p-1 transition-colors duration-500 flex items-center shadow-2xl border",
          isDark ? "bg-slate-900 border-white/10" : "bg-blue-100 border-blue-200"
        )}
      >
        <motion.div
          initial={false}
          animate={{ x: isDark ? 48 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500",
            isDark ? "bg-blue-600" : "bg-white"
          )}
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-white" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-500" />
          )}
        </motion.div>
        
        <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
          <Sun className={cn("h-4 w-4 transition-opacity", isDark ? "opacity-20 text-white" : "opacity-0")} />
          <Moon className={cn("h-4 w-4 transition-opacity", isDark ? "opacity-0" : "opacity-20 text-blue-900")} />
        </div>
      </button>
    </div>
  )
}
