"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Zap, Trophy, Users, TrendingDown } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "Cross-Chain Payments",
    description: "Seamless transactions using XRPL currency with Flare smart contracts for maximum efficiency",
    badge: "XRPL + Flare",
    stats: "50% Lower Fees",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "Every transaction is recorded on-chain, eliminating hidden fees and ensuring complete transparency",
    badge: "Blockchain Verified",
    stats: "100% Transparent",
  },
  {
    icon: Zap,
    title: "Instant Bookings",
    description: "Lightning-fast property bookings with smart contract automation and instant confirmations",
    badge: "Smart Contracts",
    stats: "3x Faster",
  },
  {
    icon: Trophy,
    title: "Daily Raffle System",
    description: "Contribute to liquidity pools daily for chances to win free vacations, retreats, and exclusive NFTs",
    badge: "Rewards Pool",
    stats: "Daily Prizes",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Decentralized governance where travelers and hosts shape the future of the platform together",
    badge: "DAO Governance",
    stats: "10K+ Members",
  },
  {
    icon: TrendingDown,
    title: "Disrupt High Fees",
    description: "Challenge Airbnb's monopoly with fair pricing that benefits both travelers and property owners",
    badge: "Fee Revolution",
    stats: "vs 15% Airbnb",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Platform Features
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Revolutionizing Travel
            <br />
            <span className="text-primary">One Block at a Time</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Experience the future of travel with cutting-edge blockchain technology that puts power back in the hands of
            travelers and hosts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/20 transition-all duration-300 group">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mb-6">
                  <feature.icon className="h-12 w-12 text-primary group-hover:text-primary/80 transition-colors" />
                </motion.div>

                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>

                <div className="mt-auto">
                  <span className="text-sm font-mono text-primary font-semibold">{feature.stats}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
