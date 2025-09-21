"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Gift, ExternalLink, Award } from "lucide-react"
import { useState } from "react"

interface TravelNFT {
  id: string
  name: string
  description: string
  image: string
  location: string
  date: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  benefits: string[]
  mintedOn: string
  tokenId: string
}

const mockNFTs: TravelNFT[] = [
  {
    id: "1",
    name: "Maldives Paradise Getaway",
    description: "Exclusive 7-day luxury villa experience in the Maldives",
    image: "/luxury-beachfront-villa-maldives.jpg",
    location: "Maldives, Indian Ocean",
    date: "Dec 2024",
    rarity: "Legendary",
    benefits: ["Free villa upgrade", "Private chef service", "Spa credits", "Airport transfers"],
    mintedOn: "2024-09-15",
    tokenId: "VCH-001",
  },
  {
    id: "2",
    name: "Tokyo Urban Explorer",
    description: "3-day cultural immersion in Tokyo with local guides",
    image: "/tokyo-cityscape-neon-lights.jpg",
    location: "Tokyo, Japan",
    date: "Jan 2025",
    rarity: "Epic",
    benefits: ["VIP restaurant access", "Private city tour", "Cultural workshops"],
    mintedOn: "2024-08-22",
    tokenId: "VCH-002",
  },
  {
    id: "3",
    name: "Swiss Alps Adventure",
    description: "Mountain retreat with skiing and wellness activities",
    image: "/swiss-alps-mountain-resort-snow.jpg",
    location: "Zermatt, Switzerland",
    date: "Feb 2025",
    rarity: "Rare",
    benefits: ["Ski pass included", "Mountain guide", "Wellness spa access"],
    mintedOn: "2024-07-10",
    tokenId: "VCH-003",
  },
]

export function NFTGallery() {
  const [selectedNFT, setSelectedNFT] = useState<TravelNFT | null>(null)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "Epic":
        return "bg-gradient-to-r from-purple-400 to-pink-500"
      case "Rare":
        return "bg-gradient-to-r from-blue-400 to-cyan-500"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Your Travel NFT Collection</h2>
        <p className="text-muted-foreground">Exclusive travel experiences and rewards earned through Crypto Cribs</p>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className="overflow-hidden bg-card border-border hover:border-primary/20 transition-all duration-300 group cursor-pointer">
              {/* NFT Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Rarity Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${getRarityColor(nft.rarity)} text-white border-0`}>
                    <Award className="h-3 w-3 mr-1" />
                    {nft.rarity}
                  </Badge>
                </div>

                {/* Token ID */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    #{nft.tokenId}
                  </Badge>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Location & Date */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{nft.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{nft.date}</span>
                  </div>
                </div>
              </div>

              {/* NFT Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {nft.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{nft.description}</p>
                </div>

                {/* Benefits Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {nft.benefits.slice(0, 2).map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                    {nft.benefits.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{nft.benefits.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Minted {nft.mintedOn}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedNFT(nft)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNFT(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedNFT.image || "/placeholder.svg"}
                alt={selectedNFT.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="absolute top-4 right-4">
                <Badge className={`${getRarityColor(selectedNFT.rarity)} text-white border-0`}>
                  <Award className="h-3 w-3 mr-1" />
                  {selectedNFT.rarity}
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedNFT.name}</h2>
                <p className="text-muted-foreground">{selectedNFT.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Location</p>
                  <p className="text-sm text-muted-foreground">{selectedNFT.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Travel Date</p>
                  <p className="text-sm text-muted-foreground">{selectedNFT.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Token ID</p>
                  <p className="text-sm text-muted-foreground">#{selectedNFT.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Minted</p>
                  <p className="text-sm text-muted-foreground">{selectedNFT.mintedOn}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Exclusive Benefits</p>
                <div className="space-y-2">
                  {selectedNFT.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-primary" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button variant="outline" onClick={() => setSelectedNFT(null)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
