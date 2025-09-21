"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/use-wallet"
import { Gift, Clock, Users, Coins, Trophy, Plane, Camera, Gem } from "lucide-react"
import { useState, useEffect } from "react"

interface RafflePrize {
  id: string
  title: string
  description: string
  value: number
  currency: "XRP" | "FLR"
  image: string
  type: "vacation" | "retreat" | "nft" | "discount"
  rarity: "common" | "rare" | "legendary"
}

const todaysPrizes: RafflePrize[] = [
  {
    id: "1",
    title: "7-Day Maldives Getaway",
    description: "Luxury overwater villa with all meals included",
    value: 5000,
    currency: "XRP",
    image: "/luxury-beachfront-villa-maldives.jpg",
    type: "vacation",
    rarity: "legendary",
  },
  {
    id: "2",
    title: "Swiss Alps Wellness Retreat",
    description: "3-day mountain spa experience",
    value: 1200,
    currency: "FLR",
    image: "/mountain-cabin-swiss-alps.jpg",
    type: "retreat",
    rarity: "rare",
  },
  {
    id: "3",
    title: "Crypto Cribs Genesis NFT",
    description: "Exclusive travel-themed digital collectible",
    value: 500,
    currency: "XRP",
    image: "/placeholder.svg?key=nft1",
    type: "nft",
    rarity: "rare",
  },
  {
    id: "4",
    title: "50% Off Next Booking",
    description: "Discount valid for 30 days",
    value: 200,
    currency: "FLR",
    image: "/placeholder.svg?key=discount1",
    type: "discount",
    rarity: "common",
  },
]

export function DailyRaffleCard() {
  const { metamaskConnected, gemConnected, activeWallet } = useWallet()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [currentPool, setCurrentPool] = useState(2847)
  const [userContribution, setUserContribution] = useState(0)
  const [contributionAmount, setContributionAmount] = useState(10)
  const [isContributing, setIsContributing] = useState(false)

  const isConnected = metamaskConnected || gemConnected
  const poolProgress = Math.min((currentPool / 5000) * 100, 100)
  const userTickets = Math.floor(userContribution / 5)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleContribute = async () => {
    if (!isConnected) return

    setIsContributing(true)

    // Simulate contribution transaction
    setTimeout(() => {
      setCurrentPool((prev) => prev + contributionAmount)
      setUserContribution((prev) => prev + contributionAmount)
      setIsContributing(false)
    }, 2000)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
      case "rare":
        return "text-purple-400 border-purple-400/20 bg-purple-400/10"
      case "common":
        return "text-blue-400 border-blue-400/20 bg-blue-400/10"
      default:
        return "text-gray-400 border-gray-400/20 bg-gray-400/10"
    }
  }

  const getPrizeIcon = (type: string) => {
    switch (type) {
      case "vacation":
        return Plane
      case "retreat":
        return Camera
      case "nft":
        return Gem
      case "discount":
        return Gift
      default:
        return Gift
    }
  }

  return (
    <Card className="p-6 bg-card border-border hover:border-primary/20 transition-all duration-300">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Daily Travel Raffle</h3>
              <p className="text-sm text-muted-foreground">Contribute to win amazing prizes</p>
            </div>
          </div>
          <Badge variant="outline" className="animate-pulse">
            Live Now
          </Badge>
        </div>

        {/* Countdown */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Time Remaining</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-background rounded p-2">
              <div className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </div>
            <div className="bg-background rounded p-2">
              <div className="text-2xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            <div className="bg-background rounded p-2">
              <div className="text-2xl font-bold text-primary">{timeLeft.seconds.toString().padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground">Seconds</div>
            </div>
          </div>
        </div>

        {/* Pool Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Liquidity Pool</span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">247 participants</span>
            </div>
          </div>
          <Progress value={poolProgress} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {currentPool} / 5,000 {activeWallet === "metamask" ? "FLR" : "XRP"}
            </span>
            <span className="text-primary font-medium">{poolProgress.toFixed(1)}%</span>
          </div>
        </div>

        {/* User Stats */}
        {isConnected && userContribution > 0 && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Your Contribution</div>
                <div className="text-lg font-bold text-primary">
                  {userContribution} {activeWallet === "metamask" ? "FLR" : "XRP"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Raffle Tickets</div>
                <div className="text-lg font-bold text-primary">{userTickets}</div>
              </div>
            </div>
          </div>
        )}

        {/* Contribution Interface */}
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(Number.parseInt(e.target.value) || 1)}
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Amount"
              />
              <span className="text-sm text-muted-foreground">{activeWallet === "metamask" ? "FLR" : "XRP"}</span>
            </div>
            <Button
              onClick={handleContribute}
              disabled={isContributing}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isContributing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Coins className="h-4 w-4" />
                  </motion.div>
                  Contributing...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Contribute {contributionAmount} {activeWallet === "metamask" ? "FLR" : "XRP"}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              1 ticket per 5 {activeWallet === "metamask" ? "FLR" : "XRP"} contributed
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Connect your wallet to participate</p>
            <Button variant="outline" className="w-full bg-transparent">
              Connect Wallet
            </Button>
          </div>
        )}

        {/* Today's Prizes */}
        <div className="space-y-3">
          <h4 className="font-semibold">Today's Prizes</h4>
          <div className="grid grid-cols-1 gap-3">
            {todaysPrizes.map((prize, index) => {
              const Icon = getPrizeIcon(prize.type)
              return (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${getRarityColor(prize.rarity)}`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={prize.image || "/placeholder.svg"}
                      alt={prize.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <h5 className="font-medium text-sm truncate">{prize.title}</h5>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{prize.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold">
                      {prize.value} {prize.currency}
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {prize.rarity}
                    </Badge>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Rules */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Winners announced daily at midnight UTC</p>
          <p>• Minimum contribution: 5 {activeWallet === "metamask" ? "FLR" : "XRP"}</p>
          <p>• Funds contribute to platform liquidity</p>
          <p>• Multiple entries allowed</p>
        </div>
      </div>
    </Card>
  )
}
