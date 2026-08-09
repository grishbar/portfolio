import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}

/** Fade + slide-up reveal when the element enters the viewport. */
export function Reveal({ children, delay = 0, y = 32, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
