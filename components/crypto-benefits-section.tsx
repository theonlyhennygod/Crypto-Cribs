"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function CryptoBenefitsSection() {
  const benefits = [
    {
      emoji: "⚡",
      title: "Lightning Fast Payments",
      description: "XRP settles in 3-5 seconds. No more waiting for bank transfers or credit card holds.",
      highlight: "3-5 sec settlements"
    },
    {
      emoji: "🌍",
      title: "Global, No Borders",
      description: "Pay from anywhere, to anywhere. No currency conversion fees or international restrictions.",
      highlight: "0% conversion fees"
    },
    {
      emoji: "🔒",
      title: "Your Keys, Your Money",
      description: "True ownership. No frozen accounts, no payment reversals, no corporate overlords.",
      highlight: "100% self-custody"
    },
    {
      emoji: "💰",
      title: "Earn While You Sleep",
      description: "Stake your earnings, participate in governance, and earn passive income from the protocol.",
      highlight: "Up to 12% APY"
    },
    {
      emoji: "🎯",
      title: "Exclusive Access",
      description: "Token holders get first dibs on luxury properties, private events, and VIP experiences.",
      highlight: "Members only"
    },
    {
      emoji: "📈",
      title: "Deflationary Rewards",
      description: "Every booking burns tokens. As the platform grows, your holdings become more valuable.",
      highlight: "Token burns"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20" suppressHydrationWarning>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            🚀 Why Crypto Cribs Hits Different
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Web3 Travel
            </span>
            <br />
            <span className="text-foreground">Built Different</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Traditional travel platforms are stuck in Web2. We're building the future where your money moves at the speed of light, 
            your privacy is protected, and your loyalty is actually rewarded.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-card/50 to-background/50 border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {benefit.emoji}
                  </div>
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {benefit.highlight}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-primary">Ready to join the revolution?</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              The future of travel is decentralized, transparent, and rewarding. 
              Don't get left behind in the Web2 stone age.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-mono">
              <Badge variant="outline" className="border-primary/30 text-primary">
                🔥 0% Platform Fees
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                ⚡ Instant Settlements
              </Badge>
              <Badge variant="outline" className="border-pink-500/30 text-pink-400">
                💎 Exclusive Rewards
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
