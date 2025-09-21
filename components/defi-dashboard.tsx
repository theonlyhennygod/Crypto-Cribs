"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Coins, Gift, Zap, BarChart3, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { StakingCard } from "./staking-card"
import { CrossChainBridge } from "./cross-chain-bridge"

export function DeFiDashboard() {
  const { isConnected, getStakingRewards } = useWallet()
  const [totalStaked, setTotalStaked] = useState(1250)
  const [totalRewards, setTotalRewards] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(2840)

  useEffect(() => {
    if (isConnected) {
      getStakingRewards().then(setTotalRewards)
    }
  }, [isConnected, getStakingRewards])

  const stakingAPY = 12.5
  const liquidityAPY = 18.2
  const bridgeVolume = 45600

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                +12.5%
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Coins className="h-5 w-5 text-secondary-foreground" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {stakingAPY}% APY
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStaked} FLR</p>
              <p className="text-sm text-muted-foreground">Total Staked</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                Claimable
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRewards.toFixed(2)} FLR</p>
              <p className="text-sm text-muted-foreground">Pending Rewards</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* DeFi Tabs */}
      <Tabs defaultValue="staking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="staking" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Staking
          </TabsTrigger>
          <TabsTrigger value="bridge" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Bridge
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StakingCard />

            {/* Staking Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Staking Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value Locked</span>
                    <span className="font-medium">$2.4M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Stakers</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Stake</span>
                    <span className="font-medium">892 FLR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rewards Distributed</span>
                    <span className="font-medium text-green-600">45,230 FLR</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="bridge" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CrossChainBridge />

            {/* Bridge Stats */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Bridge Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Volume</span>
                    <span className="font-medium">${bridgeVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Bridges</span>
                    <span className="font-medium">3,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Time</span>
                    <span className="font-medium">3.2 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-medium text-green-600">99.8%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Portfolio Breakdown</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Staked FLR</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>XRP Holdings</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Liquidity Pools</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">30-Day Return</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      +18.5%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Earned</span>
                    <span className="font-medium text-green-600">+$340</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Performing</span>
                    <span className="font-medium">FLR Staking</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                      Medium
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
