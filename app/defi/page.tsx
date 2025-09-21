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
  Plus,
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

      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              DeFi Travel Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Earn while you save for your next adventure across multiple blockchains with high-yield staking and farming
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <span className="font-semibold text-xl">Dream Trip to Japan</span>
              </div>
              <div className="text-lg text-muted-foreground">${totalSavings.toLocaleString()} saved</div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-sm text-muted-foreground">Goal: ${travelGoal.toLocaleString()}</div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                {Math.round(savingsProgress)}% Complete
              </Badge>
            </div>
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Travel Savings Progress</h3>
                <p className="text-sm text-muted-foreground">2 weeks in Japan • Cherry Blossom Season</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>
                  Progress: ${totalSavings.toLocaleString()} / ${travelGoal.toLocaleString()}
                </span>
                <span className="text-green-600 font-medium">+${monthlyContribution}/month</span>
              </div>
              <Progress value={savingsProgress} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground">Started</div>
                  <div className="font-medium">8 months ago</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Monthly APY</div>
                  <div className="font-medium text-green-600">18.7%</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Est. completion</div>
                  <div className="font-medium">6 months</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-8">
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
              Farming
            </TabsTrigger>
            <TabsTrigger
              value="savings"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <PiggyBank className="h-4 w-4" />
              Savings
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
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-4">Smart Travel Savings</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Maximize your travel fund with automated DeFi strategies designed for adventurers
                </p>
              </motion.div>

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
                    <p className="text-sm text-muted-foreground">Average APY</p>
                    <p className="text-2xl font-bold">18.7%</p>
                    <p className="text-xs text-green-600">Compound interest</p>
                  </div>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Travel Savings Strategies</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Conservative Saver</h4>
                        <Badge variant="outline">8-12% APY</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Low risk, steady returns with stable coins</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Risk Level: Low</span>
                        <Button size="sm" variant="outline">
                          Select Plan
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Adventure Seeker</h4>
                        <Badge className="bg-primary text-primary-foreground">15-25% APY</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Higher risk, maximum rewards with yield farming</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Risk Level: High</span>
                        <Button size="sm">Current Plan</Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Balanced Explorer</h4>
                        <Badge variant="secondary">12-18% APY</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Moderate risk with diversified portfolio</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Risk Level: Medium</span>
                        <Button size="sm" variant="outline">
                          Switch Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Savings Goals</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Japan Trip</span>
                        <span className="text-sm text-muted-foreground">${Math.round(savingsProgress)}%</span>
                      </div>
                      <Progress value={savingsProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${totalSavings.toLocaleString()}</span>
                        <span>${travelGoal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Europe Backpacking</span>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$3,750</span>
                        <span>$15,000</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Safari Adventure</span>
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$2,000</span>
                        <span>$20,000</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Goal
                    </Button>
                  </div>
                </Card>
              </div>
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
