'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function BlurFade({ children, delay = 0, className }: { children: ReactNode, delay?: number, className?: string }) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        filter: isMobile ? 'blur(4px)' : 'blur(10px)', 
        y: isMobile ? 10 : 20 
      }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: isMobile ? 0.4 : 0.8, 
        delay: isMobile ? delay * 0.5 : delay, 
        ease: "circOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
