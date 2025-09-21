"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Coins, Gift, Zap, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"

interface Farm {
  id: string
  name: string
  pair: string
  token0: string
  token1: string
  apy: number
  tvl: number
  dailyRewards: number
  multiplier: number
  isActive: boolean
  userStaked?: number
  userRewards?: number
}

const farms: Farm[] = [
  {
    id: "flr-xrp",
    name: "FLR-XRP LP",
    pair: "FLR/XRP",
    token0: "FLR",
    token1: "XRP",
    apy: 45.2,
    tvl: 1250000,
    dailyRewards: 2500,
    multiplier: 2.5,
    isActive: true,
    userStaked: 1200,
    userRewards: 15.6,
  },
  {
    id: "cribs-flr",
    name: "CRIBS-FLR LP",
    pair: "CRIBS/FLR",
    token0: "CRIBS",
    token1: "FLR",
    apy: 78.9,
    tvl: 850000,
    dailyRewards: 3200,
    multiplier: 3.0,
    isActive: true,
    userStaked: 0,
    userRewards: 0,
  },
  {
    id: "travel-xrp",
    name: "TRAVEL-XRP LP",
    pair: "TRAVEL/XRP",
    token0: "TRAVEL",
    token1: "XRP",
    apy: 62.4,
    tvl: 650000,
    dailyRewards: 1800,
    multiplier: 2.0,
    isActive: true,
    userStaked: 500,
    userRewards: 8.2,
  },
]

export function YieldFarming() {
  const { isConnected } = useWallet()
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
  const [lpAmount, setLpAmount] = useState("")
  const [showAddLiquidity, setShowAddLiquidity] = useState(false)

  const totalUserStaked = farms.reduce((sum, farm) => sum + (farm.userStaked || 0), 0)
  const totalUserRewards = farms.reduce((sum, farm) => sum + (farm.userRewards || 0), 0)

  const handleStakeLp = (farm: Farm) => {
    console.log("[v0] Staking LP tokens in farm:", farm.name, "Amount:", lpAmount)
    // Implement LP staking logic
  }

  const handleHarvest = (farm: Farm) => {
    console.log("[v0] Harvesting rewards from farm:", farm.name)
    // Implement harvest logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Yield Farming</h2>
        <p className="text-muted-foreground">Provide liquidity and earn high APY rewards</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalUserStaked.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Staked</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Gift className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">${totalUserRewards.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Pending Rewards</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">58.7%</p>
              <p className="text-sm text-muted-foreground">Avg APY</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Farms List */}
      <div className="space-y-4">
        {farms.map((farm, index) => (
          <motion.div
            key={farm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                {/* Farm Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold">{farm.token0.slice(0, 2)}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center -ml-2">
                        <span className="text-xs font-bold">{farm.token1.slice(0, 2)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{farm.name}</h3>
                      <p className="text-sm text-muted-foreground">{farm.pair}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/10 text-green-600">{farm.multiplier}x Multiplier</Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{farm.apy}%</p>
                      <p className="text-sm text-muted-foreground">APY</p>
                    </div>
                  </div>
                </div>

                {/* Farm Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">TVL</p>
                    <p className="font-medium">${farm.tvl.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Daily Rewards</p>
                    <p className="font-medium">{farm.dailyRewards.toLocaleString()} CRIBS</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Stake</p>
                    <p className="font-medium">${farm.userStaked?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending Rewards</p>
                    <p className="font-medium text-green-600">${farm.userRewards?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>

                {/* User Actions */}
                {farm.userStaked && farm.userStaked > 0 ? (
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Minus className="h-4 w-4 mr-2" />
                      Unstake
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleHarvest(farm)}>
                      <Gift className="h-4 w-4 mr-2" />
                      Harvest ${farm.userRewards?.toFixed(2)}
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add More
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label htmlFor={`lp-${farm.id}`}>LP Token Amount</Label>
                        <Input
                          id={`lp-${farm.id}`}
                          type="number"
                          placeholder="0.00"
                          value={lpAmount}
                          onChange={(e) => setLpAmount(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={() => handleStakeLp(farm)} disabled={!isConnected || !lpAmount}>
                          <Zap className="h-4 w-4 mr-2" />
                          Stake LP
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setShowAddLiquidity(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Liquidity to {farm.pair}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Liquidity Modal would go here */}
      {showAddLiquidity && (
        <Card className="p-6 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Liquidity</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddLiquidity(false)}>
                ×
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add equal values of both tokens to create LP tokens for farming
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>FLR Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div>
                <Label>XRP Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Liquidity
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
