'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(59, 130, 246, 0.15)',
  showAurora = false,
  auroraColor = 'rgba(37, 99, 235, 0.2)',
}: {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  showAurora?: boolean
  auroraColor?: string
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const borderBackground = useMotionTemplate`
    radial-gradient(
      300px circle at ${springX}px ${springY}px,
      ${spotlightColor.replace('0.15', '0.4')},
      transparent 80%
    )
  `

  const contentBackground = useMotionTemplate`
    radial-gradient(
      600px circle at ${springX}px ${springY}px,
      ${spotlightColor},
      transparent 80%
    )
  `

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        "group relative rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 overflow-hidden transition-colors hover:bg-white/[0.04] hover:border-white/10",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Border Glow */}
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-500",
          isMobile ? "opacity-20" : "group-hover:opacity-100"
        )}
        style={{
          background: isMobile 
            ? `radial-gradient(circle at center, ${spotlightColor.replace('0.15', '0.2')}, transparent)`
            : borderBackground,
        }}
      />
      
      {/* Background Glow */}
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition duration-500",
          isMobile ? "opacity-10" : "group-hover:opacity-100"
        )}
        style={{
          background: isMobile
            ? `radial-gradient(circle at center, ${spotlightColor}, transparent)`
            : contentBackground,
        }}
      />

      {/* Aurora Overlay */}
      {showAurora && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none">
          <div 
            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_60s_linear_infinite]" 
            style={{
              background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.02), transparent, ${auroraColor}, transparent)`
            }}
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </div>
  )
}
