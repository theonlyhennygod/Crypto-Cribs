"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function CommunitySection() {
  const stats = [
    {
      number: "12.5K",
      label: "Active Travelers",
      emoji: "🌍"
    },
    {
      number: "$2.3M",
      label: "Volume Traded",
      emoji: "💰"
    },
    {
      number: "847",
      label: "Properties Listed",
      emoji: "🏠"
    },
    {
      number: "99.2%",
      label: "Satisfaction Rate",
      emoji: "⭐"
    }
  ]

  const communities = [
    {
      platform: "Discord",
      members: "8.2K",
      description: "Daily alpha, property drops, and community events",
      emoji: "💬",
      color: "from-blue-500 to-indigo-600"
    },
    {
      platform: "Twitter",
      members: "15.7K",
      description: "Latest updates, travel inspiration, and memes",
      emoji: "🐦",
      color: "from-blue-400 to-cyan-500"
    },
    {
      platform: "Telegram",
      members: "6.9K",
      description: "Real-time support and community chat",
      emoji: "📱",
      color: "from-blue-600 to-blue-700"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            🚀 Join the Movement
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">The Largest</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Crypto Travel Community
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with like-minded travelers, share experiences, and get exclusive access to the best properties and deals.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {communities.map((community, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-card to-background border-border hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {community.emoji}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{community.platform}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {community.members} members
                  </Badge>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {community.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10 text-primary"
                  >
                    Join {community.platform}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-foreground">Ready to be part of</span>
              <br />
              <span className="text-primary">something bigger?</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of crypto travelers who are already experiencing the future of hospitality. 
              Get exclusive access, earn rewards, and travel like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 text-white px-8 py-4 text-lg font-bold"
              >
                🚀 Join the Community
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 text-primary px-8 py-4 text-lg"
              >
                📖 Read the Docs
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Badge variant="outline" className="border-primary/30 text-primary">
                🔥 Early Adopter Benefits
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                💎 Exclusive Property Access
              </Badge>
              <Badge variant="outline" className="border-pink-500/30 text-pink-400">
                🎁 Community Rewards
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
