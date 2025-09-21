"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { DailyRaffleCard } from "./daily-raffle-card"
import { RaffleHistory } from "./raffle-history"

export function RaffleSection() {
  return (
    <section id="raffle" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Daily Rewards
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Win Amazing
            <br />
            <span className="text-primary">Travel Experiences</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Contribute to our liquidity pools daily for chances to win free vacations, luxury retreats, exclusive NFTs,
            and massive booking discounts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Daily Raffle */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <DailyRaffleCard />
          </motion.div>

          {/* Recent Winners */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <RaffleHistory />
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">How the Raffle Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold">Contribute</h4>
                <p className="text-sm text-muted-foreground">Add XRP or FLR to the daily liquidity pool</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h4 className="font-semibold">Earn Tickets</h4>
                <p className="text-sm text-muted-foreground">Get 1 raffle ticket per 5 tokens contributed</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h4 className="font-semibold">Wait for Draw</h4>
                <p className="text-sm text-muted-foreground">Winners selected daily at midnight UTC</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h4 className="font-semibold">Claim Prize</h4>
                <p className="text-sm text-muted-foreground">Winners receive prizes automatically via smart contract</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
