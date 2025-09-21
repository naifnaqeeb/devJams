"use client"

import type React from "react"

import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

export const ButtonHover = ({ children, className = "", ...props }: any) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerContainer = ({ children, className = "", delay = 0.1 }: any) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={controls} className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  )
}

export const MagneticHover = ({ children, strength = 0.3 }: any) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.3s ease-out" }}
    >
      {children}
    </div>
  )
}

export const PulseIndicator = ({ children, color = "primary", intensity = "medium" }: any) => {
  const intensityMap = {
    low: { scale: [1, 1.05, 1], duration: 2 },
    medium: { scale: [1, 1.1, 1], duration: 1.5 },
    high: { scale: [1, 1.15, 1], duration: 1 },
  }

  const config = intensityMap[intensity as keyof typeof intensityMap] || intensityMap.medium

  return (
    <motion.div
      animate={config}
      transition={{
        duration: config.duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={`inline-flex items-center justify-center`}
    >
      {children}
    </motion.div>
  )
}
