'use client'

import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

export function HeroBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const background = useMotionTemplate`
    radial-gradient(
      800px circle at ${mouseX}px ${mouseY}px,
      rgba(59, 130, 246, 0.08),
      transparent 80%
    )
  `

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background"
    >
      {/* Interactive Light rays that follow mouse subtly */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          style={{
            background
          }}
        />
      )}

      {/* Static Glow for Mobile */}
      {isMobile && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.1),transparent 80%)]" />
      )}

      {/* Floating Orbs (Passive) */}
      <motion.div 
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Center Fixed Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent 70%)] pointer-events-none" />
    </div>
  )
}
