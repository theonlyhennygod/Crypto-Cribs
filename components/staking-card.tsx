"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Target, Gift, Zap } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"

export function StakingCard() {
  const { isConnected, flareWallet } = useWallet()
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakingGoal, setStakingGoal] = useState(1000)
  const [currentStaked, setCurrentStaked] = useState(350)

  const apy = 12.5 // 12.5% APY
  const estimatedRewards = (Number.parseFloat(stakeAmount || "0") * (apy / 100)) / 12 // Monthly rewards
  const progressPercentage = (currentStaked / stakingGoal) * 100

  const handleStake = () => {
    if (!isConnected || !stakeAmount) return

    // Implement Flare staking logic
    console.log("[v0] Staking", stakeAmount, "FLR for travel savings")
    setCurrentStaked((prev) => prev + Number.parseFloat(stakeAmount))
    setStakeAmount("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stake & Save for Travel</h3>
            <p className="text-sm text-muted-foreground">Earn rewards while saving for your next adventure</p>
          </div>

          {/* Current Staking Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Travel Savings Goal</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Target className="h-3 w-3 mr-1" />
                {stakingGoal} FLR
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {currentStaked} / {stakingGoal} FLR
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progressPercentage)}% complete • {stakingGoal - currentStaked} FLR to go
              </p>
            </div>
          </div>

          {/* APY Display */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current APY</span>
              <span className="text-lg font-bold text-primary">{apy}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Earn FLR rewards while your travel fund grows</p>
          </div>

          {/* Staking Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="stake-amount">Stake Amount (FLR)</Label>
              <div className="relative">
                <Input
                  id="stake-amount"
                  type="number"
                  placeholder="Enter FLR amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="pl-10"
                />
                <Coins className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {stakeAmount && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Estimated Monthly Rewards</span>
                </div>
                <p className="text-lg font-bold text-green-600">+{estimatedRewards.toFixed(2)} FLR</p>
              </div>
            )}

            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleStake}
              disabled={!isConnected || !stakeAmount || Number.parseFloat(stakeAmount) <= 0}
            >
              {isConnected ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Stake {stakeAmount || "0"} FLR
                </>
              ) : (
                "Connect Flare Wallet"
              )}
            </Button>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Staking Benefits:</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Earn {apy}% APY on staked FLR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Additional raffle entries for stakers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Exclusive booking discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Early access to premium properties</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
