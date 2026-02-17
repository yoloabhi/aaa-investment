'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export function CursorGlow() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()
  
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 })

  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleScroll = () => {
      const isMobile = window.innerWidth < 768
      // Hide on hero banner of homepage (first 800px) OR if on mobile
      if (isMobile || (pathname === '/' && window.scrollY < 800)) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    handleScroll()
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [mouseX, mouseY, pathname])

  const currentTheme = mounted ? (resolvedTheme || theme) : 'dark'
  const glowColor = currentTheme === 'light' 
    ? 'rgba(37, 99, 235, 0.12)' 
    : 'rgba(59, 130, 246, 0.08)'

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${springX}px ${springY}px,
      ${glowColor},
      transparent 80%
    )
  `

  if (!mounted) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
      style={{
        background,
        opacity: isVisible ? 1 : 0
      }}
    />
  )
}
