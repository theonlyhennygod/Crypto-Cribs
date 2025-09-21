"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function CryptoTestimonialsSection() {
  const testimonials = [
    {
      name: "CryptoNomad.eth",
      handle: "@cryptonomad",
      avatar: "🌴",
      role: "DeFi Degen",
      content: "Finally, a travel platform that gets it. Paid with XRP, got instant confirmation, and the property was exactly as advertised. No BS fees, no middleman drama. This is how travel should work.",
      highlight: "Saved $847 in fees"
    },
    {
      name: "DiamondHands",
      handle: "@hodlqueen",
      avatar: "💎",
      role: "NFT Collector",
      content: "Booked a sick penthouse in Miami for Art Basel. Used my FLR tokens and got exclusive access to a private rooftop party. The NFT they dropped was fire too! 🔥",
      highlight: "Exclusive NFT drop"
    },
    {
      name: "YieldFarmer",
      handle: "@yieldking",
      avatar: "🚜",
      role: "Liquidity Provider",
      content: "The staking rewards are insane. I'm earning more from my Crypto Cribs tokens than most DeFi protocols. Plus I get to travel the world. Win-win.",
      highlight: "14.2% APY earned"
    },
    {
      name: "Web3Wanderer",
      handle: "@decentralized_dreams",
      avatar: "🌍",
      role: "DAO Contributor",
      content: "Cross-chain payments just hit different. Swapped some USDC to XRP, booked a villa in Bali, and was sipping cocktails by sunset. The future is here.",
      highlight: "3-second settlement"
    },
    {
      name: "MetaverseMike",
      handle: "@metaverse_mike",
      avatar: "🕶️",
      role: "Virtual Real Estate",
      content: "The community is unreal. Met so many cool crypto people at the properties. It's like Airbnb but for degens who actually understand the tech.",
      highlight: "Met 50+ Web3 friends"
    },
    {
      name: "TokenTraveler",
      handle: "@token_traveler",
      avatar: "✈️",
      role: "Smart Contract Auditor",
      content: "Audited their contracts - they're clean AF. Security is top-notch, and the tokenomics are actually sustainable. Finally, a project that's not a rug pull.",
      highlight: "Security verified ✅"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/20 to-background" suppressHydrationWarning>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            💬 What the Community Says
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Real Reviews from</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Real Degens
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what the crypto community is saying about their Crypto Cribs experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs mb-4">
                    {testimonial.role}
                  </Badge>
                  
                  <blockquote className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="pt-4 border-t border-border/50">
                    <Badge variant="outline" className="text-xs text-primary border-primary/30">
                      {testimonial.highlight}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">
              Join the conversation
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Share your Crypto Cribs experience and earn community rewards
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Badge variant="outline" className="border-primary/30">
                #CryptoCribs
              </Badge>
              <Badge variant="outline" className="border-purple-500/30">
                #Web3Travel
              </Badge>
              <Badge variant="outline" className="border-pink-500/30">
                #DeFiTravel
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
