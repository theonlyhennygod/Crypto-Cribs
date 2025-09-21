"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Star, Gift, Zap, Trophy, Coins, Calendar, MapPin } from "lucide-react"
import { useState } from "react"

interface LoyaltyTier {
  name: string
  level: number
  pointsRequired: number
  benefits: string[]
  color: string
  icon: any
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: "Explorer",
    level: 1,
    pointsRequired: 0,
    benefits: ["5% booking discount", "Basic customer support", "Monthly newsletter"],
    color: "from-gray-400 to-gray-500",
    icon: Star,
  },
  {
    name: "Adventurer",
    level: 2,
    pointsRequired: 1000,
    benefits: ["10% booking discount", "Priority support", "Exclusive property access", "Free cancellation"],
    color: "from-blue-400 to-cyan-500",
    icon: Zap,
  },
  {
    name: "Collector",
    level: 3,
    pointsRequired: 5000,
    benefits: [
      "15% booking discount",
      "VIP support",
      "Early property access",
      "Free upgrades",
      "Airport lounge access",
    ],
    color: "from-purple-400 to-pink-500",
    icon: Trophy,
  },
  {
    name: "Legend",
    level: 4,
    pointsRequired: 15000,
    benefits: [
      "20% booking discount",
      "Dedicated concierge",
      "Exclusive properties",
      "Free luxury upgrades",
      "Private jet discounts",
      "NFT rewards",
    ],
    color: "from-yellow-400 to-orange-500",
    icon: Crown,
  },
]

export function LoyaltyRewards() {
  const [currentPoints, setCurrentPoints] = useState(3250)
  const [currentTier, setCurrentTier] = useState(2) // Adventurer
  const [availableRewards, setAvailableRewards] = useState(850)

  const nextTier = loyaltyTiers[currentTier]
  const currentTierData = loyaltyTiers[currentTier - 1]
  const progressToNext = nextTier
    ? ((currentPoints - currentTierData.pointsRequired) / (nextTier.pointsRequired - currentTierData.pointsRequired)) *
      100
    : 100

  const recentActivities = [
    { type: "booking", description: "Booked Maldives Villa", points: 450, date: "2024-09-15" },
    { type: "referral", description: "Friend joined Crypto Cribs", points: 200, date: "2024-09-10" },
    { type: "review", description: "Left property review", points: 50, date: "2024-09-08" },
    { type: "stake", description: "Staked 100 FLR", points: 100, date: "2024-09-05" },
  ]

  const availableRewardsList = [
    { name: "Free Night Stay", cost: 500, description: "One free night at any property" },
    { name: "Airport Transfer", cost: 150, description: "Free airport pickup/dropoff" },
    { name: "Spa Credit", cost: 300, description: "$100 spa credit at partner locations" },
    { name: "Dining Voucher", cost: 200, description: "$50 dining credit" },
  ]

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentTierData.color} flex items-center justify-center`}
              >
                <currentTierData.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentTierData.name}</h2>
                <p className="text-muted-foreground">Level {currentTierData.level} Member</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{currentPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>

          {nextTier && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>
                  {currentPoints} / {nextTier.pointsRequired} points
                </span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {nextTier.pointsRequired - currentPoints} points until next tier
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Loyalty Tabs */}
      <Tabs defaultValue="benefits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="tiers">All Tiers</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Your Current Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTierData.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                  >
                    <Gift className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Available Rewards</h3>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-semibold">{availableRewards} points available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableRewardsList.map((reward, index) => (
              <motion.div
                key={reward.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{reward.name}</h4>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {reward.cost} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <Button
                    className="w-full"
                    disabled={availableRewards < reward.cost}
                    onClick={() => {
                      setAvailableRewards((prev) => prev - reward.cost)
                      console.log("[v0] Redeemed reward:", reward.name)
                    }}
                  >
                    {availableRewards >= reward.cost ? "Redeem" : "Insufficient Points"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {activity.type === "booking" && <MapPin className="h-5 w-5 text-primary" />}
                      {activity.type === "referral" && <Star className="h-5 w-5 text-primary" />}
                      {activity.type === "review" && <Trophy className="h-5 w-5 text-primary" />}
                      {activity.type === "stake" && <Coins className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    +{activity.points} pts
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loyaltyTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`p-6 ${currentTier === tier.level ? "border-primary bg-primary/5" : ""}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}
                    >
                      <tier.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{tier.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tier.pointsRequired === 0
                          ? "Starting tier"
                          : `${tier.pointsRequired.toLocaleString()} points required`}
                      </p>
                    </div>
                    {currentTier === tier.level && (
                      <Badge className="ml-auto bg-primary text-primary-foreground">Current</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm">
                        <Gift className="h-3 w-3 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
