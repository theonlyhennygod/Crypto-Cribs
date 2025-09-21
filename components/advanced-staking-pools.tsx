"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Zap, Star, Coins } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"

interface StakingPool {
  id: string
  name: string
  token: "FLR" | "XRP"
  apy: number
  lockPeriod: number
  minStake: number
  totalStaked: number
  maxCapacity: number
  rewards: string[]
  riskLevel: "Low" | "Medium" | "High"
  isActive: boolean
  specialFeatures?: string[]
}

const stakingPools: StakingPool[] = [
  {
    id: "travel-saver",
    name: "Travel Saver Pool",
    token: "FLR",
    apy: 12.5,
    lockPeriod: 0, // Flexible
    minStake: 100,
    totalStaked: 2450000,
    maxCapacity: 5000000,
    rewards: ["FLR", "Travel NFTs", "Booking Discounts"],
    riskLevel: "Low",
    isActive: true,
    specialFeatures: ["No lock period", "Travel rewards", "Instant unstaking"],
  },
  {
    id: "premium-traveler",
    name: "Premium Traveler",
    token: "XRP",
    apy: 18.2,
    lockPeriod: 90, // 90 days
    minStake: 500,
    totalStaked: 1200000,
    maxCapacity: 2000000,
    rewards: ["XRP", "Premium NFTs", "VIP Access"],
    riskLevel: "Medium",
    isActive: true,
    specialFeatures: ["Higher APY", "VIP property access", "Exclusive events"],
  },
  {
    id: "adventure-vault",
    name: "Adventure Vault",
    token: "FLR",
    apy: 25.8,
    lockPeriod: 180, // 180 days
    minStake: 1000,
    totalStaked: 800000,
    maxCapacity: 1500000,
    rewards: ["FLR", "Adventure NFTs", "Expedition Access"],
    riskLevel: "High",
    isActive: true,
    specialFeatures: ["Highest APY", "Adventure packages", "Rare NFT drops"],
  },
  {
    id: "liquid-staking",
    name: "Liquid Staking",
    token: "FLR",
    apy: 8.5,
    lockPeriod: 0,
    minStake: 50,
    totalStaked: 3200000,
    maxCapacity: 10000000,
    rewards: ["sFLR", "Trading Rewards"],
    riskLevel: "Low",
    isActive: true,
    specialFeatures: ["Receive sFLR tokens", "Trade while staking", "DeFi composability"],
  },
]

export function AdvancedStakingPools() {
  const { isConnected, flareWallet, xrplWallet } = useWallet()
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-500/10"
      case "Medium":
        return "text-yellow-600 bg-yellow-500/10"
      case "High":
        return "text-red-600 bg-red-500/10"
      default:
        return "text-gray-600 bg-gray-500/10"
    }
  }

  const getPoolProgress = (pool: StakingPool) => {
    return (pool.totalStaked / pool.maxCapacity) * 100
  }

  const handleStake = (pool: StakingPool) => {
    console.log("[v0] Staking in pool:", pool.name, "Amount:", stakeAmount)
    // Implement staking logic
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Advanced Staking Pools</h2>
        <p className="text-muted-foreground">Choose from multiple staking strategies to maximize your travel rewards</p>
      </div>

      <Tabs defaultValue="all-pools" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-pools">All Pools</TabsTrigger>
          <TabsTrigger value="flexible">Flexible</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
          <TabsTrigger value="liquid">Liquid</TabsTrigger>
        </TabsList>

        <TabsContent value="all-pools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPool(pool)}
                >
                  <div className="space-y-4">
                    {/* Pool Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{pool.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {pool.token}
                          </Badge>
                          <Badge className={getRiskColor(pool.riskLevel)}>{pool.riskLevel} Risk</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{pool.apy}%</p>
                        <p className="text-sm text-muted-foreground">APY</p>
                      </div>
                    </div>

                    {/* Pool Stats */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Pool Capacity</span>
                        <span>{((pool.totalStaked / pool.maxCapacity) * 100).toFixed(1)}% filled</span>
                      </div>
                      <Progress value={getPoolProgress(pool)} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Min Stake</p>
                          <p className="font-medium">
                            {pool.minStake} {pool.token}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lock Period</p>
                          <p className="font-medium">
                            {pool.lockPeriod === 0 ? "Flexible" : `${pool.lockPeriod} days`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Rewards</p>
                      <div className="flex flex-wrap gap-1">
                        {pool.rewards.map((reward) => (
                          <Badge key={reward} variant="secondary" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Special Features */}
                    {pool.specialFeatures && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Features</p>
                        <div className="space-y-1">
                          {pool.specialFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <Star className="h-3 w-3 text-primary" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      disabled={!isConnected}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStake(pool)
                      }}
                    >
                      {isConnected ? "Stake Now" : "Connect Wallet"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flexible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPools
              .filter((pool) => pool.lockPeriod === 0)
              .map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{pool.name}</h3>
                        <Badge className="bg-green-500/10 text-green-600">
                          <Zap className="h-3 w-3 mr-1" />
                          Flexible
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{pool.apy}%</p>
                        <p className="text-sm text-muted-foreground">APY</p>
                      </div>
                      <Button className="w-full">Stake {pool.token}</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="locked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPools
              .filter((pool) => pool.lockPeriod > 0 && pool.id !== "liquid-staking")
              .map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{pool.name}</h3>
                        <Badge className="bg-orange-500/10 text-orange-600">
                          <Lock className="h-3 w-3 mr-1" />
                          {pool.lockPeriod} days
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{pool.apy}%</p>
                        <p className="text-sm text-muted-foreground">APY</p>
                      </div>
                      <Button className="w-full">Stake {pool.token}</Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="liquid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPools
              .filter((pool) => pool.id === "liquid-staking")
              .map((pool) => (
                <motion.div key={pool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{pool.name}</h3>
                        <Badge className="bg-blue-500/10 text-blue-600">
                          <Coins className="h-3 w-3 mr-1" />
                          Liquid
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{pool.apy}%</p>
                        <p className="text-sm text-muted-foreground">APY + sFLR tokens</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-sm text-blue-600">
                          Receive sFLR tokens that represent your staked FLR. Trade, lend, or use in DeFi while earning
                          staking rewards.
                        </p>
                      </div>
                      <Button className="w-full">Stake & Get sFLR</Button>
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
