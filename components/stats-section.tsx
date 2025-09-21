"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const stats = [
  { label: "Fee Reduction", value: 50, suffix: "%", prefix: "" },
  { label: "Transaction Speed", value: 3, suffix: "x", prefix: "" },
  { label: "Properties Listed", value: 10000, suffix: "+", prefix: "" },
  { label: "Rewards Distributed", value: 250, suffix: "K", prefix: "$" },
]

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export function StatsSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Disrupting Travel by the Numbers</h2>
          <p className="text-xl text-muted-foreground">Real impact, measurable results</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8 group-hover:border-primary/20 transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.prefix}
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
