"use client"

import { motion } from "framer-motion"
import { DeFiDashboard } from "@/components/defi-dashboard"
import { AdvancedStakingPools } from "@/components/advanced-staking-pools"
import { YieldFarming } from "@/components/yield-farming"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Coins,
  BarChart3,
  Zap,
  Target,
  Wallet,
  PiggyBank,
  Trophy,
  Sparkles,
  ArrowUpRight,
  DollarSign,
} from "lucide-react"
import { useState } from "react"

export default function DeFiPage() {
  const [totalSavings, setTotalSavings] = useState(12450)
  const [travelGoal, setTravelGoal] = useState(25000)
  const [monthlyContribution, setMonthlyContribution] = useState(850)

  const savingsProgress = (totalSavings / travelGoal) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
                DeFi Travel Hub
              </h1>
              <p className="text-xl text-muted-foreground">
                Earn while you save for your next adventure across multiple blockchains
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Next Trip Goal</div>
              <div className="text-2xl font-bold text-primary">${travelGoal.toLocaleString()}</div>
            </div>
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dream Trip to Japan</h3>
                  <p className="text-sm text-muted-foreground">2 weeks • Cherry Blossom Season</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                {Math.round(savingsProgress)}% Complete
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>
                  Progress: ${totalSavings.toLocaleString()} / ${travelGoal.toLocaleString()}
                </span>
                <span className="text-green-600 font-medium">+${monthlyContribution}/month</span>
              </div>
              <Progress value={savingsProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Started 8 months ago</span>
                <span>Est. completion: 14 months</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="staking"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              Staking
            </TabsTrigger>
            <TabsTrigger
              value="farming"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Coins className="h-4 w-4" />
              Yield Farming
            </TabsTrigger>
            <TabsTrigger
              value="savings"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <PiggyBank className="h-4 w-4" />
              Travel Savings
            </TabsTrigger>
            <TabsTrigger
              value="bridge"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Zap className="h-4 w-4" />
              Bridge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DeFiDashboard />
          </TabsContent>

          <TabsContent value="staking">
            <AdvancedStakingPools />
          </TabsContent>

          <TabsContent value="farming">
            <YieldFarming />
          </TabsContent>

          <TabsContent value="savings">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Saved</p>
                    <p className="text-2xl font-bold">${totalSavings.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12.5% this month</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Rewards Earned</p>
                    <p className="text-2xl font-bold">2,340 XRP</p>
                    <p className="text-xs text-purple-600">From staking & farming</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Monthly APY</p>
                    <p className="text-2xl font-bold">18.7%</p>
                    <p className="text-xs text-green-600">Compound interest</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Travel Savings Strategies</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Conservative Saver</h4>
                    <p className="text-sm text-muted-foreground mb-3">Low risk, steady returns</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">8-12% APY</span>
                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                    <h4 className="font-medium mb-2">Adventure Seeker</h4>
                    <p className="text-sm text-muted-foreground mb-3">Higher risk, maximum rewards</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">15-25% APY</span>
                      <Button size="sm">Current Plan</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bridge">
            <DeFiDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
