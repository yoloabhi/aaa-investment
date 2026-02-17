'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useSpring, useMotionValue } from 'framer-motion'

interface InteractiveGridProps {
  className?: string
  warp?: boolean
  opacity?: number
}

export function InteractiveGrid({ 
  className = "", 
  warp = true,
  opacity = 0.15
}: InteractiveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  
  // Even smoother spring for more "fluid" feel
  const springX = useSpring(mouseX, { stiffness: 120, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 40 })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!warp || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    const handleMouseLeave = () => {
      mouseX.set(-1000)
      mouseY.set(-1000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, warp])

  const gridSize = 50
  const columns = 50
  const rows = 40

  if (!warp || isMobile) {
    return (
      <div 
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ 
          opacity,
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grid-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {Array.from({ length: rows }).map((_, i) => (
          <GridLine 
            key={`h-${i}`} 
            type="horizontal" 
            index={i} 
            mouseX={springX} 
            mouseY={springY} 
            gridSize={gridSize}
            warp={warp}
          />
        ))}
        
        {Array.from({ length: columns }).map((_, i) => (
          <GridLine 
            key={`v-${i}`} 
            type="vertical" 
            index={i} 
            mouseX={springX} 
            mouseY={springY} 
            gridSize={gridSize}
            warp={warp}
          />
        ))}
      </svg>
    </div>
  )
}

function GridLine({ type, index, mouseX, mouseY, gridSize, warp }: any) {
  const pathRef = useRef<SVGPathElement>(null)
  
  useEffect(() => {
    let frameId: number
    const points = 25
    const totalSize = 3000
    
    const update = () => {
      const mx = mouseX.get()
      const my = mouseY.get()
      const time = performance.now() / 2000
      
      let d = ''
      if (type === 'horizontal') {
        const y = index * gridSize
        d = `M 0 ${y}`
        for (let j = 1; j <= points; j++) {
          const x = (j / points) * totalSize
          let finalY = y
          
          if (warp && mx > -500) {
            const dist = Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2))
            const warpIntensity = Math.max(0, 45 - dist / 8)
            const dy = ((y - my) / (dist + 1)) * warpIntensity
            finalY += dy
          }
          
          const wave = Math.sin(time + x/200 + y/200) * 1.5
          d += ` L ${x} ${finalY + wave}`
        }
      } else {
        const x = index * gridSize
        d = `M ${x} 0`
        for (let j = 1; j <= points; j++) {
          const y = (j / points) * totalSize
          let finalX = x
          
          if (warp && mx > -500) {
            const dist = Math.sqrt(Math.pow(x - mx, 2) + Math.pow(y - my, 2))
            const warpIntensity = Math.max(0, 45 - dist / 8)
            const dx = ((x - mx) / (dist + 1)) * warpIntensity
            finalX += dx
          }
          
          const wave = Math.cos(time + x/200 + y/200) * 1.5
          d += ` L ${finalX + wave} ${y}`
        }
      }
      
      if (pathRef.current) {
        pathRef.current.setAttribute('d', d)
      }
      frameId = requestAnimationFrame(update)
    }
    
    frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [mouseX, mouseY, type, index, gridSize, warp])

  return (
    <path 
      ref={pathRef}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="0.8" 
      className="text-blue-500/40"
      style={{ filter: 'url(#grid-glow)' }}
    />
  )
}
