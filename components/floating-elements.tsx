"use client"

import { motion } from "framer-motion"
import { Calendar, MessageSquare, Phone, Bot, Sparkles, Zap } from "lucide-react"

export function FloatingElements() {
  const elements = [
    { icon: Calendar, delay: 0, x: "10%", y: "20%" },
    { icon: MessageSquare, delay: 0.5, x: "80%", y: "15%" },
    { icon: Phone, delay: 1, x: "15%", y: "70%" },
    { icon: Bot, delay: 1.5, x: "85%", y: "75%" },
    { icon: Sparkles, delay: 2, x: "50%", y: "10%" },
    { icon: Zap, delay: 2.5, x: "70%", y: "60%" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, index) => {
        const Icon = element.icon
        return (
          <motion.div
            key={index}
            className="absolute opacity-10"
            style={{ left: element.x, top: element.y }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{
              opacity: [0, 0.1, 0.05, 0.1],
              scale: [0, 1, 1.2, 1],
              rotate: [0, 360],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              delay: element.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Icon className="h-8 w-8 text-primary" />
          </motion.div>
        )
      })}
    </div>
  )
}
