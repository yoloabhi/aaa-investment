'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function DecryptedText({ text, className }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let iteration = 0
    let interval: any = null

    const startAnimation = () => {
      clearInterval(interval)
      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )

        if (iteration >= text.length) {
          clearInterval(interval)
        }

        iteration += 1 / 3
      }, 30)
    }

    startAnimation()
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className={className}>
      {displayText}
    </span>
  )
}
