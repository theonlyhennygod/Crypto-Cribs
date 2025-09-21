"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { NFTGallery } from "@/components/nft-gallery"
import { LoyaltyRewards } from "@/components/loyalty-rewards"
import { DailyRaffleCard } from "@/components/daily-raffle-card"
import { RaffleHistory } from "@/components/raffle-history"
import { Gift, Crown, Star, Zap, Trophy, Medal, Sparkles, MapPin, Calendar, Users, Flame, Award } from "lucide-react"
import { useState } from "react"

export default function RewardsPage() {
  const [currentTier, setCurrentTier] = useState("Explorer")
  const [loyaltyPoints, setLoyaltyPoints] = useState(2840)
  const [nextTierPoints, setNextTierPoints] = useState(5000)
  const [streakDays, setStreakDays] = useState(23)

  const tierProgress = (loyaltyPoints / nextTierPoints) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-500/5">
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Rewards Universe
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Collect exclusive NFTs, earn loyalty points, win daily prizes, and unlock premium travel experiences
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                <span className="font-semibold text-xl">{currentTier}</span>
              </div>
              <div className="text-lg text-muted-foreground">{loyaltyPoints.toLocaleString()} points</div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">{streakDays} day streak</span>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-700">
                {Math.round(tierProgress)}% to next tier
              </Badge>
            </div>
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Next Tier: Adventurer</h3>
                <p className="text-sm text-muted-foreground">Unlock exclusive perks & higher rewards</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>
                  Progress: {loyaltyPoints.toLocaleString()} / {nextTierPoints.toLocaleString()} points
                </span>
                <span className="text-purple-600 font-medium">+{nextTierPoints - loyaltyPoints} needed</span>
              </div>
              <Progress value={tierProgress} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>12 trips completed</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>8 referrals</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>5 NFTs earned</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="raffle" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50">
            <TabsTrigger
              value="raffle"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4" />
              Daily Raffle
            </TabsTrigger>
            <TabsTrigger
              value="loyalty"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Crown className="h-4 w-4" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Gift className="h-4 w-4" />
              NFTs
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Medal className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="marketplace"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="raffle">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-4">Win Amazing Travel Experiences</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Contribute to our liquidity pools daily for chances to win free vacations, luxury retreats, and exclusive NFTs.
                </p>
              </motion.div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <DailyRaffleCard />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <RaffleHistory />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-12"
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
          </TabsContent>

          <TabsContent value="loyalty">
            <LoyaltyRewards />
          </TabsContent>

          <TabsContent value="nfts">
            <NFTGallery />
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "First Journey",
                    desc: "Complete your first booking",
                    icon: MapPin,
                    completed: true,
                    points: 100,
                  },
                  {
                    title: "Early Bird",
                    desc: "Book 30 days in advance",
                    icon: Calendar,
                    completed: true,
                    points: 150,
                  },
                  { title: "Social Traveler", desc: "Refer 5 friends", icon: Users, completed: false, points: 500 },
                  { title: "Streak Master", desc: "30-day login streak", icon: Flame, completed: false, points: 300 },
                  { title: "NFT Collector", desc: "Own 10 travel NFTs", icon: Gift, completed: false, points: 750 },
                  { title: "DeFi Pioneer", desc: "Stake for 6 months", icon: Zap, completed: true, points: 1000 },
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 ${achievement.completed ? "bg-green-500/10 border-green-500/20" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${achievement.completed ? "bg-green-500/20" : "bg-muted"}`}>
                          <achievement.icon
                            className={`h-5 w-5 ${achievement.completed ? "text-green-600" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                        </div>
                        {achievement.completed && (
                          <Badge className="bg-green-500 text-white">+{achievement.points}</Badge>
                        )}
                      </div>
                      {!achievement.completed && <Progress value={Math.random() * 80} className="h-2" />}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="grid gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Redeem Points</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "10% Booking Discount", cost: 1000, type: "discount" },
                    { title: "Exclusive NFT Drop", cost: 2500, type: "nft" },
                    { title: "Priority Support", cost: 500, type: "service" },
                    { title: "Free Airport Lounge", cost: 1500, type: "perk" },
                    { title: "Travel Insurance", cost: 800, type: "insurance" },
                    { title: "VIP Concierge", cost: 3000, type: "premium" },
                  ].map((reward) => (
                    <Card key={reward.title} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <h4 className="font-medium">{reward.title}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{reward.cost} points</span>
                          <Button
                            size="sm"
                            disabled={loyaltyPoints < reward.cost}
                            variant={loyaltyPoints >= reward.cost ? "default" : "outline"}
                          >
                            {loyaltyPoints >= reward.cost ? "Redeem" : "Need More"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
