'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'

interface StaggerTextProps {
  text: string
  className?: string
}

export function StaggerText({ text, className = "" }: StaggerTextProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const letters = Array.from(text)

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: isMobile ? 0.03 : 0.05, 
        delayChildren: isMobile ? 0.2 : 0.5 
      },
    },
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: isMobile ? 10 : 20,
      filter: isMobile ? "blur(4px)" : "blur(8px)",
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
          style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
