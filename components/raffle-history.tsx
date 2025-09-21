"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Calendar, User, ExternalLink } from "lucide-react"
import { useState } from "react"

interface RaffleWinner {
  id: string
  date: string
  winner: string
  prize: string
  value: number
  currency: "XRP" | "FLR"
  txHash: string
  image: string
}

const recentWinners: RaffleWinner[] = [
  {
    id: "1",
    date: "2024-01-19",
    winner: "sarah.eth",
    prize: "5-Day Tokyo Adventure",
    value: 3200,
    currency: "XRP",
    txHash: "0x1234...5678",
    image: "/modern-loft-tokyo-city-view.jpg",
  },
  {
    id: "2",
    date: "2024-01-18",
    winner: "crypto_nomad",
    prize: "Barcelona City Break",
    value: 800,
    currency: "FLR",
    txHash: "0x2345...6789",
    image: "/stylish-studio-barcelona-historic.jpg",
  },
  {
    id: "3",
    date: "2024-01-17",
    winner: "travel_dao",
    prize: "Crypto Cribs Platinum NFT",
    value: 1500,
    currency: "XRP",
    txHash: "0x3456...7890",
    image: "/placeholder.svg?key=nft2",
  },
  {
    id: "4",
    date: "2024-01-16",
    winner: "blockchain_explorer",
    prize: "Swiss Mountain Retreat",
    value: 2100,
    currency: "FLR",
    txHash: "0x4567...8901",
    image: "/mountain-cabin-swiss-alps.jpg",
  },
  {
    id: "5",
    date: "2024-01-15",
    winner: "defi_traveler",
    prize: "Miami Beach Penthouse",
    value: 4500,
    currency: "XRP",
    txHash: "0x5678...9012",
    image: "/oceanfront-penthouse-miami-beach.jpg",
  },
]

export function RaffleHistory() {
  const [showAll, setShowAll] = useState(false)
  const displayedWinners = showAll ? recentWinners : recentWinners.slice(0, 3)

  const formatAddress = (address: string) => {
    if (address.includes(".")) return address // ENS name
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Recent Winners</h3>
              <p className="text-sm text-muted-foreground">Latest raffle results</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {recentWinners.length} winners this week
          </Badge>
        </div>

        {/* Winners List */}
        <div className="space-y-4">
          {displayedWinners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              {/* Prize Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={winner.image || "/placeholder.svg"}
                  alt={winner.prize}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Winner Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{formatAddress(winner.winner)}</span>
                  <Badge variant="secondary" className="text-xs">
                    Winner
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-1 truncate">{winner.prize}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(winner.date)}</span>
                  </div>
                  <div className="font-mono">
                    {winner.value} {winner.currency}
                  </div>
                </div>
              </div>

              {/* Transaction Link */}
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
                onClick={() => window.open(`https://explorer.example.com/tx/${winner.txHash}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less */}
        {recentWinners.length > 3 && (
          <div className="text-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)} className="w-full">
              {showAll ? "Show Less" : `Show All ${recentWinners.length} Winners`}
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">247</div>
            <div className="text-xs text-muted-foreground">Total Winners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">89K</div>
            <div className="text-xs text-muted-foreground">XRP/FLR Distributed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1.2M</div>
            <div className="text-xs text-muted-foreground">Pool Contributions</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
